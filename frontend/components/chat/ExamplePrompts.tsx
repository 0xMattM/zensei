'use client'

import { Sparkles, TrendingUp, Wallet, Zap, BarChart3, RefreshCw, Target, Terminal, Search, Book, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ExamplePromptsProps {
  onSelectPrompt: (prompt: string) => void
  variant?: 'grid' | 'dropdown'
  className?: string
}

const examplePrompts = [
  {
    icon: Terminal,
    title: "Test",
    prompt: "Test the system and provide a report.",
    category: "system"
  },
  {
    icon: RefreshCw, // The RefreshCw icon (circular arrows) suggests a multi-step or combo/automation action, fitting for a sequence of DeFi operations.
    title: "Sample Combo 1",
    prompt: "Supply 0.1 USDC on Yei, then borrow 0.1 WSEI and unwrap it.",
    category: "system"
  },
  {
    icon: Target,
    title: "Sample Combo 2",
    prompt: "Find the lending protocol with the most TVL on Sei, then fetch my portfolio balances and supply 10% of my USDC to the protocol. After that get the transaction details of the supply transaction.",
    category: "system"
  },
  {
    icon: TrendingUp,
    title: "Supply & Borrow",
    prompt: "Supply 0.01 USDC to Yei, then borrow 0.01 WSEI.",
    category: "defi"
  },
  {
    icon: Zap,
    title: "Transfer",
    prompt: "Transfer 0.01 SEI to Vitalik's wallet.",
    category: "wallet"
  },
  {
    icon: Sparkles,
    title: "Deploy a memecoin",
    prompt: "Deploy a Memecoin with a funny name and then transfer 1000 coins to 0xF12d64817029755853bc74a585EcD162f63c5f84",
    category: "deploy"
  },
  {
    icon: Wallet,
    title: "Portfolio Overview",
    prompt: "Show the current portfolio balance and asset breakdown of this wallet 0xf133FF0166A89aD9ab691a58385CDBd3590C7f28",
    category: "portfolio"
  },
  {
    icon: Search,
    title: "Research",
    prompt: "Research the web and find the latest news about Sei Network and find the best investment opportunities in Sei Ecosystem.",
    category: "research"
  },
  {
    icon: BarChart3,
    title: "Analytics",
    prompt: "Fetch all the Sei Network analytics and find the TVL on Sei and it's top 3 protocols by TVL.",
    category: "analytics"
  },
  {
    icon: Globe,
    title: "Explore",
    prompt: "Find the details of this transaction on the Sei Explorer 0x73a1d243d5c922498a2303efa9b43dd9f8724d01d20dbff9d2e6bd8ba478a44d",
    category: "explore"
  },
  {
    icon: Book,
    title: "Knowledge Base",
    prompt: "What is ZenSei and how does it work?",
    category: "knowledge"
  }
]

export function ExamplePrompts({ onSelectPrompt, variant = 'grid', className = '' }: ExamplePromptsProps) {
  if (variant === 'dropdown') {
	    return (
	      <div className={`space-y-1 ${className}`}>
	        {examplePrompts.map((example, index) => {
	          const Icon = example.icon
	          return (
	            <Button
	              key={index}
	              variant="ghost"
	              className="w-full justify-start h-auto p-3 text-left rounded-xl transition-all duration-200 hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5 hover:ring hover:ring-zen-purple/20 hover:shadow-md hover:shadow-zen-purple/10"
	              onClick={() => onSelectPrompt(example.prompt)}
	            >
	              <div className="flex items-center space-x-3">
	                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-zen-purple/15 to-zen-cyan/15 border border-white/10 backdrop-blur-[1px] flex items-center justify-center">
	                  <Icon className="w-3.5 h-3.5 text-zen-purple" />
	                </div>
	                <div className="flex-1">
	                  <p className="font-display font-semibold text-sm tracking-tight text-foreground leading-tight">{example.title}</p>
	                  <p className="text-xs text-muted-foreground/90 mt-0.5 leading-relaxed whitespace-normal break-words hyphens-auto">{example.prompt}</p>
	                </div>
	              </div>
	            </Button>
	          )
	        })}
	      </div>
	    )
  }

  return (
	    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 relative ${className}`}>
      {examplePrompts.map((example, index) => {
        const Icon = example.icon
        return (
          <Card
            key={index}
	            className="p-4 h-28 md:h-28 cursor-pointer transition-all duration-300 transform-gpu hover:-translate-y-1 hover:shadow-lg hover:shadow-zen-purple/15 hover:z-10 glass-card border-border/40 hover:border-zen-purple/30 hover:ring hover:ring-zen-purple/20 hover:bg-gradient-to-br hover:from-slate-800/55 hover:to-slate-900/55 group relative"
            onClick={() => onSelectPrompt(example.prompt)}
          >
	            <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-90 transition duration-300 bg-gradient-to-br from-zen-purple/8 via-transparent to-zen-cyan/8" />
	            <div className="flex items-center h-full space-x-3.5">
	              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-zen-purple/15 to-zen-cyan/15 border border-white/10 backdrop-blur-[1px] flex items-center justify-center transition-all duration-300 group-hover:from-zen-purple/25 group-hover:to-zen-cyan/25 group-hover:scale-105">
	                <Icon className="w-5 h-5 text-zen-purple transition-colors duration-300 group-hover:text-zen-cyan" />
	              </div>
	              <div className="flex-1 min-w-0">
	                <h3 className="font-display font-semibold text-sm tracking-tight text-foreground mb-1 text-balance">
                  {example.title}
                </h3>
	                <p className="text-xs text-muted-foreground/90 line-clamp-2 leading-relaxed">
                  {example.prompt}
                </p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
} 