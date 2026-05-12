'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Loader2, GraduationCap, ChevronRight, ArrowLeft, School, BookOpen, Sparkles } from 'lucide-react'

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Cargando Sistema...</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center p-6 text-center font-sans">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md">
          <div className="w-24 h-24 bg-blue-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-100 relative">
            <CheckCircle2 className="w-12 h-12 text-blue-600" />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">¡Registro <span className="text-blue-600">Completo!</span></h1>
          <p className="text-slate-500 font-bold mb-10 leading-relaxed uppercase text-xs tracking-widest">
            Tu solicitud ha sido enviada con éxito.
          </p>
          <button onClick={() => window.location.href = '/registro'} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[24px] font-black shadow-2xl shadow-blue-600/20 transition-all active:scale-95">
            Finalizar
          </button>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-[48px] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.06)] p-10 lg:p-14 relative border border-white"
      >
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-red-600/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">Conecta <span className="text-blue-600">Futuro</span></h2>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Admisiones 2026</p>
            </div>
          </div>
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step === i ? 'w-8 bg-blue-600' : 'w-2 bg-slate-100'}`} />
            ))}
          </div>
        </div>
        
        {error && (
          <div className="mb-8 p-6 bg-red-50 border-2 border-red-100 rounded-[32px] text-red-600 text-sm font-bold shadow-xl shadow-red-600/5">
            <p className="uppercase tracking-widest text-[10px] mb-2 opacity-60">Mensaje del Sistema:</p>
            <p className="leading-tight">{error}</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
              <div>
                <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">¿Cuál es tu nombre?</h3>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Información Personal</p>
              </div>
              <input 
                autoFocus
                type="text" 
                value={formData.fullName}
                onKeyDown={handleKeyDown}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Ej. Julio Pineda"
                className="w-full p-6 bg-slate-50 border-2 border-slate-50 rounded-[28px] text-xl font-bold text-slate-900 focus:bg-white focus:border-blue-600/20 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all placeholder:text-slate-300 shadow-inner"
              />
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Tu Institución</h3>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Información Académica</p>
              </div>
              
              <div className="space-y-6">
                <select 
                  autoFocus
                  value={formData.schoolId}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
                  className="w-full p-6 bg-slate-50 border-2 border-slate-50 rounded-[24px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-600/20 transition-all appearance-none cursor-pointer shadow-inner"
                >
                  <option value="">Selecciona tu Centro Educativo</option>
                  {Array.isArray(schools) && schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  <option value="otro">+ Otra Institución</option>
                </select>

                {formData.schoolId === 'otro' && (
                  <motion.input 
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    type="text" value={formData.newSchoolName} 
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setFormData({ ...formData, newSchoolName: e.target.value })}
                    placeholder="Escribe el nombre aquí" className="w-full p-6 bg-red-50 border-2 border-red-50 rounded-[24px] font-bold text-red-700 placeholder:text-red-300 outline-none"
                  />
                )}

                <select 
                  value={formData.careerId}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setFormData({ ...formData, careerId: e.target.value })}
                  className="w-full p-6 bg-slate-50 border-2 border-slate-50 rounded-[24px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-600/20 transition-all appearance-none cursor-pointer shadow-inner"
                >
                  <option value="">Carrera de Interés</option>
                  {Array.isArray(careers) && careers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  <option value="otro">+ Otra Carrera</option>
                </select>

                {formData.careerId === 'otro' && (
                  <motion.input 
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    type="text" value={formData.newCareerName} 
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setFormData({ ...formData, newCareerName: e.target.value })}
                    placeholder="Nombre de la Carrera" className="w-full p-6 bg-red-50 border-2 border-red-50 rounded-[24px] font-bold text-red-700 placeholder:text-red-300 outline-none"
                  />
                )}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Motivo de la elección de carrera</h3>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Último paso</p>
              </div>
              <textarea 
                autoFocus
                value={formData.motivation}
                onKeyDown={handleKeyDown}
                onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                rows={4}
                className="w-full p-6 bg-slate-50 border-2 border-slate-50 rounded-[28px] text-lg font-bold text-slate-900 focus:bg-white focus:border-blue-600/20 transition-all placeholder:text-slate-300 resize-none shadow-inner"
                placeholder="Cuéntanos tus metas..."
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-4 mt-12">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="p-6 bg-slate-50 text-slate-400 rounded-[24px] hover:bg-slate-100 transition-all active:scale-90">
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <button 
            disabled={submitting || (step === 0 && !formData.fullName) || (step === 1 && (!formData.schoolId || !formData.careerId))}
            onClick={nextStep}
            className="flex-1 p-6 bg-blue-600 hover:bg-blue-700 text-white rounded-[28px] font-black shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <>
                <span className="text-lg">{step === 2 ? 'Enviar Registro' : 'Siguiente'}</span>
                <ChevronRight className="w-6 h-6" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </main>
  )
}
