import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { demoRegistrations } from '@/lib/demo-store'

export async function GET() {
  try {
    // 1. Intentar leer de Supabase
    if (process.env.DATABASE_URL) {
      const res = await query(`
        SELECT r.*, s.name as school_name, c.name as career_name 
        FROM registrations r
        LEFT JOIN schools s ON r.school_id = s.id
        LEFT JOIN careers c ON r.career_id = c.id
        ORDER BY r.created_at DESC
      `)
      
      const formatted = res.rows.map(r => ({
        ...r,
        school_name: r.school_name || r.new_school_name || 'Particular',
        career_name: r.career_name || r.new_career_name || 'Otra'
      }))

      return NextResponse.json(formatted)
    }
  } catch (error) {
    console.error('DB Error:', error)
    return NextResponse.json({ error: 'Error al conectar con la base de datos' }, { status: 500 })
  }

  return NextResponse.json([])
}
