import { Navigation } from '@/components/layout/Navigation'
import { PortfolioDashboard } from '@/components/portfolio/PortfolioDashboard'

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <Navigation />
      
      {/* Portfolio Dashboard */}
      <main className="flex-1 overflow-auto p-3 sm:p-6 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <PortfolioDashboard />
        </div>
      </main>
    </div>
  )
} 