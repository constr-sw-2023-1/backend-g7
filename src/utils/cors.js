const cors = require('src/utils/cors');

const corsOptions = {
    origin: '*',
    methods: ['GET', 'PATCH', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Authorization'],
}

module.exports = cors(corsOptions);