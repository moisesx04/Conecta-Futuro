'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, GraduationCap, School, LogOut, BarChart3, 
  List, RefreshCw, Calendar, ChevronRight, Download,
  Copy, ExternalLink, ShieldCheck, Menu, X,
  Sparkles, Brain, Star, TrendingUp, Lightbulb
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

  // Prepare data for the charts with safety checks
  const chartData = (stats?.by_career || []).filter((c: any) => {
    if (!c || !c.name) return false;
    if (selectedArea === 'Todos') return true;
    if (selectedArea === 'Informática') return c.name.match(/Software|Redes|Soporte|Videojuegos/i);
    if (selectedArea === 'Salud') return c.name.match(/Enfermería|Imagen|Dental/i);
    if (selectedArea === 'Artes') return c.name.match(/Diseño|Fotografía|Eventos/i);
    if (selectedArea === 'Turismo') return c.name.match(/Cocina|Panadería|Gestión/i);
    return true;
  }).sort((a: any, b: any) => (b.count || 0) - (a.count || 0))

  const schoolData = (stats?.by_school || []).sort((a: any, b: any) => (b.count || 0) - (a.count || 0))
  
  // Real activity data from database
  const activityData = stats?.activity || [
    { name: 'Lun', val: 0 }, { name: 'Mar', val: 0 }, { name: 'Mie', val: 0 },
    { name: 'Jue', val: 0 }, { name: 'Vie', val: 0 }, { name: 'Sab', val: 0 }, { name: 'Dom', val: 0 }
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

  const handleCopyLink = async () => {
    const url = 'https://conecta-futuro-mu.vercel.app/registro'
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Conecta Futuro',
          text: 'Regístrate en la plataforma Conecta Futuro',
          url: url
        })
      } catch (err) {
        // Fallback to copy if sharing was cancelled or failed
        navigator.clipboard.writeText(url)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      }
    } else {
      navigator.clipboard.writeText(url)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
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
    <div className="p-6 lg:p-12">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
        <div>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Dashboard</h2>
          <div className="flex items-center gap-3 mt-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Actividad en Tiempo Real</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="px-6 py-3 bg-white/40 backdrop-blur-md border border-white rounded-2xl flex items-center gap-4">
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Link Oficial</p>
              <p className="text-[11px] font-bold text-blue-600">/registro</p>
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
            className="flex items-center gap-3 px-6 py-4 bg-white/60 backdrop-blur-md border border-white text-slate-600 rounded-2xl hover:bg-white transition-all shadow-sm group font-bold text-xs"
          >
            <ExternalLink className="w-5 h-5 group-hover:text-blue-600" />
            <span>Abrir Registro</span>
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
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-slate-50 opacity-0 group-hover:opacity-10 transition-opacity" />
                </motion.div>
              ))}
            </div>

            {/* Row 1: Main Stats & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <motion.div 
                className="lg:col-span-8 bg-white/60 backdrop-blur-2xl border border-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-8 flex flex-col h-[400px]"
              >
                <div className="mb-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Actividad de Registro</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Tendencia de los últimos 7 días</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">En Vivo</span>
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

              <motion.div className="lg:col-span-4 bg-white/60 backdrop-blur-2xl border border-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-8 flex flex-col h-[400px]">
                <div className="mb-8">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Top Instituciones</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Proporción por Centro</p>
                </div>
                <div className="flex-1 min-h-0 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={schoolData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="count" animationDuration={1500}>
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
            </div>
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/60 backdrop-blur-2xl border border-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden mb-12">
            <div className="p-8 border-b border-white/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Ver registros guardados</h3>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Registros consolidados</p>
              </div>
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
                  {Array.isArray(registrations) && registrations.length > 0 ? (
                    registrations.map((r, i) => (
                      <tr key={r?.id || i} className="hover:bg-white/60 transition-colors group">
                        <td className="px-8 py-5">
                          <p className="font-black text-slate-900 text-sm">{r?.full_name || 'Sin Nombre'}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                            {r?.created_at ? new Date(r.created_at).toLocaleDateString() : 'Sin fecha'}
                          </p>
                        </td>
                        <td className="px-8 py-5 text-slate-600 text-xs font-bold">{r?.school_name}</td>
                        <td className="px-8 py-5 text-blue-600 text-xs font-black">{r?.career_name}</td>
                        <td className="px-8 py-5 text-right">
                          <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                            <X className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center opacity-20">
                          <Users className="w-12 h-12 mb-4" />
                          <p className="text-[10px] font-black uppercase tracking-widest">No se encontraron registros reales</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar-white::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar-white::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  )
}
