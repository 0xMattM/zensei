'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { MessageCircle, PieChart, BarChart3, Settings, Receipt, Zap, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WalletButton } from './WalletButton'
import { cn } from '@/lib/utils'

export function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    {
      name: 'Chat',
      href: '/chat',
      icon: MessageCircle,
      active: pathname === '/chat',
    },
    {
      name: 'Portfolio',
      href: '/portfolio',
      icon: PieChart,
      active: pathname === '/portfolio',
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      active: pathname === '/analytics',
    },
    {
      name: 'Transactions',
      href: '/transactions',
      icon: Receipt,
      active: pathname === '/transactions',
    },
    {
      name: 'Automations',
      href: '/automations',
      icon: Zap,
      active: pathname === '/automations',
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      active: pathname === '/settings',
    },
  ]

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <nav className="border-b border-border/50 glass-card sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center transition-all duration-300 hover:scale-105">
              <div className="relative h-8">
                <Image
                  src="/logo.png"
                  alt="ZenSei - Your Personal AI DeFi Agent"
                  width={160}
                  height={32}
                  className="h-8 w-auto"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={item.active ? 'zen' : 'ghost'}
                    size="sm"
                    className={cn(
                      'flex items-center space-x-2 transition-all duration-300 hover:scale-105 font-medium',
                      item.active 
                        ? 'zen-glow shadow-lg' 
                        : 'hover:bg-white/5 hover:backdrop-blur-sm'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Right side - Wallet + Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Wallet Button */}
            <div className="hidden sm:block">
              <WalletButton />
            </div>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden animate-in slide-in-from-top-4 duration-300">
            <div className="mx-4 mt-2 mb-4 glass-card border border-border/50 rounded-xl bg-background/95 backdrop-blur-xl shadow-xl">
              <div className="p-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link key={item.name} href={item.href} onClick={closeMobileMenu}>
                      <Button
                        variant={item.active ? 'zen' : 'ghost'}
                        size="sm"
                        className={cn(
                          'w-full flex items-center justify-start space-x-3 transition-all duration-300 font-medium rounded-lg',
                          item.active 
                            ? 'zen-glow shadow-lg' 
                            : 'hover:bg-white/10 hover:backdrop-blur-sm'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Button>
                    </Link>
                  )
                })}
                
                {/* Mobile Wallet Button */}
                <div className="sm:hidden pt-3 mt-3 border-t border-border/30">
                  <WalletButton />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 