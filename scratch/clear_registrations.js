const { Pool } = require('pg');
const fs = require('fs');

async function clearRegistrations() {
  let dbUrl = '';
  try {
    const envFile = fs.readFileSync('.env.local', 'utf8');
    const match = envFile.match(/DATABASE_URL=["']?([^"'\n]+)["']?/);
    if (match) dbUrl = match[1];
  } catch (err) {
    console.error('Could not read .env.local');
    process.exit(1);
  }

  if (!dbUrl) {
    console.error('DATABASE_URL not found');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Cleaning registrations table...');
    await pool.query('DELETE FROM registrations');
    console.log('Successfully cleared all registrations.');
    console.log('Schools and careers remain untouched.');
  } catch (err) {
    console.error('Error clearing registrations:', err);
  } finally {
    await pool.end();
  }
}

clearRegistrations();
