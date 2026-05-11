// app/api/careers/route.ts
export const runtime = 'nodejs'; // CRITICAL: Forces Node.js runtime for pg

import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('[DATABASE_URL Missing]');
      return NextResponse.json({ error: 'Falta la configuración de la base de datos' }, { status: 500 });
    }

    const result = await query('SELECT id, name FROM careers ORDER BY name ASC');
    console.log(`[Careers fetched]: ${result.rowCount} careers found`);
    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('[Careers API Error]:', error.message);
    return NextResponse.json({ 
      error: 'Error al obtener carreras',
      details: error.message 
    }, { status: 500 });
  }
}
