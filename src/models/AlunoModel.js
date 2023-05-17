const { Pool } = require('pg');

const pool = new Pool({
  //conexao bd
});

class AlunoModel {
  static async createAluno(aluno) {
    // pool.query() / pool.execute()
  }

  static async updateAluno(id, newData) {
  }

  static async updateAlunoByAttribute(id, newData) {
  }

  static async deleteAluno(id) {
  }

  static async listAlunoById(id) {
  }

  static async listAlunos() {
  }
}

module.exports = AlunoModel;