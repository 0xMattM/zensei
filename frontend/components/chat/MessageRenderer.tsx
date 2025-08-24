'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MessageRendererProps {
  content: string
  isUser?: boolean
  className?: string
  timestamp?: Date | undefined
}

export function MessageRenderer({ content, isUser = false, className = '', timestamp }: MessageRendererProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className={cn('relative', className)}>
      {/* Message content */}
      <div className="mb-3">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Custom styling for different elements
            h1: ({ children }) => (
              <h1 className={cn(
                "text-lg font-semibold mb-3 mt-4 first:mt-0",
                isUser ? "text-white" : "text-foreground"
              )}>
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className={cn(
                "text-base font-semibold mb-2 mt-3 first:mt-0",
                isUser ? "text-white" : "text-foreground"
              )}>
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className={cn(
                "text-sm font-semibold mb-2 mt-3 first:mt-0",
                isUser ? "text-white" : "text-foreground"
              )}>
                {children}
              </h3>
            ),
            
            p: ({ children }) => (
              <p className={cn(
                "text-sm leading-relaxed mb-3 last:mb-0 break-words overflow-wrap-anywhere",
                isUser ? "text-white" : "text-foreground"
              )}>
                {children}
              </p>
            ),
            
            ul: ({ children }) => (
              <ul className={cn(
                "list-disc list-inside space-y-1 mb-3 text-sm",
                isUser ? "text-white" : "text-foreground"
              )}>
                {children}
              </ul>
            ),
            
            ol: ({ children }) => (
              <ol className={cn(
                "list-decimal list-inside space-y-1 mb-3 text-sm",
                isUser ? "text-white" : "text-foreground"
              )}>
                {children}
              </ol>
            ),
            
            li: ({ children }) => (
              <li className={cn(
                "text-sm break-words overflow-wrap-anywhere",
                isUser ? "text-white" : "text-foreground"
              )}>
                {children}
              </li>
            ),
            
            code: ({ children }) => (
              <code className={cn(
                "px-1.5 py-0.5 rounded text-xs font-mono break-all",
                isUser 
                  ? "bg-white/20 text-white" 
                  : "bg-muted text-foreground"
              )}>
                {children}
              </code>
            ),
            
            pre: ({ children }) => (
              <pre className={cn(
                "p-3 rounded-lg overflow-x-auto border mb-3 text-xs sm:text-sm whitespace-pre-wrap break-all",
                isUser 
                  ? "bg-white/10 border-white/20 text-white" 
                  : "bg-muted border-border text-foreground"
              )}>
                {children}
              </pre>
            ),
            
            blockquote: ({ children }) => (
              <blockquote className={cn(
                "border-l-4 pl-4 italic py-2 rounded-r-lg mb-3",
                isUser
                  ? "border-white/50 bg-white/10 text-white/90"
                  : "border-zen-purple/50 bg-muted/20 text-muted-foreground"
              )}>
                {children}
              </blockquote>
            ),
            
            strong: ({ children }) => (
              <strong className={cn(
                "font-semibold",
                isUser ? "text-white" : "text-foreground"
              )}>
                {children}
              </strong>
            ),
            
            em: ({ children }) => (
              <em className={cn(
                "italic",
                isUser ? "text-white" : "text-foreground"
              )}>
                {children}
              </em>
            ),
            
            a: ({ children, href }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "underline transition-colors duration-200",
                  isUser 
                    ? "text-white hover:text-white/80" 
                    : "text-zen-purple hover:text-zen-cyan"
                )}
              >
                {children}
              </a>
            ),

            // Table components
            table: ({ children }) => (
              <div className="overflow-x-auto mb-3">
                <table className={cn(
                  "min-w-full border rounded-lg",
                  isUser ? "border-white/20" : "border-border"
                )}>
                  {children}
                </table>
              </div>
            ),
            
            thead: ({ children }) => (
              <thead className={cn(
                isUser ? "bg-white/10" : "bg-muted"
              )}>
                {children}
              </thead>
            ),
            
            th: ({ children }) => (
              <th className={cn(
                "px-3 py-2 text-left text-xs font-semibold border-b",
                isUser ? "text-white border-white/20" : "text-foreground border-border"
              )}>
                {children}
              </th>
            ),
            
            td: ({ children }) => (
              <td className={cn(
                "px-3 py-2 text-xs border-b break-all max-w-0",
                isUser ? "text-white border-white/20" : "text-foreground border-border"
              )}>
                {children}
              </td>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {/* Timestamp and Copy Button */}
      {timestamp && (
        <div className={cn(
          'flex items-center justify-between text-xs border-t pt-2',
          isUser 
            ? 'text-white/70 border-white/20' 
            : 'text-muted-foreground border-border/30'
        )}>
          <span>{formatTimestamp(timestamp)}</span>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-6 w-6 transition-colors duration-200",
              isUser 
                ? "hover:bg-white/10 text-white/70 hover:text-white" 
                : "hover:bg-black/10 text-muted-foreground hover:text-foreground"
            )}
            onClick={handleCopy}
          >
            {isCopied ? (
              <Check className="h-3 w-3 text-green-400" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      )}
    </div>
  )
} 