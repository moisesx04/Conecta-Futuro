// app/registro/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Loader2, GraduationCap, ChevronRight, ArrowLeft, Sparkles, School, BookOpen } from 'lucide-react'

export default function RegistroPage() {
  const [step, setStep] = useState(0)
  const [schools, setSchools] = useState<any[]>([])
  const [careers, setCareers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

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
          fetch('/api/schools'),
          fetch('/api/careers'),
        ])
        if (sr.ok) setSchools(await sr.json())
        if (cr.ok) setCareers(await cr.json())
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSubmit = async () => {
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
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">¡Registro Exitoso!</h1>
          <p className="text-slate-500 font-medium mb-10 leading-relaxed">
            Tus datos han sido guardados correctamente. Estamos emocionados por tenerte con nosotros en Conecta Futuro.
          </p>
          <button onClick={() => window.location.reload()} className="w-full py-5 bg-slate-900 text-white rounded-3xl font-bold transition-all hover:bg-slate-800">
            Finalizar
          </button>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-[50px] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.08)] p-12 relative border border-white"
      >
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Conecta Futuro</h2>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Estudiante</p>
            </div>
          </div>
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step === i ? 'w-10 bg-blue-600' : 'w-1.5 bg-slate-100'}`} />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <h3 className="text-3xl font-bold text-slate-900 mb-2">¡Hola! Cuéntanos quién eres</h3>
                <p className="text-slate-400 font-medium">Ingresa tu nombre completo para comenzar.</p>
              </div>
              <div className="space-y-4">
                <input 
                  type="text" 
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ej. Juan Pérez"
                  className="w-full p-6 bg-slate-50 border-none rounded-3xl text-xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-600/10 outline-none transition-all placeholder:text-slate-300"
                />
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <h3 className="text-3xl font-bold text-slate-900 mb-2">Información Académica</h3>
                <p className="text-slate-400 font-medium">¿Dónde estudias y qué te interesa?</p>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-2 tracking-widest">Institución</label>
                  <select 
                    value={formData.schoolId}
                    onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
                    className="w-full p-5 bg-slate-50 rounded-3xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-600/10 border-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Selecciona tu escuela</option>
                    {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    <option value="otro">+ Otra Institución</option>
                  </select>
                </div>

                {formData.schoolId === 'otro' && (
                  <motion.input 
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    type="text" value={formData.newSchoolName} onChange={(e) => setFormData({ ...formData, newSchoolName: e.target.value })}
                    placeholder="Nombre de la Institución" className="w-full p-5 bg-blue-50/50 rounded-3xl font-bold text-blue-700 placeholder:text-blue-300 outline-none border-none"
                  />
                )}

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-2 tracking-widest">Carrera de Interés</label>
                  <select 
                    value={formData.careerId}
                    onChange={(e) => setFormData({ ...formData, careerId: e.target.value })}
                    className="w-full p-5 bg-slate-50 rounded-3xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-600/10 border-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Selecciona una carrera</option>
                    {careers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    <option value="otro">+ Otra Carrera</option>
                  </select>
                </div>

                {formData.careerId === 'otro' && (
                  <motion.input 
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    type="text" value={formData.newCareerName} onChange={(e) => setFormData({ ...formData, newCareerName: e.target.value })}
                    placeholder="Nombre de la Carrera" className="w-full p-5 bg-blue-50/50 rounded-3xl font-bold text-blue-700 placeholder:text-blue-300 outline-none border-none"
                  />
                )}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <h3 className="text-3xl font-bold text-slate-900 mb-2">Tu Motivación</h3>
                <p className="text-slate-400 font-medium">¿Qué te inspira a seguir esta carrera?</p>
              </div>
              <textarea 
                value={formData.motivation}
                onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                rows={6}
                className="w-full p-6 bg-slate-50 border-none rounded-3xl text-lg font-medium text-slate-700 focus:ring-2 focus:ring-blue-600/10 outline-none transition-all placeholder:text-slate-300 resize-none"
                placeholder="Escribe aquí tus metas y sueños..."
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-4 mt-12">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="p-6 bg-slate-50 text-slate-400 rounded-3xl hover:bg-slate-100 transition-all active:scale-90">
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <button 
            disabled={submitting || (step === 0 && !formData.fullName) || (step === 1 && (!formData.schoolId || !formData.careerId))}
            onClick={step === 2 ? handleSubmit : () => setStep(step + 1)}
            className="flex-1 p-6 bg-blue-600 text-white rounded-3xl font-bold shadow-xl shadow-blue-100 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <>
                <span className="text-lg">{step === 2 ? 'Enviar Registro' : 'Siguiente Paso'}</span>
                {step < 2 && <ChevronRight className="w-6 h-6" />}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </main>
  )
}
