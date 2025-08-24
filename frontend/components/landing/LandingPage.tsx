'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { 
  BarChart3, 
  ArrowRight,
  Sparkles,
  Bot,
  Layers,
  Rocket,
  Search,
  Globe,
  PieChart,
  Wallet,
  Mail,
  CheckCircle,
  Github,
  FileText,
  BookOpen
} from 'lucide-react'
import Image from 'next/image'

interface TooltipState {
  show: boolean
  content: string
  x: number
  y: number
  color: 'purple' | 'cyan'
}

export function LandingPage() {
  const { authenticated } = usePrivy()
  const router = useRouter()
  
  // Waitlist form state
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [emailError, setEmailError] = useState('')

  // Tooltip state
  const [tooltip, setTooltip] = useState<TooltipState>({
    show: false,
    content: '',
    x: 0,
    y: 0,
    color: 'purple'
  })

  const handleMouseEnter = (event: React.MouseEvent, content: string, color: 'purple' | 'cyan') => {
    const rect = event.currentTarget.getBoundingClientRect()
    setTooltip({
      show: true,
      content,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      color
    })
  }

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, show: false }))
  }

  const handleLaunchApp = () => {
    router.push('/chat')
  }

  const handleJoinWaitlist = () => {
    const waitlistSection = document.getElementById('waitlist-section')
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError('')

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError('Email is required')
      return
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    try {
      // TODO: Implement actual waitlist API call
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsSubmitted(true)
      setEmail('')
    } catch (error) {
      setEmailError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const features = [
    {
      icon: Bot,
      title: 'Coordinated Multi-Agent System',
      description: 'Zen Master orchestrates 8 specialized agents with voice support and contextual Graph RAG (Retrieval-Augmented Generation) memory powered by Zep.'
    },
    {
      icon: Layers,
      title: 'All Core Sei DeFi Protocols Supported',
      description: 'Trade, invest, and earn yield across Sei DeFi protocols in a single interface (powered by Cambrian). Seamless execution of your DeFi strategies.'
    },
    {
      icon: Rocket,
      title: 'Smart Contract Deployment',
      description: 'Deploy tokens, NFTs, and custom contracts on Sei. Simple deployment with no code required for fast and reliable launches.'
    },
    {
      icon: Search,
      title: 'Deep Research',
      description: 'Get up-to-date information and news from the web using Perplexity AI. Delivers summaries and relevant insights tailored to your queries.'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Multi-source data analytics. Fetch information from DefiLlama, CoinGecko, GeckoTerminal, and Dexscreener in a single step.'
    },
    {
      icon: Globe,
      title: 'Blockchain Explorer',
      description: 'Explore the Sei blockchain. Access transactions, accounts, smart contracts, and block details with ease (powered by Sei MCP).'
    },
    {
      icon: PieChart,
      title: 'Portfolio Management',
      description: 'Full portfolio management and performance capabilities. Track token holdings and DeFi positions across the Sei ecosystem.'
    },
    {
      icon: BookOpen,
      title: 'Comprehensive Knowledge Base',
      description: 'Retrieval-Augmented Generation (RAG) using Qdrant vector database with everything you need to know about the Sei ecosystem and its technical details.'
    },
    {
      icon: Wallet,
      title: 'Smart Wallet Management',
      description: 'Securely transfer assets to registered contracts using natural language commands, such as: "Transfer 10 SEI to Vitalik" (powered by Eliza).'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Global Tooltip */}
      {tooltip.show && (
        <div 
          className={`fixed text-white px-4 py-3 rounded-xl text-sm font-medium backdrop-blur-sm border whitespace-nowrap shadow-2xl pointer-events-none transition-all duration-300 transform scale-100 ${
            tooltip.color === 'purple' 
              ? 'bg-gradient-to-br from-purple-900/95 via-purple-800/95 to-slate-900/95 border-purple-400/40 shadow-purple-500/20' 
              : 'bg-gradient-to-br from-cyan-900/95 via-cyan-800/95 to-slate-900/95 border-cyan-400/40 shadow-cyan-500/20'
          }`}
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translateX(-50%) translateY(-100%) scale(1)',
            zIndex: 999999,
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))'
          }}
        >
          {/* Glow effect behind tooltip */}
          <div 
            className={`absolute inset-0 rounded-xl blur-md opacity-50 ${
              tooltip.color === 'purple' 
                ? 'bg-gradient-to-br from-purple-500/30 to-purple-600/30' 
                : 'bg-gradient-to-br from-cyan-500/30 to-cyan-600/30'
            }`} 
            style={{ transform: 'scale(1.1)' }}
          />
          
          {/* Tooltip content */}
          <div className="relative z-10 flex items-center space-x-2">
            {/* Icon indicator */}
            <div 
              className={`w-2 h-2 rounded-full animate-pulse ${
                tooltip.color === 'purple' ? 'bg-purple-400' : 'bg-cyan-400'
              }`} 
            />
            <span className="font-semibold tracking-wide">{tooltip.content}</span>
          </div>
          
          {/* Enhanced arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            {/* Main arrow */}
            <div 
              className={`w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent ${
                tooltip.color === 'purple' ? 'border-t-purple-800/95' : 'border-t-cyan-800/95'
              }`}
            />
            {/* Arrow glow */}
            <div 
              className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-px w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
                tooltip.color === 'purple' ? 'border-t-purple-400/60' : 'border-t-cyan-400/60'
              }`}
            />
          </div>
          
          {/* Corner decorations */}
          <div 
            className={`absolute top-1 left-1 w-3 h-3 border-l border-t rounded-tl-lg opacity-30 ${
              tooltip.color === 'purple' ? 'border-purple-300' : 'border-cyan-300'
            }`} 
          />
          <div 
            className={`absolute top-1 right-1 w-3 h-3 border-r border-t rounded-tr-lg opacity-30 ${
              tooltip.color === 'purple' ? 'border-purple-300' : 'border-cyan-300'
            }`} 
          />
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden h-[90vh] sm:h-[85vh] md:h-[90vh]">
        {/* Hero Background Video */}
        <div className="absolute inset-0 -z-20">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center"
            poster="/hero-static.png"
          >
            <source src="/hero.mp4" type="video/mp4" />
            {/* Fallback to image if video fails to load */}
            <img
              src="/hero-static.png"
              alt="ZenSei Hero Background"
              className="w-full h-full object-cover object-center"
            />
          </video>
          {/* Gradient Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-slate-950/40" />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6 sm:py-16 md:py-20 relative z-10 flex items-center justify-center h-full">
          <div className="text-center space-y-4 sm:space-y-8 w-full mt-4 sm:mt-0">
            {/* Hero Text */}
                          <div className="space-y-3 sm:space-y-6 max-w-4xl mx-auto px-4 sm:px-0">
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight drop-shadow-2xl" style={{textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 8px 16px rgba(0,0,0,0.4)'}}>
                Sei DeFAI Agent Swarm
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl max-w-3xl mx-auto leading-relaxed text-white/90 drop-shadow-lg" style={{textShadow: '0 2px 4px rgba(0,0,0,0.6)'}}>
                Navigate the Sei ecosystem with your personal Multi-Agent System.
              </p>
            </div>

            {/* CTA Buttons - Responsive design */}
            <div className="pt-8">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
                  <Button
                    onClick={handleJoinWaitlist}
                    size="lg"
                    className="bg-gradient-to-r from-[#7C3AED] via-[#06B6D4] to-[#059669] hover:from-[#8B5CF6] hover:via-[#38BDF8] hover:to-[#34D399] text-white border-2 border-slate-600/70 hover:border-slate-500/80 transition-all duration-300 hover:scale-105 text-lg px-8 py-6 rounded-xl font-semibold shadow-2xl w-full sm:w-auto"
                  >
                    Join Waitlist
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleLaunchApp}
                    className="relative overflow-hidden text-lg px-8 py-6 rounded-xl font-semibold w-full sm:w-auto text-white bg-slate-800 border border-purple-400/30 hover:bg-slate-700 hover:border-purple-300/50 transition-all duration-300 hover:-translate-y-0.5 shadow-xl hover:shadow-purple-500/20 focus-visible:ring-2 focus-visible:ring-zen-purple before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/10 before:to-white/0 before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-700"
                  >
                    Launch App
                  </Button>
                </div>
            </div>
          </div>
        </div>

        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-500" />
        </div>
      </section>

      {/* Architecture Section */}
      <section className="relative py-6 bg-gradient-to-b from-slate-950/95 via-slate-950/98 to-slate-900/95 backdrop-blur-sm overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-emerald-500/8 rounded-full blur-3xl animate-pulse delay-500" />
          
          {/* Floating Elements */}
          <div className="absolute top-20 right-1/4 w-2 h-2 bg-purple-400/50 rounded-full animate-bounce delay-300" />
          <div className="absolute bottom-32 left-1/3 w-3 h-3 bg-cyan-400/50 rounded-full animate-bounce delay-700" />
          <div className="absolute top-1/3 right-1/6 w-1 h-1 bg-emerald-400/50 rounded-full animate-ping delay-1000" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
                     <div className="text-center space-y-4 mb-6">
            {/* Enhanced Title with Gradient and Animation */}
            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent leading-tight">
                Meet the Zen Master
              </h2>
              
              <h3 className="text-xl md:text-2xl font-display font-semibold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                and our 8 Specialized Agents
              </h3>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-6">
            {/* Enhanced Video Container with Multiple Visual Effects */}
            <div className="relative max-w-3xl w-full group">
              {/* Glow Effect Behind Video */}
              <div className="absolute -inset-3 bg-gradient-to-r from-purple-600/20 via-cyan-500/20 to-emerald-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-700 opacity-75 group-hover:opacity-100" />
              
              {/* Main Video Container */}
              <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-2 backdrop-blur-sm border border-white/10 group-hover:border-purple-500/30 transition-all duration-500 transform group-hover:scale-[1.02] duration-700">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto rounded-xl shadow-xl"
                  poster="/zensei-arquitecture.png"
                >
                  <source src="/zensei-arquitecture.mp4" type="video/mp4" />
                  {/* Fallback to image if video fails to load */}
                  <img
                    src="/zensei-arquitecture.png"
                    alt="ZenSei Multi-Agent Architecture"
                    className="w-full h-auto rounded-xl shadow-xl"
                  />
                </video>
                
                {/* Corner Decorations - Now they scale with the container */}
                <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-purple-400/50 rounded-tl-lg transition-all duration-700" />
                <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-cyan-400/50 rounded-tr-lg transition-all duration-700" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-emerald-400/50 rounded-bl-lg transition-all duration-700" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-purple-400/50 rounded-br-lg transition-all duration-700" />
              </div>
            </div>
            
            {/* Enhanced Learn More Button */}
            <div className="flex justify-center w-full">
              <button
                onClick={() => window.open('https://zensei.gitbook.io/zensei-docs/architecture', '_blank')}
                className="group relative inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600/80 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 backdrop-blur-sm border border-white/10 hover:border-purple-400/50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                <FileText className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                <span>Explore Architecture</span>
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gradient-to-b from-slate-900/95 via-slate-900/98 to-slate-950/95 backdrop-blur-sm">
                  <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-4 mb-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Everything You Need for Sei DeFi
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                All in a single AI-powered App just using natural language.
              </p>
            </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card 
                  key={feature.title}
                  className="bg-slate-800/50 border-slate-700/50 hover:border-purple-500/50 hover:bg-slate-800/80 transition-all duration-500 group backdrop-blur-sm h-full hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer transform-gpu"
                >
                  <CardContent className="p-8 h-full">
                    <div className="flex flex-col h-full space-y-4">
                      {/* Header with Icon and Title */}
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 group-hover:from-purple-500/40 group-hover:to-cyan-500/40 flex items-center justify-center group-hover:scale-125 transition-all duration-500 flex-shrink-0 group-hover:rotate-3">
                          <Icon className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-white group-hover:text-purple-200 leading-tight transition-colors duration-500">
                          {feature.title}
                        </h3>
                      </div>
                      {/* Description */}
                      <p className="text-slate-300 group-hover:text-slate-200 leading-relaxed flex-grow transition-colors duration-500">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Integrations & Protocols Section */}
      <section className="relative py-16 bg-gradient-to-b from-slate-950/98 via-slate-950/98 to-slate-950/95 backdrop-blur-sm overflow-hidden">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large background orbs */}
          <div className="absolute top-20 left-16 w-96 h-96 bg-slate-700/8 rounded-full blur-3xl animate-pulse delay-300" />
          <div className="absolute bottom-20 right-16 w-80 h-80 bg-slate-600/8 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-slate-500/6 rounded-full blur-3xl animate-pulse delay-700" />
          
          {/* Additional smaller orbs */}
          <div className="absolute top-32 right-1/3 w-48 h-48 bg-slate-500/6 rounded-full blur-2xl animate-pulse delay-1500" />
          <div className="absolute bottom-32 left-1/4 w-64 h-64 bg-slate-600/6 rounded-full blur-2xl animate-pulse delay-500" />
          <div className="absolute top-3/4 right-1/5 w-32 h-32 bg-slate-500/8 rounded-full blur-xl animate-pulse delay-2000" />
          
          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-12 gap-4 h-full w-full">
              {Array.from({ length: 48 }).map((_, i) => (
                <div
                  key={i}
                  className="border border-white/10 rounded animate-pulse"
                  style={{ animationDelay: `${(i * 100)}ms` }}
                />
              ))}
            </div>
          </div>
          
          {/* Floating geometric shapes */}
          <div className="absolute top-24 left-1/4 w-8 h-8 border-2 border-slate-500/20 rounded-lg rotate-45 animate-bounce delay-300" />
          <div className="absolute bottom-24 right-1/3 w-6 h-6 border-2 border-slate-400/20 rounded-full animate-pulse delay-700" />
          <div className="absolute top-1/3 right-1/6 w-4 h-4 bg-slate-500/20 rounded-full animate-ping delay-1000" />
          <div className="absolute bottom-1/3 left-1/5 w-10 h-10 border border-slate-400/15 rotate-12 animate-spin delay-2000" style={{ animationDuration: '20s' }} />
          
          {/* Enhanced floating dots */}
          <div className="absolute top-32 right-1/4 w-2 h-2 bg-slate-500/40 rounded-full animate-ping delay-500" />
          <div className="absolute bottom-40 left-1/3 w-3 h-3 bg-slate-400/40 rounded-full animate-bounce delay-1200" />
          <div className="absolute top-2/3 right-1/6 w-1 h-1 bg-slate-500/40 rounded-full animate-pulse delay-800" />
          <div className="absolute top-1/4 left-1/6 w-2 h-2 bg-slate-400/30 rounded-full animate-twinkle delay-1800" />
          <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-slate-400/30 rounded-full animate-twinkle delay-600" />
          
          {/* Gradient lines */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-500/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-400/20 to-transparent" />
          <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-slate-500/20 to-transparent" />
          <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-slate-500/20 to-transparent" />
          
          {/* Radial gradients */}
          <div className="absolute top-16 left-16 w-32 h-32 bg-gradient-radial from-slate-500/10 to-transparent rounded-full animate-pulse delay-400" />
          <div className="absolute bottom-16 right-16 w-40 h-40 bg-gradient-radial from-slate-400/8 to-transparent rounded-full animate-pulse delay-900" />
          
          {/* Connecting lines */}
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgb(124 58 237)" stopOpacity="0.3" />
                <stop offset="50%" stopColor="rgb(6 182 212)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="rgb(5 150 105)" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <path d="M100,200 Q400,100 700,300 T1200,250" stroke="url(#line-gradient)" strokeWidth="2" fill="none" className="animate-pulse" />
            <path d="M200,400 Q600,300 900,500 T1400,450" stroke="url(#line-gradient)" strokeWidth="1" fill="none" className="animate-pulse delay-1000" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center space-y-6 mb-14">
                        
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent leading-tight">
              Powered by the Best
            </h2>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              We have packed all the tools and protocols you need to for a complete Sei DeFi experience.
            </p>
          </div>

          <div className="space-y-8">
            {/* Integrations Carousel */}
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-300 via-purple-200 to-cyan-300 bg-clip-text text-transparent mb-2">
                  Integrations
                </h3>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full mx-auto" />
              </div>
              <div 
                className="relative overflow-hidden py-8"
                style={{
                  maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
                }}
              >
                <div className="flex animate-scroll space-x-8 w-max">
                  {/* First set of integration logos */}
                  {[
                    'cambrian.png', 'coingecko.png', 'defillama.png', 'dexscreener.png', 
                    'eliza.png', 'geckoterminal.png', 'mcp.png', 'n8n.png', 'openai.png', 
                    'perplexity.png', 'privy.png', 'qdrant.png', 'sei.png', 'zep.png'
                  ].map((logo, index) => (
                    <div
                      key={`integrations-1-${index}`}
                      className="flex-shrink-0 w-36 h-24 bg-gradient-to-br from-slate-800/60 via-slate-700/40 to-slate-800/60 backdrop-blur-sm rounded-2xl border border-purple-500/20 hover:border-purple-400/60 transition-all duration-300 hover:scale-105 hover:rotate-1 flex items-center justify-center group cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 relative overflow-hidden"
                      onMouseEnter={(e) => handleMouseEnter(e, logo.replace('.png', '').charAt(0).toUpperCase() + logo.replace('.png', '').slice(1), 'purple')}
                      onMouseLeave={handleMouseLeave}
                    >
                      {/* Enhanced glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-500/5 to-cyan-500/0 group-hover:from-purple-600/15 group-hover:via-purple-500/20 group-hover:to-cyan-500/15 transition-all duration-300 rounded-2xl" />
                      
                      {/* Subtle animated border */}
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 rounded-2xl border border-purple-400/30 animate-pulse" />
                      </div>
                      
                      {/* Corner highlights */}
                      <div className="absolute top-2 left-2 w-2 h-2 bg-purple-400/0 group-hover:bg-purple-400/40 rounded-full transition-all duration-300 delay-100" />
                      <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-400/0 group-hover:bg-cyan-400/40 rounded-full transition-all duration-300 delay-200" />
                      
                      <Image
                        src={`/integrations/${logo}`}
                        alt={`Integration ${logo.replace('.png', '')}`}
                        width={90}
                        height={90}
                        className="object-contain filter brightness-90 group-hover:brightness-125 transition-all duration-300 max-w-[80px] max-h-[60px] relative z-10 group-hover:scale-105 drop-shadow-lg group-hover:drop-shadow-xl"
                      />
                    </div>
                  ))}
                  {/* Duplicate set for seamless loop */}
                  {[
                    'cambrian.png', 'coingecko.png', 'defillama.png', 'dexscreener.png', 
                    'eliza.png', 'geckoterminal.png', 'mcp.png', 'n8n.png', 'openai.png', 
                    'perplexity.png', 'privy.png', 'qdrant.png', 'sei.png', 'zep.png'
                  ].map((logo, index) => (
                    <div
                      key={`integrations-2-${index}`}
                      className="flex-shrink-0 w-36 h-24 bg-gradient-to-br from-slate-800/60 via-slate-700/40 to-slate-800/60 backdrop-blur-sm rounded-2xl border border-purple-500/20 hover:border-purple-400/60 transition-all duration-300 hover:scale-105 hover:rotate-1 flex items-center justify-center group cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 relative overflow-hidden"
                      onMouseEnter={(e) => handleMouseEnter(e, logo.replace('.png', '').charAt(0).toUpperCase() + logo.replace('.png', '').slice(1), 'purple')}
                      onMouseLeave={handleMouseLeave}
                    >
                      {/* Enhanced glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-500/5 to-cyan-500/0 group-hover:from-purple-600/15 group-hover:via-purple-500/20 group-hover:to-cyan-500/15 transition-all duration-300 rounded-2xl" />
                      
                      {/* Subtle animated border */}
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 rounded-2xl border border-purple-400/30 animate-pulse" />
                      </div>
                      
                      {/* Corner highlights */}
                      <div className="absolute top-2 left-2 w-2 h-2 bg-purple-400/0 group-hover:bg-purple-400/40 rounded-full transition-all duration-300 delay-100" />
                      <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-400/0 group-hover:bg-cyan-400/40 rounded-full transition-all duration-300 delay-200" />
                      
                      <Image
                        src={`/integrations/${logo}`}
                        alt={`Integration ${logo.replace('.png', '')}`}
                        width={90}
                        height={90}
                        className="object-contain filter brightness-90 group-hover:brightness-125 transition-all duration-300 max-w-[80px] max-h-[60px] relative z-10 group-hover:scale-105 drop-shadow-lg group-hover:drop-shadow-xl"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Protocols Carousel */}
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 via-cyan-200 to-emerald-300 bg-clip-text text-transparent mb-2">
                  Supported Protocols
                </h3>
                <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full mx-auto" />
              </div>
              <div 
                className="relative overflow-hidden py-8"
                style={{
                  maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
                }}
              >
                <div className="flex animate-scroll-reverse space-x-8 w-max">
                  {/* First set of protocol logos */}
                  {[
                    'carbon.png', 'citrex.png', 'dragonswap.png', 'silo.png', 
                    'symphony.png', 'takara.png', 'yei.png'
                  ].map((logo, index) => (
                    <div
                      key={`protocols-1-${index}`}
                      className="flex-shrink-0 w-36 h-24 bg-gradient-to-br from-slate-800/60 via-slate-700/40 to-slate-800/60 backdrop-blur-sm rounded-2xl border border-cyan-500/20 hover:border-cyan-400/60 transition-all duration-300 hover:scale-105 hover:rotate-1 flex items-center justify-center group cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 relative overflow-hidden"
                      onMouseEnter={(e) => handleMouseEnter(e, logo.replace('.png', '').charAt(0).toUpperCase() + logo.replace('.png', '').slice(1), 'cyan')}
                      onMouseLeave={handleMouseLeave}
                    >
                      {/* Enhanced glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/0 via-cyan-500/5 to-emerald-500/0 group-hover:from-cyan-600/10 group-hover:via-cyan-500/15 group-hover:to-emerald-500/10 transition-all duration-300 rounded-2xl" />
                      
                      {/* Subtle animated border */}
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 rounded-2xl border border-cyan-400/30 animate-pulse" />
                      </div>
                      
                      {/* Corner highlights */}
                      <div className="absolute top-2 left-2 w-2 h-2 bg-cyan-400/0 group-hover:bg-cyan-400/40 rounded-full transition-all duration-300 delay-100" />
                      <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-400/0 group-hover:bg-emerald-400/40 rounded-full transition-all duration-300 delay-200" />
                      
                      <Image
                        src={`/protocols/${logo}`}
                        alt={`Protocol ${logo.replace('.png', '')}`}
                        width={90}
                        height={90}
                        className="object-contain filter brightness-90 group-hover:brightness-125 transition-all duration-300 max-w-[80px] max-h-[60px] relative z-10 group-hover:scale-105 drop-shadow-lg group-hover:drop-shadow-xl"
                      />
                    </div>
                  ))}
                  {/* Duplicate set for seamless loop */}
                  {[
                    'carbon.png', 'citrex.png', 'dragonswap.png', 'silo.png', 
                    'symphony.png', 'takara.png', 'yei.png'
                  ].map((logo, index) => (
                    <div
                      key={`protocols-2-${index}`}
                      className="flex-shrink-0 w-36 h-24 bg-gradient-to-br from-slate-800/60 via-slate-700/40 to-slate-800/60 backdrop-blur-sm rounded-2xl border border-cyan-500/20 hover:border-cyan-400/60 transition-all duration-300 hover:scale-105 hover:rotate-1 flex items-center justify-center group cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 relative overflow-hidden"
                      onMouseEnter={(e) => handleMouseEnter(e, logo.replace('.png', '').charAt(0).toUpperCase() + logo.replace('.png', '').slice(1), 'cyan')}
                      onMouseLeave={handleMouseLeave}
                    >
                      {/* Enhanced glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/0 via-cyan-500/5 to-emerald-500/0 group-hover:from-cyan-600/10 group-hover:via-cyan-500/15 group-hover:to-emerald-500/10 transition-all duration-300 rounded-2xl" />
                      
                      {/* Subtle animated border */}
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 rounded-2xl border border-cyan-400/30 animate-pulse" />
                      </div>
                      
                      {/* Corner highlights */}
                      <div className="absolute top-2 left-2 w-2 h-2 bg-cyan-400/0 group-hover:bg-cyan-400/40 rounded-full transition-all duration-300 delay-100" />
                      <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-400/0 group-hover:bg-emerald-400/40 rounded-full transition-all duration-300 delay-200" />
                      
                      <Image
                        src={`/protocols/${logo}`}
                        alt={`Protocol ${logo.replace('.png', '')}`}
                        width={90}
                        height={90}
                        className="object-contain filter brightness-90 group-hover:brightness-125 transition-all duration-300 max-w-[80px] max-h-[60px] relative z-10 group-hover:scale-105 drop-shadow-lg group-hover:drop-shadow-xl"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="relative h-20 bg-gradient-to-b from-slate-950/95 to-slate-950/98 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-slate-400/40 to-slate-400/40"></div>
            <div className="relative">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-slate-500/30 to-slate-500/30 animate-pulse"></div>
              <div className="absolute inset-0 w-4 h-4 rounded-full border border-slate-400/60 animate-ping"></div>
            </div>
            <div className="w-20 h-px bg-gradient-to-r from-slate-400/40 via-slate-400/40 to-transparent"></div>
          </div>
        </div>
        {/* Sparkle effects */}
        <div className="absolute top-3 left-1/5 w-0.5 h-0.5 bg-slate-400/70 rounded-full animate-twinkle"></div>
        <div className="absolute bottom-3 right-1/5 w-0.5 h-0.5 bg-slate-400/70 rounded-full animate-twinkle delay-500"></div>
        <div className="absolute top-6 right-1/3 w-0.5 h-0.5 bg-slate-400/70 rounded-full animate-twinkle delay-1000"></div>
      </div>

      {/* Waitlist CTA Section */}
      <section id="waitlist-section" className="py-12 bg-gradient-to-b from-slate-950/98 via-slate-950/98 to-slate-950/95 backdrop-blur-sm">
                  <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Join the ZenSei Waitlist
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Be among the first to experience the future of DeFi on Sei. Get early access to ZenSei&apos;s Multi-Agent System.
            </p>

            {isSubmitted ? (
              <div className="max-w-md mx-auto">
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">You&apos;re on the list!</h3>
                  <p className="text-green-200">
                    Thanks for joining! We&apos;ll notify you when ZenSei is ready for early access.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="max-w-md mx-auto space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 pr-4 py-6 text-lg bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl backdrop-blur-sm"
                    disabled={isSubmitting}
                  />
                </div>
                
                {emailError && (
                  <p className="text-red-400 text-sm text-left">{emailError}</p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:from-slate-600 disabled:to-slate-700 text-white border-0 shadow-2xl transition-all duration-300 hover:scale-105 text-lg px-8 py-6 rounded-xl"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Joining Waitlist...
                    </div>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Join Waitlist
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Additional CTA for authenticated users */}
            {authenticated && !isSubmitted && (
              <div className="pt-4">
                <p className="text-slate-400 mb-4">Already have access?</p>
                <Button
                  onClick={handleLaunchApp}
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-4 border-2 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500/50 rounded-xl font-semibold backdrop-blur-sm"
                >
                  Launch App
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gradient-to-b from-slate-950/95 to-slate-950 backdrop-blur-sm border-t border-slate-800/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center space-y-6">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Image
                src="/icon-white.svg"
                alt="ZenSei Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-xl font-display font-bold text-white">ZenSei</span>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              <a
                href="https://zensei.gitbook.io/zensei-docs/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 text-slate-400 hover:text-white transition-colors duration-300 group"
              >
                <FileText className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" />
              </a>
              
              <a
                href="https://x.com/AI_ZenSei"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 text-slate-300 hover:text-white transition-colors duration-300 group"
              >
                <Image
                  src="/logox.svg"
                  alt="X (Twitter)"
                  width={28}
                  height={28}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
              </a>
              
              <a
                href="https://github.com/0xMattM/zensei"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 text-slate-300 hover:text-white transition-colors duration-300 group"
              >
                <Github className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" />
              </a>
            </div>

            {/* Copyright */}
            <div className="pt-4 border-t border-slate-800/30 w-full text-center">
              <p className="text-slate-400 text-sm">
                © {new Date().getFullYear()} ZenSei. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}