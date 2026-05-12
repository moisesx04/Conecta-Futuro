import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    // In a production environment, you would verify the admin token here
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
