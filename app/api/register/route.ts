// app/api/register/route.ts
export const runtime = 'nodejs'; // CRITICAL: Forces Node.js runtime for pg

import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, school_id, career_id, new_school_name, new_career_name, motivation } = body;

    if (!full_name || !motivation) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    let finalSchoolId = school_id;
    let finalCareerId = career_id;

    // Insert new school if provided
    if (new_school_name?.trim()) {
      const s = await query(
        'INSERT INTO schools (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id',
        [new_school_name.trim()]
      );
      finalSchoolId = s.rows[0].id;
    }

    // Insert new career if provided
    if (new_career_name?.trim()) {
      const c = await query(
        'INSERT INTO careers (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id',
        [new_career_name.trim()]
      );
      finalCareerId = c.rows[0].id;
    }

    await query(
      'INSERT INTO registrations (full_name, school_id, career_id, motivation) VALUES ($1, $2, $3, $4)',
      [full_name.trim(), finalSchoolId || null, finalCareerId || null, motivation.trim()]
    );

    return NextResponse.json({ message: 'Registro exitoso' }, { status: 201 });
  } catch (error) {
    console.error('[Register Error]:', error);
    return NextResponse.json({ error: 'Error al registrar' }, { status: 500 });
  }
}
