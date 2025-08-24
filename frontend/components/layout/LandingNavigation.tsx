'use client'

import { Button } from '@/components/ui/button'
import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export function LandingNavigation() {
  const { ready } = usePrivy()
  const router = useRouter()

  const handleLaunchApp = () => {
    router.push('/chat')
  }

  return (
    <nav className="glass-card border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button onClick={() => router.push('/')} className="transition-all duration-300 hover:scale-105">
              <Image
                src="/logo.png"
                alt="ZenSei - Your Personal AI DeFi Agent"
                width={160}
                height={32}
                className="h-8 w-auto"
                priority
              />
            </button>
          </div>

          {/* Documentation Link and Launch App Button */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => window.open('https://zensei.gitbook.io/zensei-docs/', '_blank')}
              className="text-white/80 hover:text-white transition-colors duration-300 cursor-pointer font-medium hover:underline text-xs"
            >
              Docs
            </button>
            {!ready ? (
              <div className="h-10 w-24 bg-slate-700/50 rounded-lg animate-pulse" />
            ) : (
              <Button
                onClick={handleLaunchApp}
                variant="zen"
                className="zen-glow transition-all duration-300 hover:scale-105"
              >
                Launch App
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 