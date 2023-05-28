const request = require('request');

require('dotenv').config();
const config = require('../config/config');
const StudentModel = require('../models/StudentModel');

async function createStudent (req, res) {
    try {
        const student = await StudentModel.createStudent(req.body);
        res.status(201).send({
            message: "User created successfully",
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
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

function updateStudent(req, res) {
    const options = {
        url: `${config.baseApiUrl}/students/${req.params.id}`,
        headers: {
            Authorization: req.headers.authorization,
            'Content-Type': 'application/json'
        },
        json: {
            "firstName": "Jorge",
        }
    };
    request.put(options, (error, response, body) => {
        if (error) {
            console.error(error);
            return res.status(500).send({ error: 'Internal Server Error' });
        }
        try {
            if(response.statusCode === 200){
            console.log(`Status code: ${response.statusCode}`);
            console.log(`Response body: ${body}`);
            res.status(200).send({
                message: "User updated successfully" });
            } else if (response.statusCode === 404){
                res.status(404).send({ error: 'User Not Found' });
            } else {
                throw new Error(`Unexpected response status code: ${response.statusCode}`);
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: 'Internal Server Error' });
        }
    });
}

function updateStudentByAttribute(req, res) {
    const options = {
        url: `${config.baseApiUrl}/students/${req.params.id}/student-data`,
        headers: {
            Authorization: req.headers.authorization,
            'Content-Type': 'application/json'
        },
        body: {
            type: 'password',
            temporary: false,
            value: req.body.password
        },
        json: true
    };

    request.patch(options, (error, response, body) => {
        if (error) {
            console.error(error);
            return res.status(500).send({ error: 'Internal Server Error' });
        }
        console.log('Response:', response.statusCode, body);
        try{
            if (response.statusCode === 200) {
                res.status(200).send({
                    message: "User password updated successfully"
                });
            } else if (response.statusCode === 404) {
                res.status(404).send({
                    message: "Requested password not found"
                });
            } else {
                throw new Error(`Unexpected response status code: ${response.statusCode}`);
            }
        }  catch (error) {
            console.error(error);
            res.status(500).send({ error: 'Internal Server Error' });
        }
    });
}

async function listStudents(req, res) {
    try {
        const students = await StudentModel.listStudents();

        res.status(200).send({
            message: "Students listed successfully",
            students: students
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
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
                user: student,
            });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).send({ error: 'Internal Server Error' });
        }
    }

async function listStudentByQueryString(req, res) {
    try {
        const filters = req.query; // Obtém os parâmetros de filtro da requisição

        const result = await StudentModel.listStudentByQueryString(filters); // Chama a função que faz a consulta no banco de dados
        res.json(result);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
}

module.exports = { createStudent, deleteStudent, updateStudent, updateStudentByAttribute, listStudents, listStudentById, listStudentByQueryString};
