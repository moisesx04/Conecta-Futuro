// app/api/admin/registrations/route.ts
import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function GET() {
  try {
    const result = await query(`
      SELECT r.id, r.full_name, s.name as school_name, c.name as career_name, r.motivation, r.created_at 
      FROM registrations r 
      LEFT JOIN schools s ON r.school_id = s.id 
      LEFT JOIN careers c ON r.career_id = c.id 
      ORDER BY r.created_at DESC
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching registrations' }, { status: 500 });
  }
}
