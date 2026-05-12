'use client'
// Deployment timestamp: 2026-05-12T08:58:00

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, GraduationCap, School, LogOut, BarChart3, 
  List, ExternalLink, Menu, X, ChevronRight
} from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Don't show sidebar on login page
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return <>{children}</>
  }

  const navItems = [
    { id: 'stats', label: 'Resumen', icon: BarChart3, path: '/admin/dashboard' },
    { id: 'list', label: 'Consulta de Registro', icon: List, path: '/admin/registrations' },
  ]

  const [authorized, setAuthorized] = useState(false)

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_session_start')
    }
    setAuthorized(false)
    router.push('/admin/login')
  }

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
    
    if (!isLoginPage && !token) {
      router.push('/admin/login')
    } else {
      setAuthorized(true)
    }
  }, [pathname, router, isLoginPage])

  if (!isLoginPage && !authorized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-red-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col lg:flex-row overflow-x-hidden font-sans relative">
      {/* Dynamic Background Blobs (Global for Admin) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/5 rounded-full blur-[100px]" />
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-0 z-50 lg:z-auto
        w-full lg:w-72 h-screen
        transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Backdrop for mobile */}
        <div 
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity duration-500 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
        
        <div className="bg-white lg:bg-blue-900 border-r border-slate-200 lg:border-none h-full flex flex-col relative z-10 shadow-2xl lg:shadow-none">
          <div className="p-8 flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-10 h-10 bg-blue-600 lg:bg-white rounded-xl flex items-center justify-center text-white lg:text-blue-900 shadow-lg"
            >
              <GraduationCap className="w-6 h-6" />
            </motion.div>
            <div className="lg:text-white">
              <h2 className="font-black tracking-tight text-xl">Conecta <span className="text-red-500">Futuro</span></h2>
              <p className="text-slate-400 lg:text-white/40 text-[9px] font-black uppercase tracking-widest leading-none">Admin Panel</p>
            </div>
            {/* Close button for mobile */}
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden ml-auto p-2 text-slate-400 hover:text-slate-900"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4">
            {navItems.map((item) => {
              const isActive = pathname === item.path
              return (
                <button 
                  key={item.id}
                  onClick={() => {
                    router.push(item.path)
                    setIsMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all relative overflow-hidden group ${
                    isActive 
                      ? 'bg-blue-600 lg:bg-white/10 text-white shadow-xl shadow-blue-600/20 lg:shadow-none' 
                      : 'text-slate-400 lg:text-slate-400/60 hover:bg-slate-50 lg:hover:bg-white/5 lg:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div layoutId="navIndicator" className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent lg:border-l-4 border-red-500" />
                  )}
                  <item.icon className={`w-5 h-5 relative z-10 group-hover:scale-110 transition-transform ${isActive && item.id === 'list' ? 'text-red-400' : ''}`} />
                  <span className="relative z-10">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto lg:hidden" />}
                </button>
              )
            })}

            <div className="pt-10 px-6">
              <div className="h-px bg-slate-100 lg:bg-white/10 w-full mb-10" />
              <a 
                href="/registro"
                target="_blank"
                className="flex items-center gap-3 text-blue-500 lg:text-blue-400 font-bold hover:underline group"
              >
                <ExternalLink className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span className="text-xs uppercase tracking-widest">Ver Formulario</span>
              </a>
            </div>
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

      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-6 bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h2 className="font-black tracking-tight text-lg">Conecta <span className="text-red-500">Futuro</span></h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleLogout}
            className="p-3 bg-red-50 rounded-xl text-red-500 shadow-sm border border-red-100 active:scale-95 transition-all"
            title="Cerrar Sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-3 bg-slate-50 rounded-xl text-slate-600 shadow-sm border border-slate-100 active:scale-95 transition-all"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  )
}
