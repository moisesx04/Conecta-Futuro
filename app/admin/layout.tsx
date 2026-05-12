'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, GraduationCap, School, LogOut, BarChart3, 
  List, ExternalLink, Menu, X, ChevronRight, Settings,
  Sparkles, Bell
} from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
    
    if (!isLoginPage && !token) {
      router.push('/admin/login')
    } else {
      setAuthorized(true)
    }
  }, [pathname, router, isLoginPage])

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token')
    }
    setAuthorized(false)
    router.push('/admin/login')
  }

  if (isLoginPage) {
    return <>{children}</>
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-red-500 rounded-full"
        />
      </div>
    )
  }

  const navItems = [
    { id: 'stats', label: 'Dashboard', icon: BarChart3, path: '/admin/dashboard' },
    { id: 'list', label: 'Registros', icon: List, path: '/admin/registrations' },
    { id: 'settings', label: 'Ajustes', icon: Settings, path: '/admin/settings' },
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col lg:flex-row overflow-x-hidden font-sans selection:bg-blue-100">
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-0 z-50 lg:z-auto
        w-full lg:w-[280px] h-screen
        transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1)
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Backdrop for mobile */}
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-md lg:hidden transition-opacity duration-500 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
        
        <div className="bg-[#09090b] h-full flex flex-col relative z-10 overflow-hidden">
          {/* Decorative Glows */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-red-600/10 to-transparent pointer-events-none" />
          
          <div className="p-8 flex items-center gap-4 relative z-20">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-900/40"
            >
              <GraduationCap className="w-7 h-7" />
            </motion.div>
            <div>
              <h2 className="font-black tracking-tight text-xl text-white">Conecta <span className="text-red-500">Futuro</span></h2>
              <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em] leading-none">Management UI</p>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-8 relative z-20">
            {navItems.map((item) => {
              const isActive = pathname === item.path
              return (
                <button 
                  key={item.id}
                  onClick={() => {
                    router.push(item.path)
                    setIsMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all group relative overflow-hidden ${
                    isActive 
                      ? 'bg-white/10 text-white shadow-xl' 
                      : 'text-white/40 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="sidebarActive"
                      className="absolute left-0 w-1.5 h-6 bg-red-500 rounded-r-full"
                    />
                  )}
                  <item.icon className={`w-5 h-5 transition-transform duration-500 group-hover:scale-110 ${isActive ? 'text-blue-400' : ''}`} />
                  <span className="text-sm tracking-tight">{item.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="p-8 mt-auto relative z-20">
            <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Pro Version</p>
              </div>
              <p className="text-[11px] text-white/40 leading-relaxed font-medium">
                Acceso total a estadísticas y exportación de datos.
              </p>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 text-red-500 rounded-xl font-bold text-xs hover:bg-red-500/20 transition-all border border-red-500/10"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-h-screen flex flex-col relative z-10">
        {/* Top Navigation Bar */}
        <header className="h-20 border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="lg:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-3 bg-slate-100 rounded-xl text-slate-600 active:scale-95 transition-all"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>Admin</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900">{navItems.find(i => i.path === pathname)?.label || 'Dashboard'}</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all relative">
              <Bell className="w-5 h-5" />
              <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-900">Admin Central</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Root Access</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-full border-2 border-white shadow-sm flex items-center justify-center font-black text-slate-400 text-xs">
                AC
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 lg:p-12 relative overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  )
}
