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
      
      // Si la DB es real pero está vacía, o si la consulta funciona:
      const formatted = res.rows.map(r => ({
        ...r,
        school_name: r.school_name || r.new_school_name || 'Particular',
        career_name: r.career_name || r.new_career_name || 'Otra'
      }))

      if (formatted.length > 0) {
        return NextResponse.json(formatted)
      }
    }
  } catch (error) {
    console.error('DB Error, using demo data:', error)
  }

  // 2. Fallback a datos Demo
  return NextResponse.json(demoRegistrations)
}
