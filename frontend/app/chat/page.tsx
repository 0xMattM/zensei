import { ChatInterface } from '@/components/chat/ChatInterface'
import { Navigation } from '@/components/layout/Navigation'

export default function ChatPage() {
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main className="flex-1 bg-transparent overflow-hidden">
        <ChatInterface />
      </main>
    </div>
  )
} 