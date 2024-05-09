import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Videoteca México'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.className}>
      <body style={{ overflowX: 'hidden' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
