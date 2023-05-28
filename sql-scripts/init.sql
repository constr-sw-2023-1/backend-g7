
CREATE TABLE aluno (
  aluno_id SERIAL PRIMARY KEY,
  registration INTEGER NOT NULL,
  name VARCHAR(100) NULL,
  email VARCHAR(300) NULL,
  course VARCHAR(100) NULL
);


CREATE TABLE schooling (
  schooling_id SERIAL PRIMARY KEY,
  aluno_id INTEGER REFERENCES aluno(aluno_id) NOT NULL,
  graduation VARCHAR(50) NULL,
  conclusion DATE NULL,
  institution VARCHAR(100) NULL
);


CREATE TABLE contractors (
  contractor_id SERIAL PRIMARY KEY,
  taxpayerIdNum VARCHAR(14) NOT NULL,
  name VARCHAR(100) NULL
);


CREATE TABLE professional_experience (
  experience_id SERIAL PRIMARY KEY,
  aluno_id INTEGER REFERENCES aluno(aluno_id) NOT NULL,
  position VARCHAR(100) NULL,
  contractor_id INTEGER REFERENCES contractors(contractor_id) NOT NULL,
  start_Date DATE NULL,
  end_Date DATE NULL,
  ongoing INTEGER CHECK (ongoing IN (0, 1)) NULL
);

INSERT INTO aluno (registration, name, email, course)
VALUES (11111111, 'Jose', 'jose@exemplo.com', 'Moda');
INSERT INTO aluno (registration, name, email, course)
VALUES (22222222, 'Maria', 'maria@exemplo.com', 'Engenharia Civil');
INSERT INTO aluno (registration, name, email, course)
VALUES (33333333, 'Carlos', 'carlos@exemplo.com', 'Gastronomia');

INSERT INTO schooling (aluno_id, graduation, conclusion, institution)
VALUES (1, 'Superior Inclompleto', '2022-01-01', 'PUCRS');
INSERT INTO schooling (aluno_id, graduation, conclusion, institution)
VALUES (1, 'Técnico Completo', '2023-01-01', 'SCC Informatica');
INSERT INTO schooling (aluno_id, graduation, conclusion, institution)
VALUES (3, 'Superior Completo', '2021-01-01', 'PUCRS');

INSERT INTO contractors (taxpayerIdNum, name)
VALUES (11111111111111, 'Matheus&Marrocos');
INSERT INTO contractors (taxpayerIdNum, name)
VALUES (22222222222222, 'Jorge&Roberto');
INSERT INTO contractors (taxpayerIdNum, name)
VALUES (33333333333333, 'Tamiro&Tamara');

INSERT INTO professional_experience (aluno_id, position, contractor_id, start_Date, end_Date, ongoing)
VALUES (3, 'Estagiario', 2, '2000-01-01', '2011-01-01', 0);
INSERT INTO professional_experience (aluno_id, position, contractor_id, start_Date, ongoing)
VALUES (3, 'Chefe', 3, '2001-01-01', 1);
INSERT INTO professional_experience (aluno_id, position, contractor_id, start_Date, end_Date, ongoing)
VALUES (2, 'Chefe', 1, '2002-01-01', '2009-01-01', 0);