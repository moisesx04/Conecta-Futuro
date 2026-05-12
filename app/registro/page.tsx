'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Loader2, GraduationCap, ChevronRight, ArrowLeft, School, BookOpen, Sparkles, User, MessageSquare } from 'lucide-react'

export default function RegistroPage() {
  const [step, setStep] = useState(0)
  const [schools, setSchools] = useState<any[]>([])
  const [careers, setCareers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    fullName: '',
    schoolId: '',
    careerId: '',
    newSchoolName: '',
    newCareerName: '',
    motivation: '',
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const [sr, cr] = await Promise.all([
          fetch('/api/schools').catch(() => ({ ok: false, json: () => ({ error: 'Error de red' }) })),
          fetch('/api/careers').catch(() => ({ ok: false, json: () => ({ error: 'Error de red' }) })),
        ])
        
        const sData = await (sr as any).json()
        const cData = await (cr as any).json()

        if ((sr as any).ok && Array.isArray(sData)) setSchools(sData)
        else if (sData.error) setError(sData.details || sData.error)

        if ((cr as any).ok && Array.isArray(cData)) setCareers(cData)
        else if (!error && cData.error) setError(cData.details || cData.error)

      } catch (err: any) {
        console.error('Fetch error:', err)
        setError('Error al conectar con el servidor')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const nextStep = () => {
    if (step === 0 && !formData.fullName) return
    if (step === 1 && (!formData.schoolId || !formData.careerId)) return
    if (step < 2) setStep(step + 1)
    else handleSubmit()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (step === 2 && !formData.motivation) return
      e.preventDefault()
      nextStep()
    }
  }

  const handleSubmit = async () => {
    if (!formData.motivation) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.fullName,
          school_id: formData.schoolId === 'otro' ? null : parseInt(formData.schoolId),
          career_id: formData.careerId === 'otro' ? null : parseInt(formData.careerId),
          new_school_name: formData.schoolId === 'otro' ? formData.newSchoolName : null,
          new_career_name: formData.careerId === 'otro' ? formData.newCareerName : null,
          motivation: formData.motivation,
        }),
      })
      if (res.ok) setSuccess(true)
      else {
        const data = await res.json()
        setError(data.error || 'Error al enviar el registro')
      }
    } catch (err) {
      setError('Error de conexión al enviar')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-6">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-600 border-t-red-500 rounded-full"
          />
          <p className="text-white/20 font-black text-[10px] uppercase tracking-[0.3em]">Inicializando Portal...</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <main className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 text-center font-sans overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#2563eb10,transparent_50%)]" />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md relative z-10">
          <div className="w-28 h-28 bg-gradient-to-br from-blue-600 to-blue-700 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-blue-600/40 relative group">
            <CheckCircle2 className="w-14 h-14 text-white group-hover:scale-110 transition-transform" />
            <motion.div 
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute -top-3 -right-3 w-10 h-10 bg-red-600 rounded-2xl flex items-center justify-center shadow-xl border-4 border-[#09090b]"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
          </div>
          <h1 className="text-5xl font-black text-white mb-6 tracking-tighter">¡Registro <span className="text-blue-500">Exitoso!</span></h1>
          <p className="text-white/40 font-bold mb-12 leading-relaxed uppercase text-[10px] tracking-[0.2em]">
            Tu futuro comienza ahora. Hemos recibido tus datos correctamente.
          </p>
          <button 
            onClick={() => window.location.href = '/registro'} 
            className="w-full py-6 bg-white text-[#09090b] rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-slate-100 transition-all active:scale-95"
          >
            Finalizar Proceso
          </button>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Decorative background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-600/10 rounded-full blur-[120px]" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:40px_40px]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-xl backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[4rem] shadow-2xl p-10 lg:p-16 relative"
      >
        <div className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-red-600/30">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tighter leading-none mb-1 text-shadow-sm">Conecta <span className="text-blue-500">Futuro</span></h2>
              <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em]">Admisiones 2026</p>
            </div>
          </div>
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-700 ${step === i ? 'w-10 bg-blue-600' : 'w-2 bg-white/10'}`} />
            ))}
          </div>
        </div>
        
        {error && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            className="mb-10 p-6 bg-red-500/10 border border-red-500/20 rounded-[2rem] text-red-500 text-xs font-bold"
          >
            <p className="uppercase tracking-widest text-[9px] mb-2 opacity-50">Error del Sistema:</p>
            <p className="leading-tight">{error}</p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white/40" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white mb-1 tracking-tight">¿Tu nombre?</h3>
                  <p className="text-white/30 font-black text-[10px] uppercase tracking-widest">Identificación Personal</p>
                </div>
              </div>
              <input 
                autoFocus
                type="text" 
                value={formData.fullName}
                onKeyDown={handleKeyDown}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Ej. Julio Pineda"
                className="w-full p-8 bg-white/5 border border-white/10 rounded-[2rem] text-2xl font-black text-white focus:bg-white/10 focus:border-blue-600/50 outline-none transition-all placeholder:text-white/10 shadow-inner"
              />
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                  <School className="w-5 h-5 text-white/40" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white mb-1 tracking-tight">Tu Academia</h3>
                  <p className="text-white/30 font-black text-[10px] uppercase tracking-widest">Procedencia y Metas</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <select 
                  autoFocus
                  value={formData.schoolId}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
                  className="w-full p-7 bg-white/5 border border-white/10 rounded-[2rem] font-bold text-white outline-none focus:bg-white/10 focus:border-blue-600/50 transition-all appearance-none cursor-pointer shadow-inner"
                >
                  <option value="" className="bg-[#09090b]">Centro Educativo</option>
                  {Array.isArray(schools) && schools.map(s => <option key={s.id} value={s.id} className="bg-[#09090b]">{s.name}</option>)}
                  <option value="otro" className="bg-[#09090b]">+ Registrar nueva institución</option>
                </select>

                {formData.schoolId === 'otro' && (
                  <motion.input 
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    type="text" value={formData.newSchoolName} 
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setFormData({ ...formData, newSchoolName: e.target.value })}
                    placeholder="Nombre del Centro" className="w-full p-7 bg-red-600/10 border border-red-600/20 rounded-[2rem] font-bold text-white placeholder:text-red-600/40 outline-none"
                  />
                )}

                <select 
                  value={formData.careerId}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setFormData({ ...formData, careerId: e.target.value })}
                  className="w-full p-7 bg-white/5 border border-white/10 rounded-[2rem] font-bold text-white outline-none focus:bg-white/10 focus:border-blue-600/50 transition-all appearance-none cursor-pointer shadow-inner"
                >
                  <option value="" className="bg-[#09090b]">Carrera de Interés</option>
                  {Array.isArray(careers) && careers.map(c => <option key={c.id} value={c.id} className="bg-[#09090b]">{c.name}</option>)}
                  <option value="otro" className="bg-[#09090b]">+ Registrar nueva carrera</option>
                </select>

                {formData.careerId === 'otro' && (
                  <motion.input 
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    type="text" value={formData.newCareerName} 
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setFormData({ ...formData, newCareerName: e.target.value })}
                    placeholder="Nombre de la Carrera" className="w-full p-7 bg-red-600/10 border border-red-600/20 rounded-[2rem] font-bold text-white placeholder:text-red-600/40 outline-none"
                  />
                )}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white/40" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white mb-1 tracking-tight">Tus Metas</h3>
                  <p className="text-white/30 font-black text-[10px] uppercase tracking-widest">¿Por qué esta elección?</p>
                </div>
              </div>
              <textarea 
                autoFocus
                value={formData.motivation}
                onKeyDown={handleKeyDown}
                onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                rows={4}
                className="w-full p-8 bg-white/5 border border-white/10 rounded-[2.5rem] text-xl font-bold text-white focus:bg-white/10 focus:border-blue-600/50 transition-all placeholder:text-white/10 resize-none shadow-inner"
                placeholder="Cuéntanos tus sueños..."
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-5 mt-16">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="p-8 bg-white/5 text-white/40 rounded-[2.5rem] hover:bg-white/10 transition-all active:scale-90 border border-white/5">
              <ArrowLeft className="w-7 h-7" />
            </button>
          )}
          <button 
            disabled={submitting || (step === 0 && !formData.fullName) || (step === 1 && (!formData.schoolId || !formData.careerId))}
            onClick={nextStep}
            className="flex-1 p-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-[2.5rem] font-black text-lg shadow-2xl shadow-blue-600/40 flex items-center justify-center gap-4 transition-all active:scale-[0.98] disabled:opacity-30"
          >
            {submitting ? <Loader2 className="w-7 h-7 animate-spin" /> : (
              <>
                <span>{step === 2 ? 'Finalizar Registro' : 'Siguiente'}</span>
                <ChevronRight className="w-7 h-7" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </main>
  )
}
