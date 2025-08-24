import { Navigation } from '@/components/layout/Navigation'
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard'

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <Navigation />
      
      {/* Analytics Dashboard */}
      <main className="flex-1 overflow-auto p-3 sm:p-6 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <AnalyticsDashboard />
        </div>
      </main>
    </div>
  )
} 