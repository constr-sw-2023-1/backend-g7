const pool = require('../utils/database');

class StudentModel {

    static async createStudent(student) {
        try {
            const query = 'INSERT INTO aluno (aluno_id, matricula, nome, email, curso) VALUES ($1, $2, $3, $4, $5) RETURNING *';
            const values = [
                student.id,
                student.registration,
                student.name,
                student.email,
                student.course
            ];

            const result = await pool.query(query, values);

            const createdStudent = result.rows[0];

            if (student.curriculum) {
                const {schooling, professionalExperience} = student.curriculum;

                if (schooling && Array.isArray(schooling)) {
                    for (const education of schooling) {
                        const educationQuery = 'INSERT INTO formacao (aluno_id, escolaridade, conclusao, instituicao) VALUES ($1, $2, $3, $4)';
                        const educationValues = [
                            createdStudent.aluno_id,
                            education.graduation,
                            education.conclusion,
                            education.institution
                        ];

                        await pool.query(educationQuery, educationValues);
                    }
                }

                if (professionalExperience && Array.isArray(professionalExperience)) {
                    for (const experience of professionalExperience) {
                        const experienceQuery = 'INSERT INTO experiencia_profissional (aluno_id, cargo, empresa_id, data_inicio, data_termino, em_andamento) VALUES ($1, $2, $3, $4, $5, $6)';
                        const experienceValues = [
                            createdStudent.aluno_id,
                            experience.position,
                            experience.contractor,
                            experience.contractTime.startDate,
                            experience.contractTime.endDate,
                            experience.contractTime.ongoing
                        ];

                        await pool.query(experienceQuery, experienceValues);
                    }
                }
            }
            return createdStudent;
        } catch (error) {
            throw new Error(`Erro ao criar aluno: ${error.message}`);
        }
    }

    static async deleteStudent(id) {
        try {
            const deleteExperienceQuery = 'DELETE FROM experiencia_profissional WHERE aluno_id = $1';
            await pool.query(deleteExperienceQuery, [id]);

            const deleteEducationQuery = 'DELETE FROM formacao WHERE aluno_id = $1';
            await pool.query(deleteEducationQuery, [id]);

            const deleteStudentQuery = 'DELETE FROM aluno WHERE aluno_id = $1';
            await pool.query(deleteStudentQuery, [id]);

            return true;
        } catch (error) {
            throw new Error(`Erro ao excluir aluno: ${error.message}`);
        }
    }

    static async updateStudent(id, newData) {
        try {
            const checkQuery = 'SELECT * FROM aluno WHERE aluno_id = $1';
            const checkResult = await pool.query(checkQuery, [id]);

            if (checkResult.rows.length === 0) {
                throw new Error('Aluno não encontrado');
            }

            const updateAlunoQuery = `
      UPDATE aluno
      SET
        nome = $1,
        email = $2,
        curso = $3
      WHERE aluno_id = $4
      RETURNING *
    `;

            const updateAlunoValues = [
                newData.nome,
                newData.email,
                newData.curso,
                id
            ];

            const alunoResult = await pool.query(updateAlunoQuery, updateAlunoValues);

            const updateExperienceQuery = `
      UPDATE experiencia_profissional
      SET
        cargo = $1,
        empresa_id = $2,
        data_inicio = $3,
        data_termino = $4,
        em_andamento = $5
      WHERE aluno_id = $6
      RETURNING *
    `;

            const updateFormacaoQuery = `
      UPDATE formacao
      SET
        escolaridade = $1,
        conclusao = $2,
        instituicao = $3
      WHERE aluno_id = $4
      RETURNING *
    `;

            const curriculum = newData.curriculum;

            const updateExperiencePromises = curriculum.professionalExperience.map(async (experience) => {
                const updateExperienceValues = [
                    experience.position,
                    experience.contractor,
                    experience.contractTime.startDate,
                    experience.contractTime.endDate,
                    experience.contractTime.ongoing,
                    id
                ];

                return pool.query(updateExperienceQuery, updateExperienceValues);
            });

            const updateFormacaoPromises = curriculum.schooling.map(async (schooling) => {
                const updateFormacaoValues = [
                    schooling.graduation,
                    schooling.conclusion,
                    schooling.institution,
                    id
                ];

                return pool.query(updateFormacaoQuery, updateFormacaoValues);
            });

            const experienceResults = await Promise.all(updateExperiencePromises);
            const formacaoResults = await Promise.all(updateFormacaoPromises);

            await pool.query('COMMIT');

            if (alunoResult.rows.length === 0 || experienceResults.some((result) => result.rows.length === 0) || formacaoResults.some((result) => result.rows.length === 0)) {
                throw new Error('Falha ao atualizar o aluno');
            }

            return {
                aluno: alunoResult.rows[0],
                curriculum: {
                    professionalExperience: experienceResults.map((result) => result.rows[0]),
                    schooling: formacaoResults.map((result) => result.rows[0])
                }
            };
        } catch (error) {
            await pool.query('ROLLBACK');
            throw new Error(`Erro ao atualizar o aluno: ${error.message}`);
        }
    }

    static async updateStudentByAttribute(id, newData) {

    }

    static async listStudents() {
        try {
            const query = 'SELECT * FROM aluno';
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`Erro ao listar estudantes: ${error.message}`);
        }
    }

    static async listStudentById(id) {
        try {
            const query = 'SELECT * FROM aluno WHERE aluno_id = $1';
            const values = [id];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao obter estudante por ID: ${error.message}`);
        }
    }

    static async listStudentByQueryString(filters) {
        try {
            let sql = 'SELECT * FROM aluno';
            const values = [];

            if (Object.keys(filters).length > 0) {
                sql += ' WHERE ';
                Object.keys(filters).forEach((key, index) => {
                    if (index > 0) {
                        sql += ' AND ';
                    }

                    const filterValue = filters[key];
                    let filterOperator = '=';

                    if (typeof filterValue === 'string') {
                        if (/^\d+$/.test(filterValue)) {
                            filterOperator = '=';
                            values.push(parseInt(filterValue));
                        } else {
                            filterOperator = 'ILIKE';
                            values.push(filterValue.toLowerCase());
                        }
                    }
                    sql += `${key} ${filterOperator} $${index + 1}`;
                });
            }
            const result = await pool.query(sql, values);
            return result.rows;
        } catch (error) {
            throw new Error(`Erro ao listar alunos por filtros: ${error.message}`);
        }
    }

    static async listStudentByComplexQueryString(resource, query) {
    }
}

module.exports = StudentModel;