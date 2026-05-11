// app/admin/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, GraduationCap, School, LogOut, BarChart3, List, RefreshCw, Calendar, ChevronRight } from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [registrations, setRegistrations] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'stats' | 'list'>('stats')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    async function fetchData() {
      try {
        const [sr, rr] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/registrations')
        ])
        if (sr.ok) setStats(await sr.json())
        if (rr.ok) setRegistrations(await rr.json())
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <RefreshCw className="w-10 h-10 text-red-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col p-8 fixed h-full">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-black text-slate-900 tracking-tight text-xl">Conecta Futuro</h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'stats' ? 'bg-red-500 text-white shadow-xl shadow-red-100' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <BarChart3 className="w-6 h-6" />
            <span>Resumen</span>
          </button>
          <button 
            onClick={() => setActiveTab('list')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'list' ? 'bg-red-500 text-white shadow-xl shadow-red-100' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <List className="w-6 h-6" />
            <span>Registros</span>
          </button>
        </nav>

        <button onClick={handleLogout} className="mt-auto flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-red-400 hover:bg-red-50 transition-all">
          <LogOut className="w-6 h-6" />
          <span>Cerrar Sesión</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-80 p-12">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">¡Hola, Administrador!</h1>
            <p className="text-slate-400 font-medium italic">Aquí tienes el monitoreo en tiempo real del sistema.</p>
          </div>
          <div className="bg-white px-6 py-4 rounded-[24px] shadow-sm flex items-center gap-4 border border-slate-100">
            <Calendar className="w-6 h-6 text-slate-400" />
            <span className="font-bold text-slate-600">{new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'stats' ? (
            <motion.div key="stats" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              {/* Cards Row */}
              <div className="grid grid-cols-3 gap-8">
                <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-50">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-6">
                    <Users className="w-8 h-8" />
                  </div>
                  <h3 className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-2">Total Registros</h3>
                  <p className="text-5xl font-black text-slate-900">{stats?.total_registrations || 0}</p>
                </div>
                <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-50">
                  <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-6">
                    <School className="w-8 h-8" />
                  </div>
                  <h3 className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-2">Escuelas Participantes</h3>
                  <p className="text-5xl font-black text-slate-900">{stats?.by_school.length || 0}</p>
                </div>
                <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-50">
                  <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 mb-6">
                    <BarChart3 className="w-8 h-8" />
                  </div>
                  <h3 className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-2">Carreras de Interés</h3>
                  <p className="text-5xl font-black text-slate-900">{stats?.by_career.length || 0}</p>
                </div>
              </div>

              {/* Charts Row (Simplified as lists for better mobile-first feel) */}
              <div className="grid grid-cols-2 gap-8">
                <div className="bg-white p-12 rounded-[50px] shadow-sm border border-slate-50">
                  <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                    <div className="w-2 h-8 bg-blue-500 rounded-full" />
                    Top por Carrera
                  </h3>
                  <div className="space-y-6">
                    {stats?.by_career.slice(0, 5).map((c: any, i: number) => (
                      <div key={i} className="flex items-center justify-between group">
                        <span className="font-bold text-slate-600 group-hover:text-blue-500 transition-colors">{c.name}</span>
                        <div className="flex items-center gap-4">
                          <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${(c.count / (stats?.total_registrations || 1)) * 100}%` }} className="h-full bg-blue-500" />
                          </div>
                          <span className="font-black text-slate-900">{c.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-12 rounded-[50px] shadow-sm border border-slate-50">
                  <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                    <div className="w-2 h-8 bg-red-500 rounded-full" />
                    Top por Escuela
                  </h3>
                  <div className="space-y-6">
                    {stats?.by_school.slice(0, 5).map((s: any, i: number) => (
                      <div key={i} className="flex items-center justify-between group">
                        <span className="font-bold text-slate-600 group-hover:text-red-500 transition-colors">{s.name}</span>
                        <div className="flex items-center gap-4">
                          <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${(s.count / (stats?.total_registrations || 1)) * 100}%` }} className="h-full bg-red-500" />
                          </div>
                          <span className="font-black text-slate-900">{s.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-[50px] shadow-sm border border-slate-50 overflow-hidden">
              <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <h3 className="text-2xl font-black text-slate-900">Listado de Registros</h3>
                <span className="px-6 py-2 bg-slate-100 rounded-full text-slate-500 font-black text-xs uppercase tracking-widest">{registrations.length} Total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-10 py-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Estudiante</th>
                      <th className="px-10 py-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Institución</th>
                      <th className="px-10 py-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Carrera</th>
                      <th className="px-10 py-6 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {registrations.map((r, i) => (
                      <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-10 py-8">
                          <p className="font-black text-slate-900 text-lg group-hover:text-red-500 transition-colors">{r.full_name}</p>
                          <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-tighter">{new Date(r.created_at).toLocaleDateString()}</p>
                        </td>
                        <td className="px-10 py-8 font-bold text-slate-600">{r.school_name || 'N/A'}</td>
                        <td className="px-10 py-8">
                          <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm">{r.career_name || 'N/A'}</span>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <button className="p-3 bg-slate-100 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
