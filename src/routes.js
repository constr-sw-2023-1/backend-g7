const express = require('express');
const routes = express.Router();

const StudentController = require('./controllers/StudentController');

routes.post('/students', StudentController.createStudent);
routes.delete('/students/:id', StudentController.deleteStudent);
routes.put('/students/:id', StudentController.updateStudent);
routes.patch('/students/:id', StudentController.updateStudentByAttribute);
routes.get('/students/:id', StudentController.listStudentById); //Funcionando
routes.get('/students', checkStudentFilters);

function checkStudentFilters(req, res, next) {
    const filters = req.query;

    if (Object.keys(filters).length > 0) {
        // Se houver filtros na query string, chama a função com filtro
        return StudentController.listStudentByQueryString(req, res, next);
    } else {
        // Se não houver filtros, chama a função sem filtro
        return StudentController.listStudents(req, res, next);
    }
}

module.exports = routes;