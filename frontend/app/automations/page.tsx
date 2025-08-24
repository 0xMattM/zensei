import { Navigation } from '@/components/layout/Navigation'
import { AutomationsGrid } from '@/components/automations/AutomationsGrid'

export default function AutomationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <Navigation />
      
      {/* Automations Content */}
      <main className="flex-1 overflow-auto p-6 bg-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-zen-primary to-zen-secondary bg-clip-text text-transparent">
              Automations
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Powerful automation tools to streamline your DeFi operations. Set it up once and let ZenSei handle the rest.
            </p>
            <a href="#subscribe-bar" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zen-purple/30 text-foreground/90 hover:bg-zen-purple/10 transition-colors">
              <div className="w-2 h-2 bg-zen-purple rounded-full animate-pulse" />
              <span className="text-sm font-medium">Get early access</span>
            </a>
          </div>
          
          <AutomationsGrid />
        </div>
      </main>
    </div>
  )
} 