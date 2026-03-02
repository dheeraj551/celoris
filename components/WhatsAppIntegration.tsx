'use client'

import { useState } from 'react'
import { createClientForBrowser } from '@/lib/supabase-client'

// Simple toast function
const toast = {
  success: (message: string) => {
    console.log('✅ Success:', message)
    alert(message)
  },
  error: (message: string) => {
    console.error('❌ Error:', message)
    alert('Error: ' + message)
  }
}

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { MessageCircle, Send, CheckCircle, XCircle } from 'lucide-react'

interface WhatsAppIntegrationProps {
  userPhone?: string
  onMessageSent?: (success: boolean, messageId?: string) => void
}

export default function WhatsAppIntegration({
  userPhone,
  onMessageSent
}: WhatsAppIntegrationProps) {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [phoneNumber, setPhoneNumber] = useState(userPhone || '')
  const [messageHistory, setMessageHistory] = useState<any[]>([])
  const [integrationStatus, setIntegrationStatus] = useState<'not_configured' | 'configured' | 'error'>('not_configured')

  useState(() => {
    // Get current user
    const supabase = createClientForBrowser()
    supabase.auth.getUser().then(({ data: { user } }: any) => {
      setUser(user)
    })
  })

  const sendWhatsAppMessage = async () => {
    if (!message.trim() || !phoneNumber) {
      toast.error('Please enter a message and phone number')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneNumber,
          message: message.trim(),
          userId: user?.id
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      toast.success('WhatsApp message sent successfully!')

      // Add to message history
      const newMessage = {
        id: data.messageId,
        phone: phoneNumber,
        message: message.trim(),
        status: 'sent',
        timestamp: new Date().toISOString()
      }

      setMessageHistory(prev => [newMessage, ...prev])
      setMessage('')

      if (onMessageSent) {
        onMessageSent(true, data.messageId)
      }

    } catch (error: any) {
      console.error('Error sending WhatsApp message:', error)
      toast.error(error.message || 'Failed to send WhatsApp message')

      if (onMessageSent) {
        onMessageSent(false)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const sendTestMessage = async () => {
    if (!phoneNumber) {
      toast.error('Please enter a phone number first')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneNumber,
          message: `Hello! This is a test message from the social platform. Your account: ${user?.user_metadata?.full_name || 'User'}`,
          isTest: true,
          userId: user?.id
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send test message')
      }

      toast.success('Test WhatsApp message sent!')

    } catch (error: any) {
      console.error('Error sending test message:', error)
      toast.error(error.message || 'Failed to send test message')
    } finally {
      setIsLoading(false)
    }
  }

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '')

    // Add country code if not present (assuming US/Canada)
    if (cleaned.length === 10) {
      return `+1${cleaned}`
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+${cleaned}`
    } else {
      return phone.startsWith('+') ? phone : `+${cleaned}`
    }
  }

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\+[1-9]\d{1,14}$/
    return phoneRegex.test(phone)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-green-600" />
          <span>WhatsApp Integration</span>
          <div className={`w-2 h-2 rounded-full ${integrationStatus === 'configured' ? 'bg-green-500' :
              integrationStatus === 'error' ? 'bg-red-500' :
                'bg-yellow-500'
            }`} />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Phone Number Input */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1234567890"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
            className={phoneNumber && !validatePhoneNumber(phoneNumber) ? 'border-red-500' : ''}
          />
          {phoneNumber && !validatePhoneNumber(phoneNumber) && (
            <p className="text-sm text-red-600">Please enter a valid phone number with country code</p>
          )}
        </div>

        {/* Message Input */}
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Type your WhatsApp message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            onClick={sendWhatsAppMessage}
            disabled={!message.trim() || !validatePhoneNumber(phoneNumber) || isLoading}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send WhatsApp Message
              </>
            )}
          </Button>

          <Button
            onClick={sendTestMessage}
            disabled={!validatePhoneNumber(phoneNumber) || isLoading}
            variant="outline"
            className="w-full"
          >
            Send Test Message
          </Button>
        </div>

        {/* Integration Status */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Integration Status</span>
            <div className="flex items-center space-x-1 text-sm">
              {integrationStatus === 'configured' && <CheckCircle className="w-4 h-4 text-green-600" />}
              {integrationStatus === 'error' && <XCircle className="w-4 h-4 text-red-600" />}
              <span className={
                integrationStatus === 'configured' ? 'text-green-600' :
                  integrationStatus === 'error' ? 'text-red-600' :
                    'text-yellow-600'
              }>
                {integrationStatus === 'configured' ? 'Configured' :
                  integrationStatus === 'error' ? 'Error' :
                    'Not Configured'}
              </span>
            </div>
          </div>

          {integrationStatus === 'not_configured' && (
            <p className="text-sm text-gray-600">
              WhatsApp integration is not configured. Contact administrator to set up WhatsApp Business API.
            </p>
          )}
        </div>

        {/* Message History */}
        {messageHistory.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Recent Messages</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {messageHistory.slice(0, 5).map((msg) => (
                <div key={msg.id} className="text-xs bg-gray-50 rounded p-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{msg.phone}</span>
                    <div className="flex items-center space-x-1">
                      {msg.status === 'sent' ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <XCircle className="w-3 h-3 text-red-600" />
                      )}
                      <span className={
                        msg.status === 'sent' ? 'text-green-600' : 'text-red-600'
                      }>
                        {msg.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 truncate">{msg.message}</p>
                  <span className="text-gray-500">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Usage Guidelines */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Use country code with phone numbers (e.g., +1234567890)</p>
          <p>• Messages are sent via WhatsApp Business API</p>
          <p>• Test with your own number to verify functionality</p>
          <p>• Perfect for account verification and notifications</p>
        </div>
      </CardContent>
    </Card>
  )
}