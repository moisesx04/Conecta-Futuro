'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, GraduationCap, School, LogOut, BarChart3, 
  List, RefreshCw, Calendar, ChevronRight, Download,
  Copy, ExternalLink, ShieldCheck, Menu, X,
  Sparkles, Brain, Star, TrendingUp, Lightbulb,
  ArrowUpRight, ArrowDownRight, Activity, Clock
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

const Sparkline = ({ data, color }: { data: any[], color: string }) => (
  <div className="h-12 w-24">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <Area 
          type="monotone" 
          dataKey="val" 
          stroke={color} 
          fill={`${color}10`} 
          strokeWidth={2} 
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
)

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [registrations, setRegistrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [copySuccess, setCopySuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
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
  }, [])

  const handleCopyLink = async () => {
    const url = 'https://conecta-futuro-mu.vercel.app/registro'
    navigator.clipboard.writeText(url)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const activityData = stats?.activity || [
    { name: 'Lun', val: 12 }, { name: 'Mar', val: 19 }, { name: 'Mie', val: 15 },
    { name: 'Jue', val: 22 }, { name: 'Vie', val: 30 }, { name: 'Sab', val: 10 }, { name: 'Dom', val: 5 }
  ]

  const schoolData = (stats?.by_school || []).sort((a: any, b: any) => b.count - a.count).slice(0, 5)

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-12 h-12 bg-blue-600 rounded-2xl"
        />
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Bienvenido, Admin Central 👋</h1>
          <p className="text-slate-400 font-bold text-sm mt-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Última actualización: {new Date().toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-xs hover:bg-slate-50 transition-all shadow-sm"
          >
            {copySuccess ? <ShieldCheck className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
            <span>Copiar Link de Registro</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
            <RefreshCw className="w-4 h-4" />
            <span>Sincronizar</span>
          </button>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Estudiantes', val: stats?.total_registrations || 0, trend: '+12.5%', up: true, icon: Users, color: '#3b82f6' },
          { label: 'Matrículas Activas', val: Math.floor((stats?.total_registrations || 0) * 0.8), trend: '+3.2%', up: true, icon: GraduationCap, color: '#ef4444' },
          { label: 'Nuevos Hoy', val: registrations.filter(r => new Date(r.created_at).toDateString() === new Date().toDateString()).length, trend: '+5.1%', up: true, icon: Activity, color: '#10b981' },
          { label: 'Tasa de Conversión', val: '84.5%', trend: '-1.2%', up: false, icon: TrendingUp, color: '#8b5cf6' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bento-card group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-2xl bg-slate-100 group-hover:scale-110 transition-transform duration-500`} style={{ color: stat.color }}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${stat.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <div className="flex items-end justify-between">
                <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.val}</h4>
                <Sparkline data={activityData} color={stat.color} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-8 bento-card flex flex-col h-[450px]">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Actividad Semanal</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Registros consolidados por día</p>
            </div>
            <div className="flex gap-2">
              {['7D', '30D', '90D'].map(t => (
                <button key={t} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${t === '7D' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="mainGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} 
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="val" 
                  stroke="#3b82f6" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#mainGradient)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Actions/Activity */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bento-card !p-6 flex flex-col justify-between h-[213px]">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight mb-4">Acciones Rápidas</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 bg-blue-600 rounded-2xl text-white group hover:bg-blue-700 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold">Nuevo Alumno</span>
                  </div>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-slate-900 rounded-2xl text-white group hover:bg-black transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <Download className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold">Generar Reporte</span>
                  </div>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          <div className="bento-card !p-6 flex flex-col h-[213px]">
            <h3 className="text-lg font-black text-slate-900 tracking-tight mb-4">Top Escuelas</h3>
            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
              {schoolData.map((s: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-400">
                      0{i+1}
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 truncate max-w-[120px]">{s.name}</span>
                  </div>
                  <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bento-card !p-0 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Registros Recientes</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Últimos estudiantes inscritos</p>
          </div>
          <button 
            onClick={() => router.push('/admin/registrations')}
            className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
          >
            Ver todos los registros
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Estudiante</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Carrera</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {registrations.slice(0, 5).map((r, i) => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center font-black text-slate-400 text-[10px]">
                        {r.full_name.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-slate-900">{r.full_name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-medium text-slate-500">{r.career_name}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase">
                      <div className="w-1 h-1 bg-green-600 rounded-full" />
                      Activo
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right text-xs font-bold text-slate-400">
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
