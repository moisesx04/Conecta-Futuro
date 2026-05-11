// app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const totalResult = await query('SELECT count(*) FROM registrations');
    const careerResult = await query('SELECT c.name, count(r.id) as count FROM careers c LEFT JOIN registrations r ON c.id = r.career_id GROUP BY c.name');
    const schoolResult = await query('SELECT s.name, count(r.id) as count FROM schools s LEFT JOIN registrations r ON s.id = r.school_id GROUP BY s.name');

    return NextResponse.json({
      total_registrations: parseInt(totalResult.rows[0].count),
      by_career: careerResult.rows.map(r => ({ name: r.name, count: parseInt(r.count) })),
      by_school: schoolResult.rows.map(r => ({ name: r.name, count: parseInt(r.count) }))
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching stats' }, { status: 500 });
  }
}
