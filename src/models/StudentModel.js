const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'root',
  password: 'root',
  database: 'studentDb'
});

class StudentModel {

  //  Create a new student ( Funcionando )
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

      // Verifica se o currículo está presente e atribui as informações correspondentes
      if (student.curriculum) {
        const { schooling, professionalExperience } = student.curriculum;

        // Insere as informações de escolaridade (schooling) na tabela formacao
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

        // Insere as informações de experiência profissional (professionalExperience) na tabela experiencia_profissional
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

  //  Delete a student
  static async deleteStudent(id) {
    try {
      // Excluir registros relacionados da tabela experiencia_profissional
      const deleteExperienceQuery = 'DELETE FROM experiencia_profissional WHERE aluno_id = $1';
      await pool.query(deleteExperienceQuery, [id]);

      // Excluir registros relacionados da tabela formacao
      const deleteEducationQuery = 'DELETE FROM formacao WHERE aluno_id = $1';
      await pool.query(deleteEducationQuery, [id]);

      // Excluir aluno da tabela aluno
      const deleteStudentQuery = 'DELETE FROM aluno WHERE aluno_id = $1';
      await pool.query(deleteStudentQuery, [id]);

      return true;
    } catch (error) {
      throw new Error(`Erro ao excluir aluno: ${error.message}`);
    }
  }

  //  Update a student
  static async updateStudent(id, newData) {
  }

  //  Update a student by attribute
  static async updateStudentByAttribute(id, newData) {
  }

  //  List all students ( Funcionando )
  static async listStudents() {
    try {
      const query = 'SELECT * FROM aluno';
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao listar estudantes: ${error.message}`);
    }
  }

  //  List a student by ID ( Funcionando )
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

  //  List a student by simple query string
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
              // O valor é uma string que contém apenas dígitos (inteiro)
              filterOperator = '=';
              values.push(parseInt(filterValue));
            } else {
              // O valor é uma string que não é um inteiro
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

  // List a student by complex query string
  static async listStudentByComplexQueryString(resource, query) {
  }
}

module.exports = StudentModel;