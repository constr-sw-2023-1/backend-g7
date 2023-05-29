const StudentModel = require('../models/StudentModel');

async function createStudent (req, res) {
    try {
        const student = await StudentModel.createStudent(req.body);
        res.status(201).send({
            message: "Student Created Successfully",
            data: student
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

async function deleteStudent(req, res) {
    try {
        const deleted = await StudentModel.deleteStudent(req.params.id);

        if (!deleted) {
            return res.status(404).send({ message: 'Student Not Found' });
        }

        return res.status(200).send({
            message: 'Student Deleted Successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
}

async function updateStudent(req, res) {
    const { id } = req.params;
    const newData = req.body;

    try {
        const updatedStudent = await StudentModel.updateStudent(id, newData);

        return res.status(200).send({
            message: 'Student Updated Successfully',
            result: updatedStudent,
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateStudentByAttribute(req, res) {
    const { id } = req.params;
    const newData = req.body;

    try {
        const updatedStudent = await StudentModel.updateStudentByAttribute(id, newData);
        res.json(updatedStudent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function listStudents(req, res) {
    try {
        const filters = req.query;
        let students;

        if (Object.keys(filters).length > 0) {
            const paramsWithOperators = Object.entries(filters).filter(([key, value]) => value.includes('{') && value.includes('}'));

            if (paramsWithOperators.length > 0) {
                students = await StudentModel.listStudentsWithOperators(paramsWithOperators);
            } else {
                students = await StudentModel.listStudentByQueryString(filters);
            }

            if (!students.students) {
                return res.status(404).send({ message: 'No Students Found With The Specified Filters' });
            }
        } else {
            students = await StudentModel.listStudents();
        }

        res.status(200).send({
            message: 'Students Listed Successfully',
            Students: students,});

    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

async function listStudentById(req, res) {
        try {
            const student = await StudentModel.listStudentById(req.params.id);

            if (Object.keys(student).length === 0) {
                return res.status(404).send({ message: 'Student Not Found' });
            }
    
            return res.status(200).send({
                message: 'Student Listed Successfully',
                student: student,
            });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).send({ error: 'Internal Server Error' });
        }
    }

module.exports = { createStudent, deleteStudent, updateStudent, updateStudentByAttribute, listStudents, listStudentById};
