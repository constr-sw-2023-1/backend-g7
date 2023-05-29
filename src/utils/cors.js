const cors = require('cors');

const corsOptions = {
    origin: '*',
    methods: ['GET', 'PATCH', 'POST', 'PUT', 'DELETE']
}

module.exports = cors(corsOptions);