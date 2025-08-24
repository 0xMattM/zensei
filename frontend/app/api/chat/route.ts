import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Check if webhook URL is configured
    if (!process.env.WEBHOOK_URL) {
      return NextResponse.json(
        { error: 'Webhook URL not configured' },
        { status: 500 }
      )
    }

    const contentType = request.headers.get('content-type') || ''
    
    let webhookResponse: Response
    
    if (contentType.includes('multipart/form-data')) {
      // Handle audio file upload
      const formData = await request.formData()
      const audioFile = formData.get('audio') as File
      const formId = formData.get('form_id') as string
      const userAddress = formData.get('user_address') as string
      const timestamp = formData.get('timestamp') as string
      
      if (!audioFile) {
        return NextResponse.json(
          { error: 'Audio file is required' },
          { status: 400 }
        )
      }

      console.log('Sending audio to webhook:', process.env.WEBHOOK_URL)
      console.log('Audio file:', audioFile.name, audioFile.size, audioFile.type)

      // Create new FormData for webhook
      const webhookFormData = new FormData()
      webhookFormData.append('audio', audioFile)
      webhookFormData.append('form_id', formId || 'chatbot')
      webhookFormData.append('user_address', userAddress || '')
      webhookFormData.append('timestamp', timestamp || new Date().toISOString())

      // Forward FormData to webhook
      webhookResponse = await fetch(process.env.WEBHOOK_URL, {
        method: 'POST',
        body: webhookFormData,
      })
      
    } else {
      // Handle text message
      const body = await request.json()
      
      // Validate required fields
      if (!body.message) {
        return NextResponse.json(
          { error: 'Message is required' },
          { status: 400 }
        )
      }

      // Prepare webhook payload
      const webhookPayload = {
        form_id: 'chatbot',
        message: body.message,
        user_address: body.user_address || null,
        timestamp: body.timestamp || new Date().toISOString(),
      }

      console.log('Sending to webhook:', process.env.WEBHOOK_URL)
      console.log('Payload:', JSON.stringify(webhookPayload, null, 2))

      // Forward request to webhook
      webhookResponse = await fetch(process.env.WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload),
      })
    }

    console.log('Webhook response status:', webhookResponse.status)
    console.log('Webhook response headers:', Object.fromEntries(webhookResponse.headers.entries()))

    if (!webhookResponse.ok) {
      console.error('Webhook error:', webhookResponse.status, webhookResponse.statusText)
      return NextResponse.json(
        { 
          error: 'Failed to process request',
          response: 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.'
        },
        { status: 500 }
      )
    }

    // Get response text first to check if it's valid JSON
    const responseText = await webhookResponse.text()
    console.log('Webhook raw response:', responseText)

    let webhookData;
    try {
      // Try to parse as JSON
      webhookData = JSON.parse(responseText)
    } catch (parseError) {
      console.log('Response is not JSON, treating as plain text')
      // If it's not JSON, treat the entire response as the message
      webhookData = { response: responseText }
    }

    // Extract response content
    let responseContent = webhookData.response || webhookData.message || webhookData.text || responseText

    // If still no content, provide fallback
    if (!responseContent || responseContent.trim() === '') {
      responseContent = 'I received your message but couldn\'t generate a proper response. Please try again.'
    }
    
    // Return response to client
    return NextResponse.json({
      response: responseContent,
      success: true,
    })

  } catch (error) {
    console.error('API route error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        response: 'I\'m experiencing technical difficulties. Please check your connection and try again.'
      },
      { status: 500 }
    )
  }
} 