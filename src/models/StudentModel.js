const { Pool } = require('pg');

const pool = new Pool({
  //conexao bd
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
  }
}

module.exports = StudentModel;