const request = require('request');

require('dotenv').config();
const config = require('../config/config');
const StudentModel = require('../models/StudentModel');

async function createStudent (req, res) {
    const options = {
        url: `${config.baseApiUrl}/students`,
        headers: {
            'Authorization': req.headers.authorization,
            'Content-Type': 'application/json'
        },
        json: {
            "createdTimestamp": 1588880747548,
            "username": "Joao da Silva",
            "enabled": true,
            "totp": false,
            "emailVerified": true,
            "firstName": "Joao",
            "lastName": "da Silva",
            "email": "joaosilva@email.com",
            "curriculum": {
                "schooling": [{
                        "graduation": "Ensino Médio",
                        "institution": "Colégio XYZ",
                        "conclusion": 2018,
                    },
                    {
                        "graduation": "Graduação",
                        "institution": "Universidade ABC",
                        "conclusion": 2022, 
                    }
                ],
                "professionalExperience": [{
                        "position": "Estagiário de Desenvolvimento",
                        "contractor": "12345678901234",
                        "contractTime": "01/2021 - 06/2021",
                    },
                    {
                        "position": "Desenvolvedor Júnior",
                        "contractor": "54321678901234",
                        "contractTime": "07/2021 - presente",
                    }
                ]
            },
            "contractors": [{
                
                    "taxpayerIdNum": 12345678901234,
                    "name": "Empresa X",
                },
                {
                    "taxpayerIdNum": 54321678901234,
                    "name": "Empresa Y",  
                },
            ],
            "requiredActions": [],
            "notBefore": 0,
            "access": {
                "manageGroupMembership": true,
                "view": true,
                "mapRoles": true,
                "impersonate": true,
                "manage": true
            },
        }
    };
    request.post(options, async (error, response, body) => {
        if (error) {
            console.error(error);
            return res.status(500).send({ error: 'Internal Server Error' });
        }
        console.log('HTTP response code:', response.statusCode);
        try {
            if(response.statusCode === 201) {
            await StudentModel.createStudent(req.body);
            res.status(201).send({
                message: "User created successfully",
            });
            } else {
                throw new Error(`Unexpected response status code: ${response.statusCode}`);
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: 'Internal Server Error' });
        }
    });
    
    
}

function deleteStudent(req, res) {
    const options = {
        url: `${config.baseApiUrl}/students/${req.params.id}`,
        headers: {
            Authorization: req.headers.authorization
        }
    };
    request.delete(options, (error, response, body) => {
        if (error) {
            console.error(error);
            return res.status(500).send({ error: 'Internal Server Error' });
        }
        try {
            if (response.statusCode === 204) {
                res.status(204).send({message: "User Deleted Successfully"});
            } else if (response.statusCode === 404) {
                res.status(404).send({ error: 'User Not Found' });
            } else if (response.statusCode === 401) {
                res.status(401).send({ error: 'Invalid Token' });
            } else {
                throw new Error(`Unexpected response status code: ${response.statusCode}`);
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: 'Internal Server Error' });
        }
    });
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



module.exports = { createStudent, deleteStudent, updateStudent, updateStudentByAttribute, listStudents, listStudentById};
