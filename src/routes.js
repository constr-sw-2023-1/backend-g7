const request = require('request');
const express = require('express');
const routes = express.Router();

const StudentController = require('./controllers/StudentController');

routes.post('/students', StudentController.createStudent);
routes.delete('/students/:id', StudentController.deleteStudent);
routes.put('/students/:id', StudentController.updateStudent);
routes.patch('/students/:id', StudentController.updateStudentByAttribute);
routes.get('/students', StudentController.listStudents);
routes.get('/students/:id', StudentController.listStudentById);

module.exports = routes;