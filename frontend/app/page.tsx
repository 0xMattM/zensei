import { LandingPage } from '@/components/landing/LandingPage'
import { LandingNavigation } from '@/components/layout/LandingNavigation'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Landing Navigation */}
      <LandingNavigation />
      
      {/* Landing Page Content */}
      <LandingPage />
    </div>
  )
} 