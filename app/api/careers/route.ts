// app/api/careers/route.ts
import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export async function GET() {
  try {
    const result = await query('SELECT id, name FROM careers ORDER BY name');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching careers' }, { status: 500 });
  }
}
