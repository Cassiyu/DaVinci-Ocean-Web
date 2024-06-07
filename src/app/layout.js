import { Toaster } from 'react-hot-toast'
import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'DaVinci Ocean',
  description: 'Sistema de Monitoramento e Conservação dos Habitats Marinhos',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster position='bottom-right' />
        </AuthProvider>
      </body>
    </html>
  )
}