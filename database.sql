-- Conecta Futuro - Schema de Base de Datos
-- Ejecuta este script en Supabase SQL Editor

-- Tabla de escuelas
CREATE TABLE IF NOT EXISTS schools (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de carreras
CREATE TABLE IF NOT EXISTS careers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de registros de estudiantes
CREATE TABLE IF NOT EXISTS registrations (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  school_id INTEGER REFERENCES schools(id),
  career_id INTEGER REFERENCES careers(id),
  motivation TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de administradores
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insertar admin por defecto (usuario: admin, contraseña: admin)
INSERT INTO admins (username, password_hash) 
VALUES ('admin', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Datos de ejemplo para escuelas
INSERT INTO schools (name) VALUES 
  ('Universidad Autónoma de Santo Domingo'),
  ('PUCMM - Pontificia Universidad Católica Madre y Maestra'),
  ('INTEC - Instituto Tecnológico de Santo Domingo'),
  ('UNAPEC'),
  ('Universidad O&M'),
  ('UTESA'),
  ('UFHEC'),
  ('UCATECI'),
  ('Instituto Politécnico Loyola'),
  ('Otra Institución')
ON CONFLICT (name) DO NOTHING;

-- Datos de ejemplo para carreras
INSERT INTO careers (name) VALUES 
  ('Ingeniería en Sistemas'),
  ('Ingeniería Civil'),
  ('Ingeniería Industrial'),
  ('Medicina'),
  ('Derecho'),
  ('Administración de Empresas'),
  ('Contabilidad'),
  ('Psicología'),
  ('Arquitectura'),
  ('Enfermería'),
  ('Comunicación Social'),
  ('Educación'),
  ('Marketing'),
  ('Turismo y Hotelería'),
  ('Otra Carrera')
ON CONFLICT (name) DO NOTHING;
