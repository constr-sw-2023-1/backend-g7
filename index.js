const express = require('express');
const app = express();
const routes = require('./src/routes');
const apiErrorHandler = require('./src/errors/ApiErrorHandler');

app.use(express.json());
app.use('/', routes);

app.use(apiErrorHandler);
app.listen(8080);