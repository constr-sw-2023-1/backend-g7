const pool = require('../utils/database');

class StudentModel {

    static async createStudent(student) {
        try {
            const query = 'INSERT INTO student (registration, name, email, course) VALUES ($1, $2, $3, $4) RETURNING *';
            const values = [
                student.registration,
                student.name,
                student.email,
                student.course
            ];

            const result = await pool.query(query, values);

            const createdStudent = result.rows[0];

            if (student.curriculum) {
                const {schooling, professional_experience} = student.curriculum;

                if (schooling && Array.isArray(schooling)) {
                    for (const education of schooling) {
                        const educationQuery = 'INSERT INTO schooling (student_id, graduation, conclusion, institution) VALUES ($1, $2, $3, $4)';
                        const educationValues = [
                            createdStudent.student_id,
                            education.graduation,
                            education.conclusion,
                            education.institution
                        ];

                        await pool.query(educationQuery, educationValues);
                    }
                }

                if (professional_experience && Array.isArray(professional_experience)) {
                    for (const experience of professional_experience) {
                        const experienceQuery = 'INSERT INTO professional_experience (student_id, position, contractor_id, start_Date, end_Date, ongoing) VALUES ($1, $2, $3, $4, $5, $6)';
                        const experienceValues = [
                            createdStudent.student_id,
                            experience.position,
                            experience.contractor_id,
                            experience.contractTime.start_Date,
                            experience.contractTime.end_Date,
                            experience.contractTime.ongoing
                        ];

                        await pool.query(experienceQuery, experienceValues);
                    }
                }
            }
            return createdStudent;
        } catch (error) {
            throw new Error(`Error When Creating Student: ${error.message}`);
        }
    }

    static async deleteStudent(id) {
        try {
            const deleteExperienceQuery = 'DELETE FROM professional_experience WHERE student_id = $1';
            await pool.query(deleteExperienceQuery, [id]);

            const deleteEducationQuery = 'DELETE FROM schooling WHERE student_id = $1';
            await pool.query(deleteEducationQuery, [id]);

            const deleteStudentQuery = 'DELETE FROM student WHERE student_id = $1';
            await pool.query(deleteStudentQuery, [id]);

            return true;
        } catch (error) {
            throw new Error(`Error When Deleting Student: ${error.message}`);
        }
    }

    static async updateStudent(id, newData) {
        try {
            const checkQuery = 'SELECT * FROM student WHERE student_id = $1';
            const checkResult = await pool.query(checkQuery, [id]);

            if (checkResult.rows.length === 0) {
                throw new Error('User Not Found');
            }

            const updateStudentQuery = `
      UPDATE student
      SET
        name = $1,
        email = $2,
        course = $3
      WHERE student_id = $4
      RETURNING *
    `;

            const updateStudentValues = [
                newData.name,
                newData.email,
                newData.course,
                id
            ];

            const studentResult = await pool.query(updateStudentQuery, updateStudentValues);

            const updateExperienceQuery = `
      UPDATE professional_experience 
      SET
        position = $1,
        contractor_id = $2,
        start_Date = $3,
        end_Date = $4,
        ongoing = $5
      WHERE student_id = $6
      RETURNING *
    `;

            const updateFormacaoQuery = `
      UPDATE schooling 
      SET
        graduation = $1,
        conclusion = $2,
        institution = $3
      WHERE student_id = $4
      RETURNING *
    `;

            const curriculum = newData.curriculum;

            const updateExperiencePromises = curriculum.professional_experience.map(async (experience) => {
                const updateExperienceValues = [
                    experience.position,
                    experience.contractor_id,
                    experience.contractTime.start_Date,
                    experience.contractTime.end_Date,
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

            if (studentResult.rows.length === 0 || experienceResults.some((result) => result.rows.length === 0) || formacaoResults.some((result) => result.rows.length === 0)) {
                throw new Error('Failed To Update The Student');
            }

            return {
                student: studentResult.rows[0],
                curriculum: {
                    professional_experience: experienceResults.map((result) => result.rows[0]),
                    schooling: formacaoResults.map((result) => result.rows[0])
                }
            };
        } catch (error) {
            await pool.query('ROLLBACK');
            throw new Error(`Failed To Update The Student: ${error.message}`);
        }
    }

    static async updateStudentByAttribute(id, newData) {

    }

    static async listStudents() {
        try {
            const query = 'SELECT * FROM student';
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`Error When Listing Students: ${error.message}`);
        }
    }

    static async listStudentById(id) {
        try {
            const query = 'SELECT * FROM student WHERE student_id = $1';
            const values = [id];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error When Retrieving Student By ID: ${error.message}`);
        }
    }

    static async listStudentByQueryString(filters) {
        try {
            let sql = 'SELECT * FROM student';
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
            throw new Error(`Error When Listing Students By Filters: ${error.message}`);
        }
    }

    static async listStudentByComplexQueryString(resource, query) {
    }
}

module.exports = StudentModel;