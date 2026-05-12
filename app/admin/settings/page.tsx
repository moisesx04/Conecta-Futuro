'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, AlertTriangle, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react'

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [confirmUser, setConfirmUser] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [error, setError] = useState('')

  const handleClearData = async () => {
    if (!confirmUser || !confirmPass) {
      setError('Escribe tus credenciales')
      return
    }

    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/clear-registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: confirmUser, password: confirmPass })
      })
      if (res.ok) {
        setSuccess(true)
        setShowConfirm(false)
        setConfirmUser('')
        setConfirmPass('')
        setTimeout(() => setSuccess(false), 3000)
      } else {
        const data = await res.json()
        setError(data.error || 'Credenciales inválidas')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-12">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Configuración</h1>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2 ml-1">Administración del Sistema</p>
      </header>

      <div className="max-w-3xl space-y-8">
        {/* Danger Zone */}
        <section className="bg-white/60 backdrop-blur-2xl border border-red-100 rounded-[40px] p-10 shadow-xl shadow-red-600/5">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Zona de Peligro</h2>
              <p className="text-red-500 font-bold text-[10px] uppercase tracking-widest mt-1">Acciones irreversibles</p>
            </div>
          </div>

          <div className="bg-red-50/50 border border-red-100 rounded-3xl p-8 mb-8">
            <h3 className="text-lg font-black text-red-900 mb-2">Borrar todos los registros</h3>
            <p className="text-red-700/70 text-sm font-bold leading-relaxed mb-6">
              Esta acción eliminará todos los registros de estudiantes guardados en el sistema. 
              <span className="block mt-2 font-black text-red-900">Nota: Los Centros Educativos y las Carreras NO serán eliminados.</span>
            </p>

            <button 
              onClick={() => {
                setShowConfirm(true)
                setError('')
              }}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-red-600/20"
            >
              <Trash2 className="w-4 h-4" />
              Borrar Registros
            </button>
          </div>
        </section>

        {/* System Info */}
        <section className="bg-white/60 backdrop-blur-2xl border border-white rounded-[40px] p-10 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Seguridad</h2>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Estado del Servidor</p>
            </div>
          </div>
          <p className="text-slate-500 font-bold text-sm">El sistema está operando bajo protocolos de cifrado estándar para la entrega del proyecto.</p>
        </section>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setShowConfirm(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[40px] p-10 max-w-md w-full relative z-10 shadow-2xl"
            >
              <div className="w-20 h-20 bg-red-50 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 text-center mb-2 tracking-tight">Confirmar Acción</h3>
              <p className="text-slate-500 text-center font-bold text-[10px] mb-8 leading-relaxed uppercase tracking-widest">
                Escribe tus credenciales para autorizar el borrado total de registros.
              </p>

              {error && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[10px] font-black uppercase tracking-widest text-center">
                  {error}
                </motion.div>
              )}

              <div className="space-y-4 mb-8">
                <input 
                  type="text" 
                  placeholder="Usuario"
                  value={confirmUser}
                  onChange={(e) => setConfirmUser(e.target.value)}
                  className="w-full p-5 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-slate-900 outline-none focus:bg-white focus:border-red-600/20 transition-all text-sm"
                />
                <input 
                  type="password" 
                  placeholder="Contraseña"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full p-5 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-slate-900 outline-none focus:bg-white focus:border-red-600/20 transition-all text-sm"
                />
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-[24px] font-black transition-all text-xs uppercase tracking-widest"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleClearData}
                  disabled={loading}
                  className="flex-1 py-5 bg-red-600 hover:bg-red-700 text-white rounded-[24px] font-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-red-600/20 text-xs uppercase tracking-widest"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmar'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Notification */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 right-10 z-[100] bg-emerald-500 text-white px-8 py-5 rounded-[24px] shadow-2xl flex items-center gap-4"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-black uppercase tracking-widest text-xs">Registros eliminados con éxito</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
