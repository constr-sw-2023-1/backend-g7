const StudentModel = require('../models/StudentModel');
const ApiError = require('../errors/ApiError');

async function createStudent (req, res) {
    try {
        const student = await StudentModel.createStudent(req.body);
        res.status(201).send({
            message: "student created successfully",
            data: student
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

function deleteStudent(req, res) {
    try {
        StudentModel.deleteStudent(req.params.id);
        res.status(200).send({
            message: "student deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

async function updateStudent(req, res) {
    const { id } = req.params;
    const newData = req.body;

    try {
        const updatedStudent = await StudentModel.updateStudent(id, newData);
        res.json(updatedStudent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateStudentByAttribute(req, res, next) {
    const { id } = req.params;
    const newData = req.body;

    try {
        const updatedStudent = await StudentModel.updateStudentByAttribute(id, newData);
        res.json(updatedStudent);
    } catch (error) {
        if(!updateStudent){
            next(ApiError.notFound('Student not found'));
            return;
        }
    }
}

async function listStudents(req, res, next) {
    try {
        const students = await StudentModel.listStudents();

        res.status(200).send({
            message: "Students listed successfully",
            students: students
        });
    } catch (error) {
        if(!updateStudent){
            next(ApiError.notFound('Student not found'));
            return;
        }
    }
}

async function listStudentById(req, res) {
        try {
            const student = await StudentModel.listStudentById(req.params.id);
    
            if (!student) {
                return res.status(404).send({ message: 'Student Not Found' });
            }
    
            return res.status(200).send({
                message: 'Student listed successfully',
                student: student,
            });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).send({ error: 'Internal Server Error' });
        }
    }

async function listStudentByQueryString(req, res) {
    try {
        const filters = req.query;
        const result = await StudentModel.listStudentByQueryString(filters);

        res.json(result);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
}

module.exports = { createStudent, deleteStudent, updateStudent, updateStudentByAttribute, listStudents, listStudentById, listStudentByQueryString};
