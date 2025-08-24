'use client'

import { useState } from 'react'
import { Lightbulb, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ExamplePrompts } from './ExamplePrompts'

interface TipsDropdownProps {
  onSelectPrompt: (prompt: string) => void
}

export function TipsDropdown({ onSelectPrompt }: TipsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelectPrompt = (prompt: string) => {
    onSelectPrompt(prompt)
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-11 w-11 sm:h-12 sm:w-12 px-2 sm:px-3 text-muted-foreground hover:text-foreground transition-colors duration-200 hover:bg-white/5"
        >
          <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-1" />
          <span className="text-xs font-medium hidden sm:inline">Tips</span>
          <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 ml-0 sm:ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 sm:w-96 max-w-[90vw] max-h-80 sm:max-h-96 overflow-y-auto glass-card border-border/50 p-2"
      >
        <div className="mb-2">
          <h3 className="font-display font-semibold text-sm text-foreground px-2 py-1">
            Try these prompts
          </h3>
          <p className="text-xs text-muted-foreground px-2">
            Click any suggestion to send it instantly
          </p>
        </div>
        <ExamplePrompts 
          onSelectPrompt={handleSelectPrompt} 
          variant="dropdown"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 