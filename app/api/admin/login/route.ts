// app/api/admin/login/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { username = 'admin', password } = await request.json();
    const jwtSecret = process.env.JWT_SECRET || 'secret';

    const result = await query('SELECT * FROM admins WHERE username = $1', [username]);
    const admin = result.rows[0];

    if (admin && admin.password_hash === password) {
      const token = jwt.sign({ sub: admin.username }, jwtSecret, { expiresIn: '7d' });
      return NextResponse.json({ token });
    }

    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
