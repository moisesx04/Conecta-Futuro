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
  Tooltip as RechartsTooltip, ResponsiveContainer, Cell,
  AreaChart, Area, PieChart, Pie, LineChart, Line
} from 'recharts'

// Custom Tooltip for the chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 text-white p-4 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl">
        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{payload[0].payload.name}</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <p className="text-lg font-black text-blue-400">{payload[0].value} <span className="text-[10px] text-white/20">Registros</span></p>
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedArea, setSelectedArea] = useState('Todos')
  const router = useRouter()

  // Prepare data for the charts
  const chartData = stats?.by_career?.filter((c: any) => {
    if (selectedArea === 'Todos') return true;
    if (selectedArea === 'Informática') return c.name.match(/Software|Redes|Soporte|Videojuegos/i);
    if (selectedArea === 'Salud') return c.name.match(/Enfermería|Imagen|Dental/i);
    if (selectedArea === 'Artes') return c.name.match(/Diseño|Fotografía|Eventos/i);
    if (selectedArea === 'Turismo') return c.name.match(/Cocina|Panadería|Gestión/i);
    return true;
  }).sort((a: any, b: any) => b.count - a.count) || []

  const schoolData = stats?.by_school?.sort((a: any, b: any) => b.count - a.count) || []
  
  // Mock activity data for the line chart (real systems would fetch this)
  const activityData = [
    { name: 'Lun', val: 2 }, { name: 'Mar', val: 5 }, { name: 'Mie', val: 3 },
    { name: 'Jue', val: 8 }, { name: 'Vie', val: 12 }, { name: 'Sab', val: 7 }, { name: 'Dom', val: 4 }
  ]


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
      <main className="lg:ml-72 p-6 lg:p-12 relative z-10">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-4 bg-white rounded-2xl shadow-sm">
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
            <div>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Dashboard</h2>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Actividad en Tiempo Real</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="px-6 py-3 bg-white/40 backdrop-blur-md border border-white rounded-2xl flex items-center gap-4">
              <div className="text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Link Oficial</p>
                <p className="text-[11px] font-bold text-blue-600">conecta-futuro.vercel.app</p>
              </div>
              <button 
                onClick={handleCopyLink}
                className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
              >
                {copySuccess ? <ShieldCheck className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <a 
              href="/registro" 
              target="_blank"
              className="p-4 bg-white/40 backdrop-blur-md border border-white text-slate-600 rounded-2xl hover:bg-white transition-all shadow-sm group"
            >
              <ExternalLink className="w-6 h-6 group-hover:text-blue-600" />
            </a>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'stats' ? (
            <motion.div 
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { label: 'Total Registros', val: stats?.total_registrations || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-600' },
                  { label: 'Escuelas', val: stats?.by_school?.length || 0, icon: School, color: 'text-red-600', bg: 'bg-red-600' },
                  { label: 'Carreras', val: stats?.by_career?.length || 0, icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-600' }
                ].map((stat, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="group bg-white/60 backdrop-blur-2xl border border-white rounded-[32px] p-8 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.03)] relative overflow-hidden"
                  >
                    <div className="relative z-10 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                        <h4 className="text-5xl font-black text-slate-900 tracking-tighter">{stat.val}</h4>
                      </div>
                      <div className={`w-16 h-16 ${stat.bg}/10 rounded-2xl flex items-center justify-center`}>
                        <stat.icon className={`w-8 h-8 ${stat.color}`} />
                      </div>
                    </div>
                    {/* Hover Decoration */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                ))}
              </div>

              {/* Row 1: Activity Line Chart (Wide) */}
              <motion.div 
                className="bg-white/60 backdrop-blur-2xl border border-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-8 flex flex-col mb-8 h-[350px]"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Actividad de Registro</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Tendencia de los últimos 7 días</p>
                  </div>
                </div>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activityData}>
                      <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="val" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Row 2: Two Column Widgets */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left: Institution Donut Chart */}
                <motion.div 
                  className="lg:col-span-4 bg-white/60 backdrop-blur-2xl border border-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-8 flex flex-col h-[450px]"
                >
                  <div className="mb-8">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Top Instituciones</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Proporción por Centro</p>
                  </div>
                  <div className="flex-1 min-h-0 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={schoolData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="count"
                          animationDuration={1500}
                        >
                          {schoolData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#2563eb' : '#ef4444'} />
                          ))}
                        </Pie>
                        <RechartsTooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <p className="text-2xl font-black text-slate-900 leading-none">{stats?.total_registrations || 0}</p>
                      <p className="text-[8px] font-black text-slate-400 uppercase mt-1">Total</p>
                    </div>
                  </div>
                </motion.div>

                {/* Right: Modern Career Explorer */}
                <motion.div 
                  className="lg:col-span-8 bg-slate-900/90 backdrop-blur-2xl border border-white/5 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 text-white flex flex-col h-[450px]"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                      <h3 className="text-xl font-black tracking-tight text-white">Ranking de Interés</h3>
                      <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">Demanda por especialidad</p>
                    </div>
                    <div className="flex bg-white/5 p-1 rounded-xl overflow-x-auto max-w-full custom-scrollbar-white gap-1">
                      {['Todos', 'Informática', 'Salud', 'Artes'].map((area) => (
                        <button 
                          key={area}
                          onClick={() => setSelectedArea(area)}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                            selectedArea === area ? 'bg-white text-slate-900 shadow-xl' : 'text-white/40 hover:bg-white/5'
                          }`}
                        >
                          {area}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar-white space-y-4">
                    {chartData.length > 0 ? (
                      chartData.map((career: any, index: number) => {
                        const maxCount = Math.max(...chartData.map((c:any) => c.count));
                        const percentage = (career.count / maxCount) * 100;
                        
                        return (
                          <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={career.name} 
                            className="group"
                          >
                            <div className="flex justify-between items-end mb-2">
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-white/20 w-5">#{index + 1}</span>
                                <span className="text-xs font-bold text-white/80 group-hover:text-white transition-colors line-clamp-1">{career.name}</span>
                              </div>
                              <span className="text-[10px] font-black text-blue-400">{career.count} <span className="text-white/20 ml-1 italic">Votos</span></span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full rounded-full ${index % 2 === 0 ? 'bg-gradient-to-r from-blue-600 to-blue-400' : 'bg-gradient-to-r from-red-600 to-red-400'}`}
                              />
                            </div>
                          </motion.div>
                        );
                      })
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center opacity-20">
                        <BarChart3 className="w-12 h-12 mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Sin datos</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Ranking dinámico</p>
                    <div className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/60 backdrop-blur-2xl border border-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden"
            >
              <div className="p-8 border-b border-white/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Base de Datos</h3>
                  <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Registros consolidados</p>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => {
                      if (!registrations.length) return
                      const csvContent = registrations.map((r: any) => [r.full_name, r.school_name, r.career_name].join(',')).join('\n');
                      const blob = new Blob([csvContent], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'registros.csv';
                      a.click();
                    }}
                    className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/20"
                  >
                    <Download className="w-4 h-4" />
                    <span>Exportar</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50/30">
                      <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Estudiante</th>
                      <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Institución</th>
                      <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Carrera</th>
                      <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/40">
                    {registrations.map((r, i) => (
                      <tr key={r.id} className="hover:bg-white/60 transition-colors group">
                        <td className="px-8 py-5">
                          <p className="font-black text-slate-900 text-sm">{r.full_name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{new Date(r.created_at).toLocaleDateString()}</p>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-[11px] font-bold text-slate-500">{r.school_name || 'Particular'}</span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="px-3 py-1 bg-blue-50/50 backdrop-blur-sm text-blue-600 rounded-lg font-black text-[9px] uppercase tracking-widest border border-blue-100/30">
                            {r.career_name}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button className="p-2 bg-slate-100/50 rounded-full hover:bg-blue-600 hover:text-white transition-all">
                            <ChevronRight className="w-3 h-3" />
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
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  )
}
