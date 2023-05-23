
CREATE TABLE aluno (
  aluno_id SERIAL PRIMARY KEY,
  matricula INTEGER NOT NULL,
  nome VARCHAR(100) NULL,
  email VARCHAR(300) NULL,
  curso VARCHAR(100) NULL
);


CREATE TABLE formacao (
  formacao_id SERIAL PRIMARY KEY,
  aluno_id INTEGER REFERENCES aluno(aluno_id) NOT NULL,
  escolaridade VARCHAR(50) NULL,
  conclusao DATE NULL,
  instituicao VARCHAR(100) NULL
);


CREATE TABLE empresa (
  empresa_id SERIAL PRIMARY KEY,
  cnpj VARCHAR(14) NOT NULL,
  fantasia VARCHAR(100) NULL
);


CREATE TABLE experiencia_profissional (
  experiencia_id SERIAL PRIMARY KEY,
  aluno_id INTEGER REFERENCES aluno(aluno_id) NOT NULL,
  cargo VARCHAR(100) NULL,
  empresa_id INTEGER REFERENCES empresa(empresa_id) NOT NULL,
  data_inicio DATE NULL,
  data_termino DATE NULL,
  em_andamento INTEGER CHECK (em_andamento IN (0, 1)) NULL
);

INSERT INTO aluno (matricula, nome, email, curso)
VALUES (11111111, 'Jose', 'jose@exemplo.com', 'Moda');
INSERT INTO aluno (matricula, nome, email, curso)
VALUES (22222222, 'Maria', 'maria@exemplo.com', 'Engenharia Civil');
INSERT INTO aluno (matricula, nome, email, curso)
VALUES (33333333, 'Carlos', 'carlos@exemplo.com', 'Gastronomia');

INSERT INTO formacao (aluno_id, escolaridade, conclusao, instituicao)
VALUES (1, 'Superior Inclompleto', '2022-01-01', 'PUCRS');
INSERT INTO formacao (aluno_id, escolaridade, conclusao, instituicao)
VALUES (1, 'Técnico Completo', '2023-01-01', 'SCC Informatica');
INSERT INTO formacao (aluno_id, escolaridade, conclusao, instituicao)
VALUES (3, 'Superior Completo', '2021-01-01', 'PUCRS');

INSERT INTO empresa (cnpj, fantasia)
VALUES (11111111111111, 'Matheus&Marrocos');
INSERT INTO empresa (cnpj, fantasia)
VALUES (22222222222222, 'Jorge&Roberto');
INSERT INTO empresa (cnpj, fantasia)
VALUES (33333333333333, 'Tamiro&Tamara');

INSERT INTO experiencia_profissional (aluno_id, cargo, empresa_id, data_inicio, data_termino, em_andamento)
VALUES (3, 'Estagiario', 2, '2000-01-01', '2011-01-01', 0);
INSERT INTO experiencia_profissional (aluno_id, cargo, empresa_id, data_inicio, em_andamento)
VALUES (3, 'Chefe', 3, '2001-01-01', 1);
INSERT INTO experiencia_profissional (aluno_id, cargo, empresa_id, data_inicio, data_termino, em_andamento)
VALUES (2, 'Chefe', 1, '2002-01-01', '2009-01-01', 0);