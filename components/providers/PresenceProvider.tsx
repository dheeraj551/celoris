"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useAuth } from './AuthProvider'

interface PresenceContextType {
    onlineUsers: Set<string>
}

const PresenceContext = createContext<PresenceContextType>({
    onlineUsers: new Set()
})

export const usePresence = () => useContext(PresenceContext)

export function PresenceProvider({ children }: { children: React.ReactNode }) {
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
    const { user } = useAuth()
    const userId = user?.id

    useEffect(() => {
        if (!userId) return

        const supabase = createClient()

        // Create a presence channel
        const channel = supabase.channel('online-users', {
            config: {
                presence: {
                    key: userId,
                },
            },
        })

        channel
            .on('presence', { event: 'sync' }, () => {
                const newState = channel.presenceState()
                const users = new Set<string>()

                Object.keys(newState).forEach(key => {
                    users.add(key)
                })

                setOnlineUsers(users)
            })
            .on('presence', { event: 'join' }, ({ key, newPresences }: { key: string; newPresences: any[] }) => {
                setOnlineUsers(prev => {
                    const newSet = new Set(prev)
                    newSet.add(key)
                    return newSet
                })
            })
            .on('presence', { event: 'leave' }, ({ key, leftPresences }: { key: string; leftPresences: any[] }) => {
                setOnlineUsers(prev => {
                    const newSet = new Set(prev)
                    newSet.delete(key)
                    return newSet
                })
            })
            .subscribe(async (status: string) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({
                        online_at: new Date().toISOString(),
                    })
                }
            })

        return () => {
            channel.unsubscribe()
        }
    }, [userId])

    return (
        <PresenceContext.Provider value={{ onlineUsers }}>
            {children}
        </PresenceContext.Provider>
    )
}
