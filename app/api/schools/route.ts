// app/api/schools/route.ts
export const runtime = 'nodejs'; // CRITICAL: Forces Node.js runtime for pg

import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export async function GET() {
  try {
    const result = await query('SELECT id, name FROM schools ORDER BY name ASC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('[Schools Error]:', error);
    return NextResponse.json({ error: 'Error al obtener escuelas' }, { status: 500 });
  }
}
