// app/api/register/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    let { full_name, school_id, career_id, new_school_name, new_career_name, motivation } = payload;

    if (new_school_name?.trim()) {
      const s = await query('INSERT INTO schools (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id', [new_school_name.trim()]);
      school_id = s.rows[0].id;
    }

    if (new_career_name?.trim()) {
      const c = await query('INSERT INTO careers (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id', [new_career_name.trim()]);
      career_id = c.rows[0].id;
    }

    await query(
      'INSERT INTO registrations (full_name, school_id, career_id, motivation) VALUES ($1, $2, $3, $4)',
      [full_name, school_id, career_id, motivation]
    );

    return NextResponse.json({ message: 'Registro exitoso' }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Error al registrar' }, { status: 500 });
  }
}
