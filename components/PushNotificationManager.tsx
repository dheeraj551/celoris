'use client'

import { useEffect, useState } from 'react'
import { createClientForBrowser } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell, BellOff, Check, X } from 'lucide-react'

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

interface NotificationPermission {
  granted: boolean
  denied: boolean
  default: boolean
}

interface PushNotificationManagerProps {
  onNotificationReceived?: (notification: any) => void
}

export default function PushNotificationManager({
  onNotificationReceived
}: PushNotificationManagerProps) {
  const [user, setUser] = useState<any>(null)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(null)
  const [fcmToken, setFcmToken] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Get current user
    const supabase = createClientForBrowser()
    supabase.auth.getUser().then(({ data: { user } }: any) => {
      setUser(user)
    })

    // Check if push notifications are supported
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      checkPermission()
    }
  }, [])

  const checkPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return

    const permission = await Notification.requestPermission()
    setNotificationPermission({
      granted: permission === 'granted',
      denied: permission === 'denied',
      default: permission === 'default'
    })
  }

  const initializeFCM = async () => {
    if (!isSupported || !user) return

    setIsLoading(true)

    try {
      // Generate a mock FCM token for demo purposes
      const mockToken = `mock_fcm_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      setFcmToken(mockToken)

      // Register token with backend
      await registerToken(mockToken)

      // Simulate notification listener
      setTimeout(() => {
        const mockNotification = {
          notification: {
            title: 'Demo Notification',
            body: 'This is a demo push notification!'
          },
          data: { type: 'demo' }
        }

        if (onNotificationReceived) {
          onNotificationReceived(mockNotification)
        }

        showNotification(mockNotification)
      }, 1000)

      toast.success('Push notifications enabled!')
    } catch (error) {
      console.error('Error initializing FCM:', error)
      toast.error('Failed to enable push notifications')
    } finally {
      setIsLoading(false)
    }
  }

  const registerToken = async (token: string) => {
    try {
      const response = await fetch('/api/notifications/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          userId: user?.id,
          platform: 'web'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to register token')
      }

      console.log('✅ FCM token registered successfully')
    } catch (error) {
      console.error('Error registering FCM token:', error)
    }
  }

  const showNotification = (payload: any) => {
    if (typeof window === 'undefined' || !('Notification' in window)) return

    const { title, body, icon, badge } = payload.notification || {}

    const notification = new Notification(title || 'New Message', {
      body: body || 'You have a new notification',
      icon: icon || '/logo-default (2).png',
      badge: badge || '/logo-default (2).png',
      tag: payload.data?.type || 'general',
      requireInteraction: true
    })

    notification.onclick = () => {
      // Handle notification click
      window.focus()
      notification.close()
    }
  }

  const sendTestNotification = async () => {
    try {
      await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          title: 'Test Notification',
          body: 'This is a test notification from the social platform!',
          type: 'test'
        })
      })

      toast.success('Test notification sent!')
    } catch (error) {
      console.error('Error sending test notification:', error)
      toast.error('Failed to send test notification')
    }
  }

  const disableNotifications = async () => {
    if (fcmToken) {
      try {
        await fetch('/api/notifications/unregister', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: fcmToken,
            userId: user?.id
          })
        })
      } catch (error) {
        console.error('Error unregistering token:', error)
      }
    }

    setFcmToken(null)
    setNotificationPermission({
      granted: false,
      denied: true,
      default: false
    })

    toast.success('Push notifications disabled')
  }

  if (!isSupported) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <BellOff className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Push notifications are not supported in this browser</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="w-5 h-5" />
          <span>Push Notifications</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status</span>
            <div className={`flex items-center space-x-1 text-sm ${notificationPermission?.granted
                ? 'text-green-600'
                : notificationPermission?.denied
                  ? 'text-red-600'
                  : 'text-yellow-600'
              }`}>
              {notificationPermission?.granted && <Check className="w-4 h-4" />}
              {notificationPermission?.denied && <X className="w-4 h-4" />}
              <span>
                {notificationPermission?.granted
                  ? 'Enabled'
                  : notificationPermission?.denied
                    ? 'Blocked'
                    : 'Not Granted'}
              </span>
            </div>
          </div>

          {fcmToken && (
            <div className="text-xs text-gray-500 break-all">
              Token: {fcmToken.substring(0, 20)}...
            </div>
          )}
        </div>

        <div className="space-y-2">
          {!notificationPermission?.granted ? (
            <Button
              onClick={initializeFCM}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Enabling...
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 mr-2" />
                  Enable Notifications
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-2">
              <Button
                onClick={sendTestNotification}
                variant="outline"
                className="w-full"
              >
                Send Test Notification
              </Button>

              <Button
                onClick={disableNotifications}
                variant="destructive"
                size="sm"
                className="w-full"
              >
                <BellOff className="w-4 h-4 mr-2" />
                Disable Notifications
              </Button>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Get notified about new matches</p>
          <p>• Receive messages in real-time</p>
          <p>• Stay updated on profile activity</p>
        </div>
      </CardContent>
    </Card>
  )
}