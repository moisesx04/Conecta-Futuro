// lib/demo-store.ts
// Este archivo sirve como base de datos temporal solo para pruebas locales

export interface DemoRegistration {
  id: number;
  full_name: string;
  school_name: string;
  career_name: string;
  motivation: string;
  created_at: string;
}

// Usamos global para que persista entre recargas de Next.js en desarrollo
const globalForDemo = global as unknown as { demoRegistrations: DemoRegistration[] };

export const demoRegistrations = globalForDemo.demoRegistrations || [
  { id: 101, full_name: 'Estudiante de Prueba 1', school_name: 'UASD', career_name: 'Ingeniería en Sistemas', motivation: 'Demo inicial', created_at: new Date().toISOString() },
  { id: 102, full_name: 'Estudiante de Prueba 2', school_name: 'PUCMM', career_name: 'Medicina', motivation: 'Prueba de sistema', created_at: new Date().toISOString() }
];

if (process.env.NODE_ENV !== 'production') globalForDemo.demoRegistrations = demoRegistrations;
