import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Faltan credenciales' }, { status: 400 });
    }

    let authorized = false;

    // Try DB first
    try {
      const result = await query(
        'SELECT password_hash FROM admins WHERE username = $1',
        [username]
      );
      if (result.rows[0] && result.rows[0].password_hash === password) {
        authorized = true;
      }
    } catch (err) {
      // Fallback to admin/admin for demo/local
      if (username === 'admin' && password === 'admin') {
        authorized = true;
      }
    }

    if (!authorized) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    await query('DELETE FROM registrations');
    return NextResponse.json({ message: 'Registros eliminados correctamente' });
  } catch (error) {
    console.error('Error clearing registrations:', error);
    return NextResponse.json(
      { error: 'Error al limpiar los registros' },
      { status: 500 }
    );
  }
}
