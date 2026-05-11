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
  ('Liceo Francisco Alberto Caamaño (CJB)'),
  ('Politécnico Evangelina Santos Bergés (CJB)'),
  ('Politécnico Fray Balbino (CJB)'),
  ('Liceo Centro de Arte María Compré de Vargas (Los Mameyes)'),
  ('Otra Institución')
ON CONFLICT (name) DO NOTHING;

-- Datos de ejemplo para carreras
INSERT INTO careers (name) VALUES 
  ('Técnico Superior en Diseño Gráfico'),
  ('Técnico Superior en Diseño de Modas'),
  ('Técnico Superior en Diseño de Interiores'),
  ('Técnico Superior en Fotografía'),
  ('Técnico Superior en Producción de Eventos'),
  ('Técnico Superior en Construcción'),
  ('Técnico Superior en Geomática Aplicada Mención: Topografía'),
  ('Técnico Superior en Geomática Aplicada Mención: Agrimensura'),
  ('Técnico Superior en Electricidad'),
  ('Técnico Superior en Refrigeración'),
  ('Técnico Superior en Electrónica'),
  ('Técnico Superior en Mecánica Automotriz'),
  ('Técnico Superior en Tecnología de Semiconductores'),
  ('Técnico Superior en Mantenimiento de Sistemas de Electromedicina'),
  ('Técnico Superior en Tecnologías de la Manufactura'),
  ('Técnico Superior en Logística'),
  ('Técnico Superior en Diseño Industrial'),
  ('Técnico Superior en Dirección de Proyectos'),
  ('Técnico Superior en Soporte Informático'),
  ('Técnico Superior en Desarrollo de Software'),
  ('Técnico Superior en Administración de Redes'),
  ('Técnico Superior en Desarrollo de Aplicaciones de Animación y Videojuegos'),
  ('Técnico Superior en Enfermería'),
  ('Técnico Superior en Imágenes Médicas'),
  ('Técnico Superior en Higiene Dental'),
  ('Técnico Superior en Laboratorio Dental'),
  ('Técnico Superior en Gestión de Cocina'),
  ('Técnico Superior en Panadería y Repostería'),
  ('Técnico Superior en Gestión de Servicios de Alimentos y Bebidas'),
  ('Técnico Superior en Gestión de Servicios de Eventos y Viajes'),
  ('Técnico Superior en Gestión de Información y Asistencia Turística'),
  ('Técnico Superior en Gestión de Recepción y Reservación en Alojamiento'),
  ('Otra Carrera')
ON CONFLICT (name) DO NOTHING;
