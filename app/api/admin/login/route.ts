// app/api/admin/login/route.ts
export const runtime = 'nodejs'; // CRITICAL: Forces Node.js runtime for pg and jsonwebtoken

import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Faltan credenciales' }, { status: 400 });
    }

    const result = await query(
      'SELECT id, username, password_hash FROM admins WHERE username = $1',
      [username]
    );

    const admin = result.rows[0];

    if (!admin || admin.password_hash !== password) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const token = jwt.sign(
      { sub: admin.id, username: admin.username },
      process.env.JWT_SECRET || 'conecta-futuro-secret',
      { expiresIn: '7d' }
    );

    return NextResponse.json({ token, username: admin.username });
  } catch (error) {
    console.error('[Login Error]:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
