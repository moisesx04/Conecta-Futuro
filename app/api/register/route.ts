import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { demoRegistrations } from '@/lib/demo-store'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { full_name, school_id, career_id, new_school_name, new_career_name, motivation } = body

    // 1. Intentar guardar en Base de Datos Real (Supabase)
    try {
      if (process.env.DATABASE_URL) {
        await query(
          `INSERT INTO registrations 
          (full_name, school_id, career_id, new_school_name, new_career_name, motivation) 
          VALUES ($1, $2, $3, $4, $5, $6)`,
          [full_name, school_id, career_id, new_school_name, new_career_name, motivation]
        )
        return NextResponse.json({ success: true, mode: 'production' })
      }
    } catch (dbError) {
      console.error('Database Error, falling back to demo store:', dbError)
    }

    // 2. Fallback a Demo Store (Modo Local)
    const newReg = {
      id: Date.now(),
      full_name,
      school_name: new_school_name || 'Escuela Demo',
      career_name: new_career_name || 'Carrera Demo',
      created_at: new Date().toISOString(),
      motivation
    }
    demoRegistrations.unshift(newReg)
    
    return NextResponse.json({ success: true, mode: 'demo' })
  } catch (error) {
    return NextResponse.json({ error: 'Error al registrar' }, { status: 500 })
  }
}
