'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VoiceRecorder } from './VoiceRecorder'
import { AudioMessage } from './AudioMessage'

export function AudioTest() {
  const [recordedBlobs, setRecordedBlobs] = useState<Blob[]>([])

  const handleAudioRecorded = (blob: Blob) => {
    console.log('Audio recorded:', blob.size, 'bytes', blob.type)
    setRecordedBlobs(prev => [...prev, blob])
  }

  const handleTestWebhook = async (blob: Blob) => {
    try {
      const formData = new FormData()
      formData.append('audio', blob, 'test-audio.webm')
      formData.append('form_id', 'chatbot')
      formData.append('user_address', 'test-address')
      formData.append('timestamp', new Date().toISOString())

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      console.log('Webhook test response:', data)
      alert(JSON.stringify(data, null, 2))
    } catch (error) {
      console.error('Webhook test error:', error)
      alert('Error: ' + error)
    }
  }

  return (
    <Card className="glass-card border-border/50 m-4 max-w-md">
      <CardHeader>
        <CardTitle>Audio Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <VoiceRecorder onAudioRecorded={handleAudioRecorded} />
        
        <div className="text-sm text-muted-foreground">
          Recorded {recordedBlobs.length} audio clips
        </div>

        {recordedBlobs.map((blob, index) => (
          <div key={index} className="space-y-2 p-2 border border-border rounded">
            <div className="text-xs text-muted-foreground">
              Clip {index + 1}: {blob.size} bytes, {blob.type}
            </div>
            <AudioMessage audioBlob={blob} isUser={true} />
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleTestWebhook(blob)}
            >
              Test Webhook
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
} 