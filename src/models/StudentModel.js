const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'root',
  password: 'root',
  database: 'studentDb'
});

class StudentModel {

  //  Create a new student
  static async createStudent(student) {
  }

  //  Delete a student
  static async deleteStudent(id) {
  }

  //  Update a student
  static async updateStudent(id, newData) {
  }

  //  Update a student by attribute
  static async updateStudentByAttribute(id, newData) {
  }

  //  List all students ( Funcionando )
  static async listStudents() {
    try {
      const query = 'SELECT * FROM aluno';
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao listar estudantes: ${error.message}`);
    }
  }

  //  List a student by ID ( Funcionando )
  static async listStudentById(id) {
    try {
      const query = 'SELECT * FROM aluno WHERE aluno_id = $1';
      const values = [id];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao obter estudante por ID: ${error.message}`);
    }
  }

  //  List a student by simple query string
  static async listStudentByQueryString(filters) {
    try {
      let sql = 'SELECT * FROM aluno';
      const values = [];

      if (Object.keys(filters).length > 0) {
        sql += ' WHERE ';
        Object.keys(filters).forEach((key, index) => {
          if (index > 0) {
            sql += ' AND ';
          }

          const filterValue = filters[key];
          let filterOperator = '=';

          if (typeof filterValue === 'string') {
            if (/^\d+$/.test(filterValue)) {
              // O valor é uma string que contém apenas dígitos (inteiro)
              filterOperator = '=';
              values.push(parseInt(filterValue));
            } else {
              // O valor é uma string que não é um inteiro
              filterOperator = 'ILIKE';
              values.push(filterValue.toLowerCase());
            }
          }

          sql += `${key} ${filterOperator} $${index + 1}`;
        });
      }

      const result = await pool.query(sql, values);
      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao listar alunos por filtros: ${error.message}`);
    }
  }

  // List a student by complex query string
  static async listStudentByComplexQueryString(resource, query) {
  }
}

module.exports = StudentModel;