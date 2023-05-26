const { Pool } = require('pg');
const studentData = require('./Student')

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
    try {
      const query = `INSERT INTO aluno (column1, column2, ...) VALUES ($1, $2, ...)`;
      const values = [studentData]; 
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao listar estudantes: ${error.message}`);
    }
  }

  static async updateStudent(id, newData) {
    try {
      const query = `UPDATE students SET * = ${newData} WHERE aluno_id = ${id}`;
      const result = await pool.query(query, [newData, id]);
      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao listar estudantes: ${error.message}`);
    }
  }

  static async updateStudentByAttribute(id, attribute, value, newData) {
    try {
      const query = `UPDATE students SET ${attribute} = ${newData} WHERE aludo_id = ${id} AND ${attribute} = ${value}`;
      const result = await pool.query(query, [newData, value]);
      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao atualizar estudante por atributo: ${error.message}`);
    }
  }

  static async deleteStudent(id) {
    try {
      const query = `DELETE * FROM students WHERE aluno_id = ${id}`;
      const result = await pool.query(query, [id]);
      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao listar estudantes: ${error.message}`);
    }
  }

  static async listStudentById(id) {
    try {
      const query = `SELECT * FROM students WHERE aluno_id = ${id}`;
      const result = await pool.query(query, [id]);
      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao listar estudantes: ${error.message}`);
    }
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