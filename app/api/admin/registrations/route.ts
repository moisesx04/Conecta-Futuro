// app/api/admin/registrations/route.ts
export const runtime = 'nodejs'; // CRITICAL: Forces Node.js runtime for pg

import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function GET() {
  try {
    const result = await query(`
      SELECT 
        r.id, 
        r.full_name, 
        COALESCE(s.name, r.full_name) as school_name, 
        COALESCE(c.name, 'No especificado') as career_name, 
        r.motivation, 
        r.created_at 
      FROM registrations r 
      LEFT JOIN schools s ON r.school_id = s.id 
      LEFT JOIN careers c ON r.career_id = c.id 
      ORDER BY r.created_at DESC
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('[Registrations Error]:', error);
    return NextResponse.json({ error: 'Error al obtener registros' }, { status: 500 });
  }
}
