const express = require('express');
const routes = express.Router();

const StudentController = require('./controllers/StudentController');

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./utils/swagger.json");
function checkStudentFilters(req, res, next) {
    const filters = req.query;

    if (Object.keys(filters).length > 0) {
        return StudentController.listStudentByQueryString(req, res, next);
    } else {
        return StudentController.listStudents(req, res, next);
    }
}

routes.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
routes.post('/students', StudentController.createStudent); // Funcionando
routes.delete('/students/:id', StudentController.deleteStudent); // Funcionando
routes.put('/students/:id', StudentController.updateStudent); // Funcionando
routes.patch('/students/:id', StudentController.updateStudentByAttribute);
routes.get('/students/:id', StudentController.listStudentById); //Funcionando
routes.get('/students', checkStudentFilters); // Funcionando

module.exports = routes;