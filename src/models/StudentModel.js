const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'root',
  password: 'root',
  database: 'studentDb'
});

class StudentModel {
  static async createStudent(student) {
    // pool.query() / pool.execute()
  }

  static async updateStudent(id, newData) {
  }

  static async updateStudentByAttribute(id, newData) {
  }

  static async deleteStudent(id) {
  }

  static async listStudentById(id) {
  }

  static async listStudents() {
    try {
      const query = 'SELECT * FROM students';
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao listar estudantes: ${error.message}`);
    }
  }
}

module.exports = StudentModel;