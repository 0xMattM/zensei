'use client'

import { useState, useEffect, useRef } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { Send, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/types'
import { ExamplePrompts } from './ExamplePrompts'
import { TipsDropdown } from './TipsDropdown'
import { MessageRenderer } from './MessageRenderer'
import { Avatar } from './Avatar'
import { VoiceRecorder } from './VoiceRecorder'
import { AudioMessage } from './AudioMessage'
import { useUserSettings } from '@/hooks/useUserSettings'

export function ChatInterface() {
  const { user, authenticated } = usePrivy()
  const { getUserAvatar } = useUserSettings()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Ref for auto-scrolling to bottom
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Auto-scroll when messages change or loading state changes
  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('zensei-chat-history')
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages)
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsed.map((message: { timestamp?: string; [key: string]: unknown }) => ({
          ...message,
          timestamp: message.timestamp ? new Date(message.timestamp) : new Date(),
        }))
        setMessages(messagesWithDates)
      } catch (e) {
        console.error('Error loading chat history:', e)
        // Set initial welcome message if parsing fails
        const welcomeMessage: ChatMessage = {
          id: '1',
          content: 'Hello! I\'m your **ZenSei AI agent**. I can help you with DeFi operations on Sei.\n\n✨ *What would you like to do today?*\n\nTry asking me about:\n- Portfolio management\n- Token swaps and trading\n- Yield farming opportunities\n- Risk analysis',
          role: 'assistant',
          timestamp: new Date(),
        }
        setMessages([welcomeMessage])
      }
    } else {
      // Set initial welcome message if no history
      const welcomeMessage: ChatMessage = {
        id: '1',
        content: 'Hello! I\'m your **ZenSei AI agent**. I can help you with DeFi operations on Sei.\n\n✨ *What would you like to do today?*\n\nTry asking me about:\n- Portfolio management\n- Token swaps and trading\n- Yield farming opportunities\n- Risk analysis',
        role: 'assistant',
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
  }, [])

  // Save messages to localStorage whenever messages change (excluding audio blobs)
  useEffect(() => {
    if (messages.length > 0) {
      // Convert messages for storage (exclude audio blobs)
      const storableMessages = messages.map(msg => ({
        ...msg,
        audioBlob: undefined, // Don't store audio blobs in localStorage
      }))
      localStorage.setItem('zensei-chat-history', JSON.stringify(storableMessages))
    }
  }, [messages])

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue
    console.log('handleSendMessage called with:', { messageText, inputValue, text })
    
    if (!text.trim()) {
      console.log('No text to send, returning early')
      return
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: text,
      role: 'user',
      timestamp: new Date(),
      messageType: 'text',
    }

    console.log('Adding user message:', userMessage)
    setMessages(prev => {
      const newMessages = [...prev, userMessage]
      console.log('Messages after adding user message:', newMessages.length)
      return newMessages
    })
    
    // Only clear input if we're using the manual input (not example prompts)
    if (!messageText) {
      setInputValue('')
    }
    
    setIsLoading(true)
    setError(null)

    try {
      console.log('Sending request to API with text:', text)
      
      // Send to secure API route (proxy to webhook)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          user_address: authenticated ? user?.wallet?.address : null,
          timestamp: new Date().toISOString(),
        }),
      })

      console.log('API response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API error response:', errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('API response data:', data)
      
      // Handle response from API route
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: data.response || data.message || 'I received your message, but couldn\'t generate a proper response. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      }

      console.log('Adding assistant message:', assistantMessage)
      setMessages(prev => {
        const newMessages = [...prev, assistantMessage]
        console.log('Messages after adding assistant message:', newMessages.length)
        return newMessages
      })
      
    } catch (error) {
      console.error('Chat API error:', error)
      setError(error instanceof Error ? error.message : 'Failed to send message')
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I\'m having trouble connecting to the server right now. Please check your internet connection and try again.',
        role: 'assistant',
        timestamp: new Date(),
        isError: true,
      }
      
      setMessages(prev => {
        const newMessages = [...prev, errorMessage]
        console.log('Messages after adding error message:', newMessages.length)
        return newMessages
      })
    } finally {
      console.log('Setting isLoading to false')
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleAudioRecorded = async (audioBlob: Blob) => {
    console.log('Audio recorded:', audioBlob)

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: 'Voice message',
      role: 'user',
      timestamp: new Date(),
      audioBlob: audioBlob,
      messageType: 'audio',
    }

    console.log('Adding user audio message:', userMessage)
    setMessages(prev => {
      const newMessages = [...prev, userMessage]
      console.log('Messages after adding user audio message:', newMessages.length)
      return newMessages
    })
    
    setIsLoading(true)
    setError(null)

    try {
      console.log('Sending audio to API')
      
      // Create FormData to send audio file
      const formData = new FormData()
      formData.append('audio', audioBlob, 'voice-message.webm')
      formData.append('form_id', 'chatbot')
      formData.append('user_address', authenticated ? user?.wallet?.address || '' : '')
      formData.append('timestamp', new Date().toISOString())

      // Send to secure API route (proxy to webhook)
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData, // Don't set Content-Type, let browser set it with boundary
      })

      console.log('API response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API error response:', errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('API response data:', data)
      
      // Handle response from API route
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: data.response || data.message || 'I received your voice message, but couldn\'t generate a proper response. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
        messageType: 'text',
      }

      console.log('Adding assistant message:', assistantMessage)
      setMessages(prev => {
        const newMessages = [...prev, assistantMessage]
        console.log('Messages after adding assistant message:', newMessages.length)
        return newMessages
      })
      
    } catch (error) {
      console.error('Audio chat API error:', error)
      setError(error instanceof Error ? error.message : 'Failed to send voice message')
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I\'m having trouble processing your voice message right now. Please try again or send a text message.',
        role: 'assistant',
        timestamp: new Date(),
        isError: true,
        messageType: 'text',
      }
      
      setMessages(prev => {
        const newMessages = [...prev, errorMessage]
        console.log('Messages after adding error message:', newMessages.length)
        return newMessages
      })
    } finally {
      console.log('Setting isLoading to false')
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
    localStorage.removeItem('zensei-chat-history')
    const welcomeMessage: ChatMessage = {
      id: '1',
      content: 'Hello! I\'m your **ZenSei AI agent**. I can help you with DeFi operations on Sei.\n\n✨ *What would you like to do today?*\n\nTry asking me about:\n- Portfolio management\n- Token swaps and trading\n- Yield farming opportunities\n- Risk analysis',
      role: 'assistant',
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
  }

  const hasMessages = messages.length > 1 // More than just welcome message

  return (
    <div className="flex flex-col h-full w-full bg-transparent relative">
      {/* Fixed Clear Chat Button - Always Visible */}
      {hasMessages && (
        <div className="fixed top-20 right-4 z-50">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearChat}
            className="glass-card border-border/50 hover:bg-white/10 shadow-lg text-xs sm:text-sm px-2 sm:px-4"
          >
            <span className="hidden sm:inline">Clear Chat</span>
            <span className="sm:hidden">Clear</span>
          </Button>
        </div>
      )}

      {/* Messages or Example Prompts */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto overscroll-contain bg-transparent scroll-smooth relative"
      >

        {/* Error Display */}
        {error && (
          <div className="max-w-6xl mx-auto p-3 sm:p-6">
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
              <span className="text-sm text-red-400">{error}</span>
            </div>
          </div>
        )}

        {!hasMessages ? (
          // Show example prompts when no messages
          <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6 bg-transparent">
            <div className="text-center mb-8">
              <h3 className="text-lg sm:text-xl font-display font-normal text-foreground mb-2">
                Get started with these examples
              </h3>
              <p className="text-sm text-muted-foreground">
                Click any prompt below to start a conversation
              </p>
            </div>
            <ExamplePrompts onSelectPrompt={handleSendMessage} />
          </div>
        ) : (
          // Show chat messages
          <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6 bg-transparent">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex w-full fade-in-up items-start space-x-3',
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                )}
              >
                {/* Avatar */}
                {(() => {
                  if (message.role === 'user') {
                    const userAvatarData = getUserAvatar()
                    const avatarProps: { type: 'user' | 'agent'; size: 'sm' | 'md' | 'lg'; className: string; customImage?: string } = {
                      type: userAvatarData.type === 'custom' ? 'user' : (userAvatarData.type as 'user' | 'agent'),
                      size: 'md',
                      className: 'mt-1'
                    }
                    if (userAvatarData.image) {
                      avatarProps.customImage = userAvatarData.image
                    }
                    return <Avatar {...avatarProps} />
                  } else {
                    return (
                      <Avatar 
                        type="agent" 
                        size="md"
                        className="mt-1"
                      />
                    )
                  }
                })()}
                
                {/* Message Content */}
                <Card
                  className={cn(
                    'max-w-[85%] sm:max-w-[80%] shadow-md transition-all duration-300 hover:shadow-lg min-w-0 overflow-hidden',
                    message.role === 'user'
                      ? 'zen-gradient text-white border-transparent'
                      : message.isError
                      ? 'bg-red-500/10 border-red-500/20'
                      : 'glass-card border-border/40'
                  )}
                >
                  <CardContent className="p-4">
                    {message.messageType === 'audio' && message.audioBlob ? (
                      <AudioMessage 
                        audioBlob={message.audioBlob}
                        isUser={message.role === 'user'}
                      />
                    ) : (
                      <MessageRenderer 
                        content={message.content}
                        isUser={message.role === 'user'}
                        timestamp={message.timestamp ? (message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp)) : undefined}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}

            {/* Loading message */}
            {isLoading && (
              <div className="flex w-full fade-in-up items-start space-x-3">
                <Avatar 
                  type="agent" 
                  size="md"
                  className="mt-1"
                />
                <Card className="glass-card border-border/40">
                  <CardContent className="p-4 flex items-center space-x-3">
                    <Loader2 className="w-5 h-5 animate-spin text-zen-cyan" />
                    <p className="text-sm text-muted-foreground">Agent is thinking...</p>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Invisible element for auto-scrolling */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="border-t border-border/40 p-3 sm:p-5 glass-card">
        <div className="max-w-6xl mx-auto flex items-center space-x-2 sm:space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message the Zen Master..."
              className="w-full p-3 sm:p-4 text-sm bg-background/60 border border-border/40 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-zen-purple/40 focus:border-zen-purple/40 text-foreground placeholder-muted-foreground transition-all duration-300 glass min-h-[2.75rem] sm:min-h-[3rem] max-h-32 shadow-sm"
              rows={1}
              disabled={isLoading}
              style={{ 
                height: 'auto',
                minHeight: '2.75rem'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement
                target.style.height = 'auto'
                target.style.height = Math.min(target.scrollHeight, 128) + 'px'
              }}
            />
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Voice Recorder */}
            <VoiceRecorder 
              onAudioRecorded={handleAudioRecorded}
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              size="icon"
              variant="zen"
              className="h-11 w-11 sm:h-12 sm:w-12 zen-glow transition-all duration-300 hover:scale-105"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            {/* Tips Dropdown */}
            {hasMessages && (
              <TipsDropdown onSelectPrompt={handleSendMessage} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 