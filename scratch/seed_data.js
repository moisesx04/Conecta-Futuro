
const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres:Garusito95@db.xxpldwtasvfgztkrzmjx.supabase.co:5432/postgres";

const schools = [
  'Liceo Francisco Alberto Caamaño (CJB)',
  'Politécnico Evangelina Santos Bergés (CJB)',
  'Politécnico Fray Balbino (CJB)',
  'Liceo Centro de Arte María Compré de Vargas (Los Mameyes)'
];

const careers = [
  'Técnico Superior en Diseño Gráfico',
  'Técnico Superior en Diseño de Modas',
  'Técnico Superior en Diseño de Interiores',
  'Técnico Superior en Fotografía',
  'Técnico Superior en Producción de Eventos',
  'Técnico Superior en Construcción',
  'Técnico Superior en Geomática Aplicada Mención: Topografía',
  'Técnico Superior en Geomática Aplicada Mención: Agrimensura',
  'Técnico Superior en Electricidad',
  'Técnico Superior en Refrigeración',
  'Técnico Superior en Electrónica',
  'Técnico Superior en Mecánica Automotriz',
  'Técnico Superior en Tecnología de Semiconductores',
  'Técnico Superior en Mantenimiento de Sistemas de Electromedicina',
  'Técnico Superior en Tecnologías de la Manufactura',
  'Técnico Superior en Logística',
  'Técnico Superior en Diseño Industrial',
  'Técnico Superior en Dirección de Proyectos',
  'Técnico Superior en Soporte Informático',
  'Técnico Superior en Desarrollo de Software',
  'Técnico Superior en Administración de Redes',
  'Técnico Superior en Desarrollo de Aplicaciones de Animación y Videojuegos',
  'Técnico Superior en Enfermería',
  'Técnico Superior en Imágenes Médicas',
  'Técnico Superior en Higiene Dental',
  'Técnico Superior en Laboratorio Dental',
  'Técnico Superior en Gestión de Cocina',
  'Técnico Superior en Panadería y Repostería',
  'Técnico Superior en Gestión de Servicios de Alimentos y Bebidas',
  'Técnico Superior en Gestión de Servicios de Eventos y Viajes',
  'Técnico Superior en Gestión de Información y Asistencia Turística',
  'Técnico Superior en Gestión de Recepción y Reservación en Alojamiento'
];

async function seed() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Intentando conectar a Supabase...');
    await client.connect();
    console.log('Conectado con éxito.');

    console.log('Insertando escuelas...');
    for (const school of schools) {
      await client.query(
        'INSERT INTO schools (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
        [school]
      );
    }
    console.log('Escuelas procesadas.');

    console.log('Insertando carreras...');
    for (const career of careers) {
      await client.query(
        'INSERT INTO careers (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
        [career]
      );
    }
    console.log('Carreras procesadas.');

    console.log('¡Alimentación completada con éxito!');
  } catch (err) {
    console.error('Error detallado:', err.message);
    if (err.code === 'ENETUNREACH') {
      console.error('Parece que hay un problema de red o restricciones de conexión saliente.');
    }
  } finally {
    await client.end();
  }
}

seed();
