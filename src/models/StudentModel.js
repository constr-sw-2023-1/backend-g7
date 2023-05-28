const { Pool } = require('pg');

const pool = new Pool({
  host: 'backend-g7-db-1',
  port: 5432,
  user: 'root',
  password: 'root',
  database: 'studentDb'
});

class StudentModel {
  static mapStudentDataList(rows) {
    const studentsMap = new Map();
  
    for (const row of rows) {
      const studentId = row.aluno_id.toString();
      if (!studentsMap.has(studentId)) {
        studentsMap.set(studentId, {
          alunoId: row.aluno_id,
          matricula: row.matricula,
          nome: row.nome,
          email: row.email,
          curso: row.curso,
          curriculo: {
            formacao: [],
            experiencia_profissional: []
          }
        });
      }
  
      const student = studentsMap.get(studentId);
  
      if (row.escolaridade) {
        student.curriculo.formacao.push({
          curso: row.escolaridade,
          instituicao: row.instituicao,
          conclusao: row.conclusao
        });
      }
  
      if (row.cargo) {
        student.curriculo.experiencia_profissional.push({
          cargo: row.cargo,
          empresa: row.fantasia,
          periodo: `${row.data_inicio} - ${row.data_termino || 'presente'}`
        });
      }
  
      if (row.cnpj) {
        if (!student.empresas) {
          student.empresas = [];
        }
        student.empresas.push({
          cnpj: row.cnpj,
          nome: row.fantasia
        });
      }
    }
  
    const students = Array.from(studentsMap.values());
  
    return { alunos: students };
  }

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
      const query = `
        SELECT aluno.aluno_id, aluno.matricula, aluno.nome, aluno.email, aluno.curso,
               formacao.escolaridade, formacao.conclusao, formacao.instituicao,
               experiencia_profissional.cargo, experiencia_profissional.data_inicio,
               experiencia_profissional.data_termino, experiencia_profissional.em_andamento,
               empresa.cnpj, empresa.fantasia
        FROM aluno
        LEFT JOIN formacao ON aluno.aluno_id = formacao.aluno_id
        LEFT JOIN experiencia_profissional ON aluno.aluno_id = experiencia_profissional.aluno_id
        LEFT JOIN empresa ON experiencia_profissional.empresa_id = empresa.empresa_id
        WHERE aluno.aluno_id = $1
      `;
      const values = [id];
      const result = await pool.query(query, values);
  
      if (result.rows.length === 0) {
        return null;
      }
  
      const student = StudentModel.mapStudentData(result.rows[0]);
  
      return student;
    } catch (error) {
      throw new Error(`Erro ao obter estudante por ID: ${error.message}`);
    }
  }

  static async listStudents() {
    try {
      const query = `
        SELECT aluno.aluno_id, aluno.matricula, aluno.nome, aluno.email, aluno.curso,
               formacao.escolaridade, formacao.conclusao, formacao.instituicao,
               experiencia_profissional.cargo, experiencia_profissional.data_inicio,
               experiencia_profissional.data_termino, experiencia_profissional.em_andamento,
               empresa.cnpj, empresa.fantasia
        FROM aluno
        LEFT JOIN formacao ON aluno.aluno_id = formacao.aluno_id
        LEFT JOIN experiencia_profissional ON aluno.aluno_id = experiencia_profissional.aluno_id
        LEFT JOIN empresa ON experiencia_profissional.empresa_id = empresa.empresa_id
      `;
      const result = await pool.query(query);
  
      const students = StudentModel.mapStudentDataList(result.rows);
  
      return students;
    } catch (error) {
      throw new Error(`Erro ao listar estudantes: ${error.message}`);
    }
  }
}

module.exports = StudentModel;