// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Conecta Futuro',
  description: 'Plataforma de registro estudiantil de alto impacto.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%232563eb%22/><path d=%22M20 45 L50 30 L80 45 L50 60 Z%22 fill=%22white%22/><path d=%22M35 52 L35 65 Q50 75 65 65 L65 52%22 fill=%22none%22 stroke=%22white%22 stroke-width=%225%22/></svg>',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
