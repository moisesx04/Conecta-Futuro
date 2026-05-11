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

    const jwtSecret = process.env.JWT_SECRET || 'conecta-futuro-secret';
    const dbUrl = process.env.DATABASE_URL || '';
    const isPlaceholder = !dbUrl || dbUrl.includes('TUPROYECTO') || dbUrl.includes('TUCONTRASENA');

    // Demo mode: works without a real database or if it's explicitly a placeholder
    if (isPlaceholder) {
      if (username === 'admin' && password === 'admin') {
        const token = jwt.sign({ sub: 1, username: 'admin' }, jwtSecret, { expiresIn: '7d' });
        return NextResponse.json({ token, username: 'admin' });
      }
      return NextResponse.json({ error: 'Credenciales inválidas (modo demo: usa admin/admin)' }, { status: 401 });
    }

    try {
      // Production mode: verify against database
      const result = await query(
        'SELECT id, username, password_hash FROM admins WHERE username = $1',
        [username]
      );

      const admin = result.rows[0];

      if (admin && admin.password_hash === password) {
        const token = jwt.sign(
          { sub: admin.id, username: admin.username },
          jwtSecret,
          { expiresIn: '7d' }
        );
        return NextResponse.json({ token, username: admin.username });
      }
    } catch (dbError) {
      console.error('[DB Login Error - Falling back to demo]:', dbError);
      // Fallback for local development if DB is not reachable
      if (username === 'admin' && password === 'admin') {
        const token = jwt.sign({ sub: 1, username: 'admin' }, jwtSecret, { expiresIn: '7d' });
        return NextResponse.json({ token, username: 'admin' });
      }
    }

    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
  } catch (error) {
    console.error('[Login Error]:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
