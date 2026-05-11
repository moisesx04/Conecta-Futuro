// app/api/admin/stats/route.ts
export const runtime = 'nodejs'; // CRITICAL: Forces Node.js runtime for pg

import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function GET() {
  try {
    const [totalResult, careerResult, schoolResult] = await Promise.all([
      query('SELECT COUNT(*) as count FROM registrations'),
      query(`
        SELECT c.name, COUNT(r.id) as count 
        FROM careers c 
        LEFT JOIN registrations r ON c.id = r.career_id 
        GROUP BY c.id, c.name 
        ORDER BY count DESC
      `),
      query(`
        SELECT s.name, COUNT(r.id) as count 
        FROM schools s 
        LEFT JOIN registrations r ON s.id = r.school_id 
        GROUP BY s.id, s.name 
        ORDER BY count DESC
      `),
    ]);

    return NextResponse.json({
      total_registrations: parseInt(totalResult.rows[0].count),
      by_career: careerResult.rows.map(r => ({ name: r.name, count: parseInt(r.count) })),
      by_school: schoolResult.rows.map(r => ({ name: r.name, count: parseInt(r.count) })),
    });
  } catch (error) {
    console.error('[Stats Error]:', error);
    return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 });
  }
}
