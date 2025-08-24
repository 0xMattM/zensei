'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, Square, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VoiceRecorderProps {
  onAudioRecorded: (audioBlob: Blob) => void
  disabled?: boolean
}

export function VoiceRecorder({ onAudioRecorded, disabled = false }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isSupported, setIsSupported] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Check if mediaRecorder is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsSupported(false)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      })

      // Try different MIME types for better browser compatibility
      let mimeType = 'audio/webm;codecs=opus'
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm'
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/mp4'
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = '' // Let browser choose
          }
        }
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType
      })

      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' })
        onAudioRecorded(audioBlob)
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop())
        setIsProcessing(false)
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (err) {
      console.error('Error starting recording:', err)
      setError('Failed to access microphone. Please check permissions.')
      setIsRecording(false)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      setIsProcessing(true)
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!isSupported) {
    return (
      <div className="flex items-center space-x-1 sm:space-x-2">
        <Button
          variant="ghost"
          size="icon"
          disabled
          className="text-muted-foreground h-11 w-11 sm:h-12 sm:w-12"
        >
          <MicOff className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <span className="text-xs text-muted-foreground hidden sm:inline">Voice not supported</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center space-x-1 sm:space-x-2">
        <Button
          variant="ghost"
          size="icon"
          disabled
          className="text-red-400 h-11 w-11 sm:h-12 sm:w-12"
        >
          <MicOff className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <span className="text-xs text-red-400 hidden sm:inline">Mic error</span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-1 sm:space-x-2">
      {isRecording && (
        <div className="flex items-center space-x-1 sm:space-x-2 bg-red-500/10 border border-red-500/20 rounded-lg px-2 sm:px-3 py-1">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          <span className="text-xs text-red-400 font-mono hidden sm:inline">
            {formatTime(recordingTime)}
          </span>
          <span className="text-[10px] text-red-400 font-mono sm:hidden">
            {recordingTime}s
          </span>
        </div>
      )}
      
      <Button
        variant={isRecording ? "destructive" : "ghost"}
        size="icon"
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled || isProcessing}
        className={cn(
          "transition-all duration-200 h-11 w-11 sm:h-12 sm:w-12",
          isRecording && "bg-red-500/20 border-red-500/30 hover:bg-red-500/30"
        )}
      >
        {isProcessing ? (
          <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
        ) : isRecording ? (
          <Square className="h-4 w-4 sm:h-5 sm:w-5" />
        ) : (
          <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
        )}
      </Button>
    </div>
  )
} 