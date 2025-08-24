import type { Metadata } from 'next'
import { Inter, Varela_Round } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const varelaRound = Varela_Round({
  subsets: ['latin'],
  variable: '--font-varela',
  weight: '400',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ZenSei - Your Personal AI DeFi Agent',
  description: 'Simple and elegant interface for AI-powered DeFi operations on Sei',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${varelaRound.variable} font-sans dark`}>
      <body className="min-h-screen font-sans antialiased bg-background text-foreground">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 