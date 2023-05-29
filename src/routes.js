const express = require('express');
const routes = express.Router();

const StudentController = require('./controllers/StudentController');
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./utils/swagger.json");

routes.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
routes.post('/students', StudentController.createStudent);
routes.delete('/students/:id', StudentController.deleteStudent);
routes.put('/students/:id', StudentController.updateStudent);
routes.patch('/students/:id', StudentController.updateStudent);
routes.get('/students/:id', StudentController.listStudentById);
routes.get('/students', StudentController.listStudents);

module.exports = routes;