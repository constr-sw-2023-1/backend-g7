//import swaggerUI from 'swagger-ui-express';
//import swaggerDocument from './swagger.json' assert {type: "json"};

const express = require('express');

const app = express();
app.use(express.json());

app.use('/', require('./src/routes'));
//app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.listen(8080);