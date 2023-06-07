const pool = require('../utils/database');

class StudentModel {

    
    static async createStudent(student) {
        try {
            const createStudentQuery = 'INSERT INTO student (registration, name, email, course) VALUES ($1, $2, $3, $4) RETURNING *';
            const studentValues = [
                student.registration,
                student.name,
                student.email,
                student.course
            ];

            const studentResult = await pool.query(createStudentQuery, studentValues);
            const createdStudent = studentResult.rows[0];
            createdStudent.schooling = [];
            createdStudent.professional_experience = [];

            if (student.curriculum) {
                const {schooling, professional_experience} = student.curriculum;

                if (schooling && Array.isArray(schooling)) {
                    for (const education of schooling) {
                        const createSchoolingQuery = 'INSERT INTO schooling (student_id, graduation, conclusion, institution) VALUES ($1, $2, $3, $4) RETURNING *';
                        const educationValues = [
                            createdStudent.student_id,
                            education.graduation,
                            education.conclusion,
                            education.institution
                        ];

                        const educationResult = await pool.query(createSchoolingQuery, educationValues);
                        const createdEducation = educationResult.rows[0];
                        createdStudent.schooling.push(createdEducation);
                    }
                }

                if (professional_experience && Array.isArray(professional_experience)) {
                    for (const experience of professional_experience) {
                        const createExperienceQuery = 'INSERT INTO professional_experience (student_id, position, contractor_id, start_Date, end_Date, ongoing) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
                        const experienceValues = [
                            createdStudent.student_id,
                            experience.position,
                            experience.contractor_id,
                            experience.contractTime.start_date,
                            experience.contractTime.end_date,
                            experience.contractTime.ongoing
                        ];

                        const experienceResult = await pool.query(createExperienceQuery, experienceValues);
                        const createdExperience = experienceResult.rows[0];
                        createdStudent.professional_experience.push(createdExperience);
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
            const selectQuery = 'SELECT * FROM student WHERE student_id = $1';
            const selectResult = await pool.query(selectQuery, [id]);

            if (selectResult.rowCount === 0) {
                return false;
            }

            const updateQuery = 'UPDATE student SET enabled = FALSE WHERE student_id = $1';
            await pool.query(updateQuery, [id]);

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

            const requiredFields = ['name', 'email', 'course', 'enabled'];
            const missingFields = requiredFields.filter(field => !newData.hasOwnProperty(field));

            if (missingFields.length > 0) {
                const missingFieldsMessage = `Missing fields: ${missingFields.join(', ')}`;
                throw new Error(missingFieldsMessage);
            }

            const updateStudentQuery = `
      UPDATE student
      SET
        name = $1,
        email = $2,
        course = $3,
        enabled = $4    
      WHERE student_id = $5
      RETURNING *
    `;

            const updateStudentValues = [
                newData.name,
                newData.email,
                newData.course,
                newData.enabled,
                id
            ];

            const studentResult = await pool.query(updateStudentQuery, updateStudentValues);

            if (studentResult.rows.length === 0) {
                throw new Error('Failed to update the student');
            }

            return {
                student: studentResult.rows[0]
            };
        } catch (error) {
            throw new Error(`Failed to update the student: ${error.message}`);
        }
    }

    
    static async updateStudentByAttribute(id, newData) {
        try {
            const checkQuery = 'SELECT * FROM student WHERE student_id = $1';
            const checkResult = await pool.query(checkQuery, [id]);

            if (checkResult.rows.length === 0) {
                throw new Error('User Not Found');
            }

            const existingData = checkResult.rows[0];

            const updateStudentQuery = `
      UPDATE student
      SET
        name = $1,
        email = $2,
        course = $3,
        enabled = $4
      WHERE student_id = $5
      RETURNING *
    `;

            const updateStudentValues = [
                newData.name || existingData.name,
                newData.email || existingData.email,
                newData.course || existingData.course,
                newData.enabled !== undefined ? (newData.enabled ? 'true' : 'false') : existingData.enabled,
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

            const curriculum = newData.curriculum || {};
            const updateExperiencePromises = Array.isArray(curriculum.professional_experience) ? curriculum.professional_experience.map(async (experience) => {
                const updateExperienceValues = [
                    experience.position,
                    experience.contractor_id,
                    experience.contractTime.start_Date,
                    experience.contractTime.end_Date,
                    experience.contractTime.ongoing,
                    id
                ];

                return pool.query(updateExperienceQuery, updateExperienceValues);
            }) : [];

            const updateFormacaoPromises = Array.isArray(curriculum.schooling) ? curriculum.schooling.map(async (schooling) => {
                const updateFormacaoValues = [
                    schooling.graduation,
                    schooling.conclusion,
                    schooling.institution,
                    id
                ];

                return pool.query(updateFormacaoQuery, updateFormacaoValues);
            }) : [];

            const experienceResults = await Promise.all(updateExperiencePromises);
            const formacaoResults = await Promise.all(updateFormacaoPromises);

            await pool.query('COMMIT');

            if (
                studentResult.rows.length === 0 ||
                experienceResults.some((result) => result.rows.length === 0) ||
                formacaoResults.some((result) => result.rows.length === 0)
            ) {
                throw new Error('Failed To Update The Student');
            }

            return await this.listStudentById(id);
        } catch (error) {
            await pool.query('ROLLBACK');
            throw new Error(`Failed To Update The Student: ${error.message}`);
        }
    }

    
    static async listStudents() {
        try {
            const query = `
            SELECT s.*, se.schooling_id, se.graduation, se.conclusion, se.institution, pe.experience_id, pe.position, pe.contractor_id, pe.start_date, pe.end_date, pe.ongoing
            FROM student s
            LEFT JOIN schooling se ON s.student_id = se.student_id
            LEFT JOIN professional_experience pe ON s.student_id = pe.student_id
        `;
            const result = await pool.query(query);
            const students = {};

            for (const row of result.rows) {
                const studentId = row.student_id;

                if (!students[studentId]) {
                    students[studentId] = {
                        student_id: row.student_id,
                        registration: row.registration,
                        name: row.name,
                        email: row.email,
                        course: row.course,
                        enabled: row.enabled,
                        schooling: [],
                        professional_experience: []
                    };
                }

                if (row.schooling_id) {
                    students[studentId].schooling.push({
                        schooling_id: row.schooling_id,
                        graduation: row.graduation,
                        conclusion: row.conclusion,
                        institution: row.institution
                    });
                }

                if (row.experience_id) {
                    students[studentId].professional_experience.push({
                        experience_id: row.experience_id,
                        position: row.position,
                        contractor_id: row.contractor_id,
                        start_date: row.start_date,
                        end_date: row.end_date,
                        ongoing: row.ongoing
                    });
                }
            }

            const studentList = Object.values(students);

            return {
                students: studentList
            };
        } catch (error) {
            throw new Error(`Error When Listing Students: ${error.message}`);
        }
    }

    
    static async listStudentById(id) {
        try {
            const query = `
            SELECT s.*, se.schooling_id, se.graduation, se.conclusion, se.institution, pe.experience_id, pe.position, pe.contractor_id, pe.start_date, pe.end_date, pe.ongoing
            FROM student s
            LEFT JOIN schooling se ON s.student_id = se.student_id
            LEFT JOIN professional_experience pe ON s.student_id = pe.student_id
            WHERE s.student_id = $1
        `;
            const values = [id];
            const result = await pool.query(query, values);
            const student = {};

            for (const row of result.rows) {
                const studentId = row.student_id;

                if (!student.student_id) {
                    student.student_id = row.student_id;
                    student.registration = row.registration;
                    student.name = row.name;
                    student.email = row.email;
                    student.course = row.course;
                    student.enabled = row.enabled;
                    student.schooling = [];
                    student.professional_experience = [];
                }

                if (row.schooling_id) {
                    student.schooling.push({
                        schooling_id: row.schooling_id,
                        graduation: row.graduation,
                        conclusion: row.conclusion,
                        institution: row.institution
                    });
                }

                if (row.experience_id) {
                    student.professional_experience.push({
                        experience_id: row.experience_id,
                        position: row.position,
                        contractor_id: row.contractor_id,
                        start_date: row.start_date,
                        end_date: row.end_date,
                        ongoing: row.ongoing
                    });
                }
            }

            return student;
        } catch (error) {
            throw new Error(`Error When Retrieving Student By ID: ${error.message}`);
        }
    }

    
    static async listStudentByQueryString(filters) {
        try {
            let sql = `
      SELECT s.student_id, s.registration, s.name, s.email, s.course, s.enabled, array_agg(DISTINCT se.schooling_id) AS schooling_ids, array_agg(DISTINCT se.graduation) AS graduations, array_agg(DISTINCT se.conclusion) AS conclusions, array_agg(DISTINCT se.institution) AS institutions, array_agg(DISTINCT pe.experience_id) AS experience_ids, array_agg(DISTINCT pe.position) AS positions, array_agg(DISTINCT pe.contractor_id) AS contractor_ids, array_agg(DISTINCT pe.start_date) AS start_dates, array_agg(DISTINCT pe.end_date) AS end_dates, array_agg(DISTINCT pe.ongoing) AS ongoing_list, array_agg(DISTINCT c.taxpayeridnum) AS taxpayeridnums, array_agg(DISTINCT c.contractor) AS contractors
      FROM student AS s
      LEFT JOIN schooling AS se ON s.student_id = se.student_id
      LEFT JOIN professional_experience AS pe ON s.student_id = pe.student_id
      LEFT JOIN contractors AS c ON pe.contractor_id = c.contractor_id
      WHERE `;
            const values = [];

            const filterConditions = [];
            Object.entries(filters).forEach(([key, value], index) => {
                let filterOperator = '=';

                if (key === 'enabled') {
                    if (value === 'true') {
                        filterConditions.push(`s.${key} ${filterOperator} $${index + 1}`);
                        values.push(true);
                    } else if (value === 'false') {
                        filterConditions.push(`s.${key} ${filterOperator} $${index + 1}`);
                        values.push(false);
                    }
                } else if (typeof value === 'string') {
                    if (/^\d+$/.test(value)) {
                        filterOperator = '=';
                        filterConditions.push(`s.${key} ${filterOperator} $${index + 1}`);
                        values.push(parseInt(value));
                    } else {
                        filterOperator = 'ILIKE';
                        filterConditions.push(`s.${key} ${filterOperator} $${index + 1}`);
                        values.push(value.toLowerCase());
                    }
                }
            });

            sql += filterConditions.join(' AND ');
            sql += `
      GROUP BY s.student_id
    `;

            const result = await pool.query(sql, values);
            const students = result.rows.map(row => ({
                student_id: row.student_id,
                registration: row.registration,
                name: row.name,
                email: row.email,
                course: row.course,
                enabled: row.enabled,
                graduation: row.schooling_ids.map((id, index) => ({
                    schooling_id: id,
                    graduation: row.graduations[index],
                    conclusion: row.conclusions[index],
                    institution: row.institutions[index],
                })),
                professional_experience: row.experience_ids.map((id, index) => ({
                    experience_id: id,
                    position: row.positions[index],
                    contractor_id: row.contractor_ids[index],
                    start_date: row.start_dates[index],
                    end_date: row.end_dates[index],
                    ongoing: row.ongoing_list[index],
                    taxpayeridnum: row.taxpayeridnums[index],
                    contractor: row.contractors[index],
                })),
            }));

            return students;
        } catch (error) {
            throw new Error(`Error When Listing Students By Filters: ${error.message}`);
        }
    }

    
    static async listStudentsWithOperators(filters) {
        try {
            let sql = `
    SELECT s.student_id, s.registration, s.name, s.email, s.course, s.enabled,
           se.schooling_id, se.graduation, se.conclusion, se.institution,
           pe.experience_id, pe.position, pe.contractor_id, pe.start_date, pe.end_date, pe.ongoing,
           c.contractor
    FROM student AS s
    LEFT JOIN schooling AS se ON s.student_id = se.student_id
    LEFT JOIN professional_experience AS pe ON s.student_id = pe.student_id
    LEFT JOIN contractors AS c ON pe.contractor_id = c.contractor_id`;

            const values = [];
            const operators = {
                eq: '=',
                neq: '<>',
                gt: '>',
                gteq: '>=',
                lt: '<',
                lteq: '<=',
                like: 'ILIKE',
            };

            if (filters.length > 0) {
                sql += ' WHERE ';
                const filterConditions = [];

                filters.forEach(([key, value]) => {
                    const operator = value.match(/{(.*?)}/)[1];
                    const param = key.replace(/{.*?}/g, '');
                    const filterOperator = operators[operator];

                    if (!filterOperator) {
                        throw new Error(`Invalid operator: ${operator}`);
                    }

                    let filterValue = value;
                    if (typeof filterValue === 'string') {
                        filterValue = filterValue.replace(/{.*?}/g, '');
                    }

                    let parsedValue;
                    if (filterOperator === 'like') {
                        parsedValue = `%${filterValue}%`;
                    } else if (/^\d+$/.test(filterValue)) {
                        parsedValue = parseInt(filterValue);
                    } else {
                        parsedValue = filterValue;
                    }

                    console.log(filterConditions);

                    filterConditions.push(`s.${param} ${filterOperator} $${values.length + 1}`);
                    values.push(parsedValue);
                });

                sql += filterConditions.join(' AND ');
            }

            const result = await pool.query(sql, values);

            const students = {};
            result.rows.forEach(row => {
                const studentId = row.student_id;
                if (!students[studentId]) {
                    students[studentId] = {
                        student_id: studentId,
                        registration: row.registration,
                        name: row.name,
                        email: row.email,
                        course: row.course,
                        enabled: row.enabled,
                        schooling: [],
                        experiences: [],
                    };
                }

                if (row.schooling_id) {
                    students[studentId].schooling.push({
                        schooling_id: row.schooling_id,
                        graduation: row.graduation,
                        conclusion: row.conclusion,
                        institution: row.institution,
                    });
                }

                if (row.experience_id) {
                    students[studentId].experiences.push({
                        experience_id: row.experience_id,
                        position: row.position,
                        contractor_id: row.contractor_id,
                        start_date: row.start_date,
                        end_date: row.end_date,
                        ongoing: row.ongoing,
                        contractor: row.contractor,
                    });
                }
            });

            const formattedStudents = Object.values(students);

            return {
                students: formattedStudents.length > 0 ? formattedStudents : null
            };
        } catch (error) {
            throw new Error(`Error When Listing Students With Operators: ${error.message}`);
        }
    }
}

module.exports = StudentModel;