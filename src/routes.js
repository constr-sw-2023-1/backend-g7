const request = require('request');
const express = require('express');
const routes = express.Router();

const AlunoController = require('./controllers/AlunoController');

routes.post('/students', AlunoController.createAluno);
routes.delete('/students/:id', AlunoController.deleteAluno);
routes.put('/students/:id', AlunoController.updateAluno);
routes.patch('/students/:id', AlunoController.updateAlunoByAttribute);
routes.get('/students', AlunoController.listAlunos);
routes.get('/students/:id', AlunoController.listAlunoById);

module.exports = routes;