
const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres:Garusito95@db.xxpldwtasvfgztkrzmjx.supabase.co:5432/postgres";

const schools = [
  'Liceo Francisco Alberto Caamaño (CJB)',
  'Politécnico Evangelina Santos Bergés (CJB)',
  'Politécnico Fray Balbino (CJB)',
  'Liceo Centro de Arte María Compré de Vargas (Los Mameyes)'
];

async function seed() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Conectado a la base de datos...');

    for (const school of schools) {
      await client.query(
        'INSERT INTO schools (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
        [school]
      );
      console.log(`Insertado/Verificado: ${school}`);
    }

    console.log('Alimentación completada con éxito.');
  } catch (err) {
    console.error('Error alimentando la base de datos:', err);
  } finally {
    await client.end();
  }
}

seed();
