module.exports = {
    host: process.env.HOST || 'backend-g7-db-1',
    port: process.env.PORT || 5432,
    user: process.env.USER || 'root',
    password: process.env.PASSWORD ||'root',
    database: process.env.DATABASE || 'studentDb'
};