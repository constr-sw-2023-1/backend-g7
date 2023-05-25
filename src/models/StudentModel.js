const { Pool } = require('pg');

const pool = new Pool({
  host: 'backend-g7-db-1',
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
    try {
      const query = 'SELECT * FROM aluno WHERE id = $1';
      const values = [id];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao obter estudante por ID: ${error.message}`);
    }
  }

  static async listStudents() {
    try {
      const query = 'SELECT * FROM aluno';
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao listar estudantes: ${error.message}`);
    }
  }
}

module.exports = StudentModel;