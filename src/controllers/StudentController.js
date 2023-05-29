const StudentModel = require('../models/StudentModel');
const ApiError = require('../errors/ApiError');

async function createStudent (req, res, next) {
    try {
        const student = await StudentModel.createStudent(req.body);
        res.status(201).send({
            message: "student created successfully",
            data: student
        });
    } catch (error) {
        if(res.status(400)){
            next(ApiError.badRequest('Invalid input'));
            return;
        } else if (res.status(500)){
            next(ApiError.internalError('Internal Server Error'));
            return;
        }
    }
}

function deleteStudent(req, res, next) {
    try {
        StudentModel.deleteStudent(req.params.id);
        res.status(200).send({
            message: "student deleted successfully",
        });
    } catch (error) {
        if(res.status(400)){
            next(ApiError.badRequest('Invalid input. Check your URL'));
            return;
        } else if(res.status(404)){
            next(ApiError.notFound('Student not found'));
            return;
        } else if (res.status(500)){
            next(ApiError.internalError('Internal Server Error'));
            return;
        }
    }
}

async function updateStudent(req, res, next) {
    const { id } = req.params;
    const newData = req.body;

    try {
        const updatedStudent = await StudentModel.updateStudent(id, newData);
        res.json(updatedStudent);
    } catch (error) {
        if(res.status(400)){
            next(ApiError.badRequest('Invalid input. Check your URL'));
            return;
        } else if(res.status(404)){
            next(ApiError.notFound('Student not found'));
            return;
        } else if (res.status(500)){
            next(ApiError.internalError('Internal Server Error'));
            return;
        }
    }
}

async function updateStudentByAttribute(req, res, next) {
    const { id } = req.params;
    const newData = req.body;

    try {
        const updatedStudent = await StudentModel.updateStudentByAttribute(id, newData);
        res.json(updatedStudent);
    } catch (error) {
        if(res.status(400)){
            next(ApiError.badRequest('Invalid input. Check your URL'));
            return;
        } else if(res.status(404)){
            next(ApiError.notFound('Student not found'));
            return;
        } else if (res.status(500)){
            next(ApiError.internalError('Internal Server Error'));
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
        if(res.status(400)){
            next(ApiError.badRequest('Invalid input. Check your URL'));
            return;
        } else if(res.status(404)){
            next(ApiError.notFound('Student not found'));
            return;
        } else if (res.status(500)){
            next(ApiError.internalError('Internal Server Error'));
            return;
        }
    }
}

async function listStudentById(req, res, next) {
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
            if(res.status(400)){
                next(ApiError.badRequest('Invalid input. Check your URL'));
                return;
            } else if(res.status(404)){
                next(ApiError.notFound('Student not found'));
                return;
            } else if (res.status(500)){
                next(ApiError.internalError('Internal Server Error'));
                return;
            }
        }
    }

async function listStudentByQueryString(req, res, next) {
    try {
        const filters = req.query;
        const result = await StudentModel.listStudentByQueryString(filters);

        res.json(result);
    } catch (error) {
        if(res.status(400)){
            next(ApiError.badRequest('Invalid input. Check your URL'));
            return;
        } else if(res.status(404)){
            next(ApiError.notFound('Student not found'));
            return;
        } else if (res.status(500)){
            next(ApiError.internalError('Internal Server Error'));
            return;
        }
    }
}

module.exports = { createStudent, deleteStudent, updateStudent, updateStudentByAttribute, listStudents, listStudentById, listStudentByQueryString };
