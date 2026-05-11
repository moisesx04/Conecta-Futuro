'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, GraduationCap, School, LogOut, BarChart3, 
  List, RefreshCw, Calendar, ChevronRight, Download,
  Copy, ExternalLink, ShieldCheck, Menu, X
} from 'lucide-react'

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Cell 
} from 'recharts'

// Custom Tooltip for the chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-800 backdrop-blur-md">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Carrera</p>
        <p className="text-sm font-bold mb-2">{payload[0].payload.name}</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <p className="text-lg font-black text-blue-400">{payload[0].value} <span className="text-[10px] text-slate-500">Interesados</span></p>
        </div>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [registrations, setRegistrations] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'stats' | 'list'>('stats')
  const [loading, setLoading] = useState(true)
  const [copySuccess, setCopySuccess] = useState(false)
  const [selectedArea, setSelectedArea] = useState('Todos')
  const router = useRouter()

  // Filter data based on selected area
  const chartData = stats?.by_career?.filter((c: any) => {
    if (selectedArea === 'Todos') return true;
    if (selectedArea === 'Informática') return c.name.match(/Software|Redes|Soporte|Videojuegos/i);
    if (selectedArea === 'Salud') return c.name.match(/Enfermería|Imagen|Dental/i);
    if (selectedArea === 'Artes') return c.name.match(/Diseño|Fotografía|Eventos/i);
    if (selectedArea === 'Turismo') return c.name.match(/Cocina|Panadería|Gestión/i);
    return true;
  }).sort((a: any, b: any) => b.count - a.count) || []

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

  const handleCopyLink = () => {
    const url = window.location.origin + '/registro'
    navigator.clipboard.writeText(url)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 border-4 border-blue-600 border-t-red-600 rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col lg:flex-row overflow-x-hidden font-sans relative">
      {/* Dynamic Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, -50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/5 rounded-full blur-[100px]" 
        />
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-0 z-50 lg:z-auto
        w-full lg:w-72 h-screen
        transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="absolute inset-0 bg-black/20 lg:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        
        <div className="bg-white lg:bg-blue-900 border-r border-slate-200 lg:border-none h-full flex flex-col relative z-10 shadow-2xl lg:shadow-none">
          <div className="p-8 flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-900 shadow-lg shadow-black/10"
            >
              <GraduationCap className="w-6 h-6" />
            </motion.div>
            <div className="lg:text-white">
              <h2 className="font-black tracking-tight text-xl">Conecta <span className="text-red-500">Futuro</span></h2>
              <p className="text-white/40 text-[9px] font-black uppercase tracking-widest leading-none">Admin Panel</p>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4">
            {[
              { id: 'stats', label: 'Resumen', icon: BarChart3 },
              { id: 'list', label: 'Registros', icon: List },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any)
                  setIsMobileMenuOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all relative overflow-hidden group ${
                  activeTab === item.id 
                    ? 'bg-blue-600 lg:bg-white/10 text-white shadow-xl' 
                    : 'text-slate-400 lg:text-slate-400/60 hover:bg-slate-50 lg:hover:bg-white/5 lg:hover:text-white'
                }`}
              >
                {activeTab === item.id && (
                  <motion.div layoutId="tabActive" className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent lg:border-l-4 border-red-500" />
                )}
                <item.icon className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform" />
                <span className="relative z-10">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-6 border-t border-slate-100 lg:border-white/5">
            <motion.button 
              whileHover={{ x: 5 }}
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-6 py-4 rounded-xl font-bold text-red-500 lg:text-red-400 hover:bg-red-50 lg:hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar Sesión</span>
            </motion.button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto custom-scrollbar z-10 relative">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-8 bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-3 bg-slate-50 rounded-xl">
            <Menu className="w-6 h-6 text-blue-900" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-black text-blue-900 text-sm tracking-tight">Dashboard</span>
          </div>
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-red-500" />
          </div>
        </div>

        <header className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard</h1>
            <div className="flex items-center gap-2 text-slate-400 font-bold text-sm mt-1">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
              <span>Actividad en Tiempo Real</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-3 bg-white/50 backdrop-blur-md p-2 rounded-full border border-white shadow-2xl shadow-slate-200/40 w-full md:w-auto"
          >
            <div className="px-5 py-3 bg-white/50 rounded-full hidden xl:block border border-white shadow-inner">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Link Oficial</p>
              <p className="text-xs font-bold text-blue-600">conecta-futuro.vercel.app</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopyLink}
              className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-full font-black text-sm transition-all shadow-xl shadow-blue-600/30 border-t border-white/20"
            >
              {copySuccess ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
              <span>{copySuccess ? '¡Copiado!' : 'Copiar Link'}</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, rotate: 5, y: -2 }}
              onClick={() => window.open('/registro', '_blank')}
              className="p-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-full transition-all shadow-xl shadow-red-600/30 border-t border-white/20"
            >
              <ExternalLink className="w-6 h-6" />
            </motion.button>
          </motion.div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'stats' ? (
            <motion.div 
              key="stats"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
              className="space-y-10"
            >
              {/* Compact KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { label: 'Total Registros', value: stats?.total_registrations || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Escuelas', value: stats?.by_school?.length || 0, icon: School, color: 'text-red-600', bg: 'bg-red-50' },
                  { label: 'Carreras', value: stats?.by_career?.length || 0, icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                ].map((kpi, i) => (
                  <motion.div 
                    key={i}
                    variants={{
                      hidden: { y: 20, opacity: 0 },
                      visible: { y: 0, opacity: 1 }
                    }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex items-center gap-6 group relative overflow-hidden"
                  >
                    <div className={`w-16 h-16 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                      <kpi.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-1">{kpi.label}</h3>
                      <p className="text-4xl font-black text-slate-900 tracking-tighter">{kpi.value}</p>
                    </div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                ))}
              </div>

              {/* Area Distribution and Detail Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[600px]">
                
                {/* Left: Overall Area Distribution (Pie Chart) */}
                <motion.div 
                  variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}
                  className="lg:col-span-4 bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 flex flex-col"
                >
                  <div className="mb-6">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Distribución por Área</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Visión Global</p>
                  </div>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={[
                          { name: 'Artes', count: stats?.by_career?.filter((c: any) => c.name.match(/Diseño|Fotografía|Eventos/i)).reduce((a:any,b:any)=>a+b.count,0) },
                          { name: 'Salud', count: stats?.by_career?.filter((c: any) => c.name.match(/Enfermería|Imagen|Dental/i)).reduce((a:any,b:any)=>a+b.count,0) },
                          { name: 'Info', count: stats?.by_career?.filter((c: any) => c.name.match(/Software|Redes|Soporte|Videojuegos/i)).reduce((a:any,b:any)=>a+b.count,0) },
                          { name: 'Indus', count: stats?.by_career?.filter((c: any) => c.name.match(/Manufactura|Logística|Dirección/i)).reduce((a:any,b:any)=>a+b.count,0) },
                          { name: 'Turis', count: stats?.by_career?.filter((c: any) => c.name.match(/Cocina|Panadería|Gestión/i)).reduce((a:any,b:any)=>a+b.count,0) },
                        ]}
                      >
                        <XAxis dataKey="name" tick={{fontSize: 10, fontWeight: 800}} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="count" radius={[10, 10, 0, 0]} fill="#2563eb">
                          <Cell fill="#3b82f6" />
                          <Cell fill="#ef4444" />
                          <Cell fill="#10b981" />
                          <Cell fill="#f59e0b" />
                          <Cell fill="#8b5cf6" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* Right: Detailed Area Explorer */}
                <motion.div 
                  variants={{ hidden: { x: 20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}
                  className="lg:col-span-8 bg-slate-900 rounded-[40px] p-8 text-white flex flex-col overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                      <h3 className="text-2xl font-black tracking-tight">Explorador de Carreras</h3>
                      <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">Selecciona un área para ver detalles</p>
                    </div>
                    <div className="flex bg-white/10 p-1 rounded-2xl overflow-x-auto max-w-full custom-scrollbar-white">
                      {['Todos', 'Informática', 'Salud', 'Artes', 'Turismo'].map((area) => (
                        <button 
                          key={area}
                          onClick={() => setSelectedArea(area)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            selectedArea === area ? 'bg-white text-blue-900 shadow-lg' : 'hover:bg-white/10 text-white/60'
                          }`}
                        >
                          {area}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={chartData.slice(0, 8)}
                        margin={{ left: 20, right: 40 }}
                      >
                        <XAxis type="number" hide />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          width={140} 
                          tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)', radius: 10 }} content={<CustomTooltip />} />
                        <Bar 
                          dataKey="count" 
                          radius={[0, 10, 10, 0]} 
                          barSize={24}
                        >
                          {chartData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#ef4444'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                    <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em]">Mostrando top carreras con más interés</p>
                    <button className="text-[10px] font-black text-blue-400 hover:text-white transition-colors uppercase tracking-widest">Ver Listado Completo</button>
                  </div>
                </motion.div>

              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden"
            >
              <div className="p-10 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Base de Datos</h3>
                  <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Registros en tiempo real</p>
                </div>
                <div className="flex items-center gap-4">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    onClick={() => {
                      if (!registrations.length) return
                      const headers = ['Estudiante', 'Institución', 'Carrera', 'Fecha'];
                      const csvContent = [
                        headers.join(','),
                        ...registrations.map((r: any) => [
                          `"${r.full_name}"`,
                          `"${r.school_name}"`,
                          `"${r.career_name}"`,
                          new Date(r.created_at).toLocaleDateString()
                        ].join(','))
                      ].join('\n');
                      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                      const link = document.createElement('a');
                      link.href = URL.createObjectURL(blob);
                      link.download = `conecta_futuro_${new Date().toISOString().split('T')[0]}.csv`;
                      link.click();
                    }}
                    className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar CSV</span>
                  </motion.button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Estudiante</th>
                      <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Institución</th>
                      <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Carrera</th>
                      <th className="px-10 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {registrations.map((r, i) => (
                      <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-10 py-6">
                          <p className="font-black text-slate-900">{r.full_name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{new Date(r.created_at).toLocaleDateString()}</p>
                        </td>
                        <td className="px-10 py-6">
                          <span className="text-xs font-bold text-slate-500">{r.school_name || 'Particular'}</span>
                        </td>
                        <td className="px-10 py-6">
                          <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg font-black text-[9px] uppercase tracking-widest">
                            {r.career_name}
                          </span>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <button className="p-2 bg-slate-100 rounded-full hover:bg-blue-600 hover:text-white transition-all">
                            <ChevronRight className="w-4 h-4" />
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

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar-white::-webkit-scrollbar {
          height: 4px;
        }
        .custom-scrollbar-white::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  )
}
