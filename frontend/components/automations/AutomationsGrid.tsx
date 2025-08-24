
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Bell, 
  FileText, 
  RefreshCw, 
  Zap,
  Mail,
  Star,
  Target,
  Lightbulb
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AutomationFeature {
  id: string
  name: string
  description: string
  icon: React.ElementType
  category: 'trading' | 'portfolio' | 'notifications' | 'analytics'
  popularity: 'high' | 'medium' | 'low'
}

const automations: AutomationFeature[] = [
  {
    id: 'dca',
    name: 'Dollar Cost Averaging (DCA)',
    description: 'Automatically invest a fixed amount in SEI or other tokens at regular intervals to reduce volatility impact',
    icon: Calendar,
    category: 'trading',
    popularity: 'high'
  },
  {
    id: 'notifications',
    name: 'Smart Notifications',
    description: 'Get instant alerts for price movements, portfolio changes, and market opportunities',
    icon: Bell,
    category: 'notifications',
    popularity: 'high'
  },
  {
    id: 'reports',
    name: 'Portfolio Reports',
    description: 'Automated daily, weekly, or monthly portfolio performance reports sent to your email',
    icon: FileText,
    category: 'analytics',
    popularity: 'medium'
  },
  {
    id: 'rebalancing',
    name: 'Portfolio Rebalancing',
    description: 'Automatically rebalance your portfolio to maintain target allocations and optimize returns',
    icon: RefreshCw,
    category: 'portfolio',
    popularity: 'high'
  },
  {
    id: 'limit-orders',
    name: 'Limit Orders',
    description: 'Set buy/sell orders that execute automatically when tokens reach your target prices',
    icon: Target,
    category: 'trading',
    popularity: 'high'
  },
  {
    id: 'autocompounding',
    name: 'Auto-Compounding',
    description: 'Automatically reinvest staking rewards and yield farming profits to maximize returns',
    icon: Zap,
    category: 'portfolio',
    popularity: 'medium'
  }
]

const categoryColors = {
  trading: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  portfolio: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  notifications: 'bg-green-500/10 text-green-400 border-green-500/20',
  analytics: 'bg-orange-500/10 text-orange-400 border-orange-500/20'
}

// popularity colors removed in favor of uniform badge styling

export function AutomationsGrid() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [idea, setIdea] = useState('')
  const [ideaSent, setIdeaSent] = useState(false)
  const [showSuggestion, setShowSuggestion] = useState(false)
  const [highlightSubscribe, setHighlightSubscribe] = useState(false)

  const handleSubscribe = () => {
    if (email.trim()) {
      // In a real app, send email to backend
      console.log('Subscribing email:', email)
      setSubscribed(true)
    }
  }

  const handleIdeaSubmit = () => {
    if (idea.trim()) {
      // In a real app, send idea to backend
      console.log('Automation idea:', idea)
      setIdeaSent(true)
    }
  }

  // Smooth scroll + glow when navigating to #subscribe-bar
  useEffect(() => {
    function handleHash() {
      if (window.location.hash === '#subscribe-bar') {
        const el = document.getElementById('subscribe-bar')
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          setHighlightSubscribe(true)
          setTimeout(() => setHighlightSubscribe(false), 1400)
        }
      }
    }
    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  return (
    <div className="space-y-8">
      {/* Subscribe Section */}
      <Card id="subscribe-bar" className={`glass-card border-border/50 ${highlightSubscribe ? 'ring-2 ring-zen-purple/40 transition-shadow' : ''}`}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 flex-col md:flex-row">
              <div className="flex items-center gap-2 text-foreground/90">
              <Mail className="h-5 w-5 text-zen-cyan" />
                <h3 className="text-base font-display font-semibold">Get early access to automations</h3>
            </div>
            {!subscribed ? (
                <div className="flex items-center gap-2 w-full md:w-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    className="flex-1 md:w-72"
                />
                <Button 
                  onClick={handleSubscribe}
                  disabled={!email.trim()}
                  variant="zen"
                >
                  Subscribe
                </Button>
              </div>
            ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-md">
                  <Star className="h-4 w-4 text-green-400" />
                  <span className="text-green-400">Thanks! We&apos;ll notify you.</span>
              </div>
            )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Automations Grid */}
      <div className="relative">
        {/* subtle gradient edges */}
        <div className="hidden lg:block pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-slate-950/60 via-slate-950/20 to-transparent rounded-l-xl opacity-0 transition-opacity duration-300" />
        <div className="hidden lg:block pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-slate-950/60 via-slate-950/20 to-transparent rounded-r-xl opacity-0 transition-opacity duration-300" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {automations.map((automation) => {
          const Icon = automation.icon
          return (
            <Card 
              key={automation.id}
              className="glass-card border-border/50 transition-all duration-300 group flex flex-col h-full min-h-[256px] hover:-translate-y-1 hover:shadow-lg hover:shadow-zen-purple/15 hover:border-zen-purple/30"
            >
              <CardHeader className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className={cn('p-3 rounded-xl border backdrop-blur-sm transition-transform duration-300 group-hover:scale-105', categoryColors[automation.category])}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-xl font-display font-semibold text-foreground group-hover:text-zen-purple transition-colors">
                    {automation.name}
                  </CardTitle>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4 flex-1">
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {automation.description}
                </p>
                
              </CardContent>
              <CardFooter className="pt-0">
                <div className="w-full border-t border-border/40 pt-3">
                  <Badge className="text-xs bg-white/5 text-slate-300 border border-white/10 rounded-full">
                    {automation.popularity === 'high' ? 'Most Requested' : 
                     automation.popularity === 'medium' ? 'Popular' : 'Planned'}
                  </Badge>
                  </div>
              </CardFooter>
            </Card>
          )
        })}
        </div>
      </div>

      {/* Suggest an automation - compact toggle */}
      <Card className="glass-card border-border/50">
        <CardContent className="p-6">
          <div className="max-w-5xl mx-auto space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-foreground/90">
                <Lightbulb className="h-5 w-5 text-zen-purple" />
                <h3 className="text-base font-display font-semibold">Have an automation in mind?</h3>
                <span className="hidden md:inline text-sm text-muted-foreground">Tell us and help us prioritize.</span>
              </div>
              {!ideaSent ? (
                <Button size="sm" variant="zen" onClick={() => setShowSuggestion((v) => !v)}>
                  {showSuggestion ? 'Hide form' : 'Suggest'}
                </Button>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zen-purple/10 border border-zen-purple/20 rounded-md text-sm">
                  <Star className="h-4 w-4 text-zen-purple" />
                  <span>Thanks! We&apos;ll review your suggestion.</span>
              </div>
              )}
              </div>

            {showSuggestion && !ideaSent && (
              <div className="space-y-2">
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="Describe your automation idea..."
                  className="w-full min-h-[90px] rounded-lg border border-border/50 bg-background/60 p-3 text-sm outline-none focus:ring-2 focus:ring-zen-purple/40"
                />
                <div className="flex justify-end">
                  <Button onClick={handleIdeaSubmit} disabled={!idea.trim()} variant="zen">
                    Send suggestion
                  </Button>
              </div>
            </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 