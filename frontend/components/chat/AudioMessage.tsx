'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Pause, Volume2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AudioMessageProps {
  audioBlob: Blob
  isUser: boolean
  duration?: number
}

export function AudioMessage({ audioBlob, isUser, duration }: AudioMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [durationLoaded, setDurationLoaded] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio URL from blob
    const url = URL.createObjectURL(audioBlob)
    setAudioUrl(url)

    // Cleanup
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [audioBlob])

  useEffect(() => {
    if (!audioUrl) return

    const audio = new Audio(audioUrl)
    audioRef.current = audio

    audio.addEventListener('loadedmetadata', () => {
      const audioDuration = audio.duration
      if (isFinite(audioDuration) && audioDuration > 0) {
        setTotalDuration(Math.floor(audioDuration))
        setDurationLoaded(true)
      } else if (duration && duration > 0) {
        setTotalDuration(duration)
        setDurationLoaded(true)
      }
    })

    audio.addEventListener('timeupdate', () => {
      const currentAudioTime = audio.currentTime
      if (isFinite(currentAudioTime)) {
        setCurrentTime(Math.floor(currentAudioTime))
      }
    })

    audio.addEventListener('ended', () => {
      setIsPlaying(false)
      setCurrentTime(0)
    })

    audio.addEventListener('error', (e) => {
      console.warn('Audio loading error:', e)
      setDurationLoaded(false)
    })

    return () => {
      audio.pause()
      audio.removeEventListener('loadedmetadata', () => {})
      audio.removeEventListener('timeupdate', () => {})
      audio.removeEventListener('ended', () => {})
      audio.removeEventListener('error', () => {})
    }
  }, [audioUrl, duration])

  const togglePlayPause = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(console.error)
    }
    setIsPlaying(!isPlaying)
  }

  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds) || seconds < 0) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercentage = totalDuration > 0 && isFinite(totalDuration) 
    ? Math.min((currentTime / totalDuration) * 100, 100) 
    : 0

  return (
    <div className={cn(
      'flex items-center space-x-3 p-3 rounded-lg min-w-48',
      isUser ? 'bg-white/10' : 'bg-white/5'
    )}>
      {/* Play/Pause Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={togglePlayPause}
        className={cn(
          'rounded-full h-8 w-8 p-0',
          isUser ? 'text-white hover:bg-white/20' : 'text-foreground hover:bg-white/10'
        )}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4 ml-0.5" />
        )}
      </Button>

      {/* Waveform/Progress */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center space-x-2">
          <Volume2 className={cn(
            'h-3 w-3',
            isUser ? 'text-white/70' : 'text-muted-foreground'
          )} />
          <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className={cn(
                'h-full transition-all duration-100',
                isUser ? 'bg-white/70' : 'bg-zen-cyan'
              )}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
        
        {/* Time - only show if duration is loaded and valid */}
        {durationLoaded && totalDuration > 0 && (
          <div className={cn(
            'text-xs',
            isUser ? 'text-white/70' : 'text-muted-foreground'
          )}>
            {formatTime(currentTime)} / {formatTime(totalDuration)}
          </div>
        )}
        
        {/* Fallback text when duration isn't available */}
        {!durationLoaded && (
          <div className={cn(
            'text-xs',
            isUser ? 'text-white/70' : 'text-muted-foreground'
          )}>
            Voice message
          </div>
        )}
      </div>
    </div>
  )
} 