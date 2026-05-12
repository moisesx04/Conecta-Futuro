'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Users, GraduationCap, School, LogOut, BarChart3, 
  List, RefreshCw, ChevronLeft, Download, Search,
  Filter, Calendar, ExternalLink, X
} from 'lucide-react'

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    async function fetchRegistrations() {
      try {
        const res = await fetch('/api/admin/registrations')
        if (res.ok) {
          const data = await res.json()
          setRegistrations(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        console.error('Error fetching registrations:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchRegistrations()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  const filteredRegistrations = registrations.filter(r => 
    r.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.school_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.career_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 border-4 border-blue-600 border-t-red-600 rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-12">
      <header className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Consulta de Registro</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2 ml-1">Visualización de Registros Reales</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex-1 md:w-80 bg-white/60 backdrop-blur-xl border border-white rounded-2xl flex items-center px-4 shadow-sm">
            <Search className="w-5 h-5 text-slate-300" />
            <input 
              type="text"
              placeholder="Buscar por nombre, carrera..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 bg-transparent outline-none text-sm font-bold placeholder:text-slate-300"
            />
          </div>
          <button className="p-4 bg-white/60 backdrop-blur-xl border border-white rounded-2xl hover:bg-white transition-all shadow-sm">
            <Filter className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </header>

      <section className="relative z-10 bg-white/60 backdrop-blur-2xl border border-white rounded-[40px] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.05)] overflow-hidden mb-12">
        <div className="p-8 border-b border-white/40 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {filteredRegistrations.length} Registros Encontrados
            </p>
          </div>
          <button 
            onClick={() => {
              const csv = filteredRegistrations.map(r => `${r.full_name},${r.school_name},${r.career_name},${r.created_at}`).join('\n')
              const blob = new Blob([csv], { type: 'text/csv' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'registros_conecta_futuro.csv'
              a.click()
            }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-600/20 hover:scale-105 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estudiante</th>
                <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Institución de Origen</th>
                <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Carrera Elegida</th>
                <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Fecha</th>
                <th className="px-10 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {filteredRegistrations.length > 0 ? (
                filteredRegistrations.map((r, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    key={r.id} 
                    className="hover:bg-white transition-all group"
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 font-black text-xs border border-white">
                          {r.full_name?.charAt(0)}
                        </div>
                        <p className="font-black text-slate-900 text-sm">{r.full_name}</p>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-slate-600 text-xs font-bold">{r.school_name}</td>
                    <td className="px-10 py-6">
                      <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg font-black text-[9px] uppercase tracking-widest border border-blue-100/50">
                        {r.career_name}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-slate-400 text-[10px] font-black uppercase">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-blue-600 hover:bg-blue-50 transition-all">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-red-500 hover:bg-red-50 transition-all">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-32 text-center">
                    <div className="flex flex-col items-center opacity-20">
                      <Users className="w-16 h-16 mb-4" />
                      <p className="text-sm font-black uppercase tracking-widest">No hay registros reales aún</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
