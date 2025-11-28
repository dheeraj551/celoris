'use client'

import { useState, useEffect, useRef } from 'react'
import { createClientForBrowser } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Monitor,
  Volume2,
  VolumeX
} from 'lucide-react'

// Simple toast function
const toast = {
  success: (message: string) => {
    console.log('✅ Success:', message)
    alert(message) // Simple fallback
  },
  error: (message: string) => {
    console.error('❌ Error:', message)
    alert('Error: ' + message) // Simple fallback
  },
  info: (message: string) => {
    console.log('ℹ️ Info:', message)
    alert(message) // Simple fallback
  }
}

// Agora RTC types
declare global {
  interface Window {
    AgoraRTC: any;
  }
}

interface CallParticipant {
  uid: string
  audioTrack?: any
  videoTrack?: any
  user?: any
}

interface CallManagerProps {
  matchId: string
  otherUserId: string
  onCallEnd?: () => void
}

export default function CallManager({ matchId, otherUserId, onCallEnd }: CallManagerProps) {
  const [isCallActive, setIsCallActive] = useState(false)
  const [localVideoTrack, setLocalVideoTrack] = useState<any>(null)
  const [localAudioTrack, setLocalAudioTrack] = useState<any>(null)
  const [remoteUsers, setRemoteUsers] = useState<CallParticipant[]>([])
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected')
  
  const clientRef = useRef<any>(null)
  const localVideoRef = useRef<HTMLDivElement>(null)
  const remoteVideoRef = useRef<HTMLDivElement>(null)
  const callTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true)

  // Load Agora SDK script
  useEffect(() => {
    const loadAgoraScript = () => {
      if (typeof window === 'undefined') return;
      
      if (window.AgoraRTC) {
        initializeAgora()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/agora-rtc-sdk-ng@4.19.0/AgoraRTC_N.js'
      script.async = true
      script.onload = () => {
        if (isMountedRef.current) {
          initializeAgora()
        }
      }
      script.onerror = () => {
        console.error('Failed to load Agora SDK')
        toast.error('Failed to load video calling service')
      }
      document.head.appendChild(script)

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script)
        }
      }
    }

    loadAgoraScript()

    return () => {
      isMountedRef.current = false
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current)
      }
      leaveCall()
    }
  }, [])

  const initializeAgora = async () => {
    try {
      const AgoraRTC = window.AgoraRTC
      if (!AgoraRTC) {
        throw new Error('Agora SDK not loaded')
      }

      // Get Agora app ID from environment or use test ID
      const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID || 'test-app-id'
      
      // Create Agora client instance
      const client = AgoraRTC.createClient({
        mode: 'rtc',
        codec: 'vp8'
      })
      
      clientRef.current = client

      // Set up event listeners
      client.on('user-published', handleUserPublished)
      client.on('user-unpublished', handleUserUnpublished)
      client.on('user-joined', handleUserJoined)
      client.on('user-left', handleUserLeft)
      client.on('connection-state-change', (curState: string) => {
        console.log('Agora connection state:', curState)
        if (isMountedRef.current) {
          setConnectionState(curState === 'CONNECTED' ? 'connected' : 
                           curState === 'CONNECTING' ? 'connecting' : 'disconnected')
        }
      })

      console.log('✅ Agora SDK initialized successfully')
    } catch (error) {
      console.error('Error initializing Agora:', error)
      toast.error('Failed to initialize video calling service')
    }
  }

  const handleUserPublished = async (user: any, mediaType: string) => {
    try {
      if (!clientRef.current) return

      await clientRef.current.subscribe(user, mediaType)
      
      if (mediaType === 'video') {
        const remoteVideoTrack = user.videoTrack
        if (remoteVideoRef.current && isMountedRef.current) {
          remoteVideoTrack.play(remoteVideoRef.current)
        }
      }
      
      if (mediaType === 'audio') {
        const remoteAudioTrack = user.audioTrack
        remoteAudioTrack.play()
      }

      setRemoteUsers(prev => {
        const existing = prev.find(p => p.uid === user.uid)
        if (existing) {
          return prev.map(p => 
            p.uid === user.uid 
              ? { ...p, [mediaType === 'video' ? 'videoTrack' : 'audioTrack']: user[mediaType + 'Track'] }
              : p
          )
        } else {
          return [...prev, { 
            uid: user.uid, 
            [mediaType === 'video' ? 'videoTrack' : 'audioTrack']: user[mediaType + 'Track'],
            user 
          }]
        }
      })
    } catch (error) {
      console.error('Error handling user published:', error)
    }
  }

  const handleUserUnpublished = (user: any, mediaType: string) => {
    setRemoteUsers(prev => prev.filter(p => p.uid !== user.uid))
  }

  const handleUserJoined = (user: any) => {
    console.log('User joined call:', user.uid)
  }

  const handleUserLeft = (user: any) => {
    console.log('User left call:', user.uid)
    setRemoteUsers(prev => prev.filter(p => p.uid !== user.uid))
    if (remoteUsers.length === 1) {
      toast.info('Other user left the call')
      endCall()
    }
  }

  const joinCall = async (isVideoCall: boolean = true) => {
    if (!clientRef.current) return

    try {
      setConnectionState('connecting')
      const AgoraRTC = window.AgoraRTC

      // Get channel token from your backend
      const response = await fetch('/api/agora/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelName: matchId,
          uid: 'user-id', // Would be actual user ID
          role: 'publisher'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get Agora token')
      }

      const { token } = await response.json()

      // Join channel
      await clientRef.current.join(
        process.env.NEXT_PUBLIC_AGORA_APP_ID || 'test-app-id',
        matchId,
        token,
        'user-id' // Would be actual user ID
      )

      // Create local tracks
      if (isVideoCall) {
        const videoTrack = await AgoraRTC.createCameraVideoTrack()
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack()
        
        setLocalVideoTrack(videoTrack)
        setLocalAudioTrack(audioTrack)
        
        if (localVideoRef.current && isMountedRef.current) {
          videoTrack.play(localVideoRef.current)
        }
        
        // Publish tracks
        await clientRef.current.publish([videoTrack, audioTrack])
      } else {
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack()
        setLocalAudioTrack(audioTrack)
        await clientRef.current.publish([audioTrack])
      }

      setIsCallActive(true)
      setConnectionState('connected')
      
      // Start call duration timer
      callTimerRef.current = setInterval(() => {
        if (isMountedRef.current) {
          setCallDuration(prev => prev + 1)
        }
      }, 1000)

      toast.success(isVideoCall ? 'Video call started' : 'Voice call started')
    } catch (error) {
      console.error('Error joining call:', error)
      setConnectionState('disconnected')
      toast.error('Failed to join call')
    }
  }

  const leaveCall = async () => {
    if (!clientRef.current) return

    try {
      // Stop and close local tracks
      if (localVideoTrack) {
        localVideoTrack.stop()
        localVideoTrack.close()
        setLocalVideoTrack(null)
      }
      
      if (localAudioTrack) {
        localAudioTrack.stop()
        localAudioTrack.close()
        setLocalAudioTrack(null)
      }

      // Leave channel
      await clientRef.current.leave()
      
      setIsCallActive(false)
      setRemoteUsers([])
      setConnectionState('disconnected')
      
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current)
        callTimerRef.current = null
      }
      setCallDuration(0)

      console.log('✅ Left call successfully')
    } catch (error) {
      console.error('Error leaving call:', error)
    }
  }

  const endCall = async () => {
    await leaveCall()
    if (onCallEnd) onCallEnd()
  }

  const toggleVideo = async () => {
    if (!localVideoTrack) return

    try {
      if (isVideoEnabled) {
        await localVideoTrack.setEnabled(false)
        setIsVideoEnabled(false)
      } else {
        await localVideoTrack.setEnabled(true)
        setIsVideoEnabled(true)
      }
    } catch (error) {
      console.error('Error toggling video:', error)
    }
  }

  const toggleAudio = async () => {
    if (!localAudioTrack) return

    try {
      if (isAudioEnabled) {
        await localAudioTrack.setEnabled(false)
        setIsAudioEnabled(false)
      } else {
        await localAudioTrack.setEnabled(true)
        setIsAudioEnabled(true)
      }
    } catch (error) {
      console.error('Error toggling audio:', error)
    }
  }

  const toggleScreenShare = async () => {
    if (!clientRef.current || !localVideoTrack) return

    try {
      if (!isScreenSharing) {
        const AgoraRTC = window.AgoraRTC
        const screenTrack = await AgoraRTC.createScreenVideoTrack()
        
        await clientRef.current.unpublish([localVideoTrack])
        await clientRef.current.publish([screenTrack])
        setLocalVideoTrack(screenTrack)
        setIsScreenSharing(true)
        
        screenTrack.on('track-ended', () => {
          // Screen share ended, revert to camera
          toggleScreenShare()
        })
      } else {
        const AgoraRTC = window.AgoraRTC
        const cameraTrack = await AgoraRTC.createCameraVideoTrack()
        
        await clientRef.current.unpublish([localVideoTrack])
        await clientRef.current.publish([cameraTrack])
        setLocalVideoTrack(cameraTrack)
        setIsScreenSharing(false)
        
        if (localVideoRef.current && isMountedRef.current) {
          cameraTrack.play(localVideoRef.current)
        }
      }
    } catch (error) {
      console.error('Error toggling screen share:', error)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            {isCallActive ? `Call (${formatDuration(callDuration)})` : 'Start a Call'}
          </span>
          <div className={`w-3 h-3 rounded-full ${
            connectionState === 'connected' ? 'bg-green-500' :
            connectionState === 'connecting' ? 'bg-yellow-500 animate-pulse' :
            'bg-red-500'
          }`} />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Video Area */}
        {isCallActive && (
          <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video">
            {/* Remote Video */}
            <div 
              ref={remoteVideoRef}
              className="w-full h-full"
            />
            
            {/* Local Video (Picture-in-Picture) */}
            {isVideoEnabled && (
              <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
                <div 
                  ref={localVideoRef}
                  className="w-full h-full"
                />
              </div>
            )}
            
            {/* No Remote Video Message */}
            {isCallActive && remoteUsers.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Volume2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p>Waiting for other user to join...</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Call Controls */}
        <div className="flex justify-center space-x-4">
          {!isCallActive ? (
            <>
              <Button 
                onClick={() => joinCall(true)}
                disabled={connectionState === 'connecting'}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Video className="w-5 h-5 mr-2" />
                Video Call
              </Button>
              <Button 
                onClick={() => joinCall(false)}
                disabled={connectionState === 'connecting'}
                variant="outline"
              >
                <Phone className="w-5 h-5 mr-2" />
                Voice Call
              </Button>
            </>
          ) : (
            <>
              {/* Video Toggle */}
              <Button 
                onClick={toggleVideo}
                variant={isVideoEnabled ? "default" : "destructive"}
                size="lg"
              >
                {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </Button>

              {/* Audio Toggle */}
              <Button 
                onClick={toggleAudio}
                variant={isAudioEnabled ? "default" : "destructive"}
                size="lg"
              >
                {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </Button>

              {/* Screen Share */}
              <Button 
                onClick={toggleScreenShare}
                variant={isScreenSharing ? "default" : "outline"}
                size="lg"
              >
                <Monitor className="w-5 h-5" />
              </Button>

              {/* End Call */}
              <Button 
                onClick={endCall}
                variant="destructive"
                size="lg"
              >
                <PhoneOff className="w-5 h-5" />
              </Button>
            </>
          )}
        </div>

        {/* Call Status */}
        {isCallActive && (
          <div className="text-center text-sm text-gray-600">
            <p>
              {connectionState === 'connected' ? 'Connected' : 
               connectionState === 'connecting' ? 'Connecting...' : 
               'Disconnected'}
            </p>
            <p>{remoteUsers.length} participant(s) in call</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}