import { Navigation } from '@/components/layout/Navigation'
import { SettingsForm } from '@/components/settings/SettingsForm'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <Navigation />
      
      {/* Settings Content */}
      <main className="flex-1 overflow-auto p-6 bg-transparent">
        <div className="relative max-w-4xl mx-auto">
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-zen-primary to-zen-secondary bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Customize your ZenSei experience
            </p>
          </div>
          
          <SettingsForm />
        </div>
      </main>
    </div>
  )
} 