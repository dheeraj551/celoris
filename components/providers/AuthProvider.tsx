"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-client"
import { User, Session } from "@supabase/supabase-js"

interface AuthContextType {
    user: User | null
    session: Session | null
    loading: boolean
    profile: any | null
    refreshProfile: () => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    loading: true,
    profile: null,
    refreshProfile: async () => { },
    signOut: async () => { },
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [profile, setProfile] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)

    const supabase = createClient()

    useEffect(() => {
        let mounted = true

        supabase.auth.getSession()
            .then(({ data: { session } }: any) => {
                if (!mounted) return
                setSession(session)
                setUser(session?.user ?? null)
                if (session?.user) {
                    fetchProfile(session.user.id)
                } else {
                    setLoading(false)
                }
            })
            .catch((error) => {
                console.error("Error getting session:", error)
                if (mounted) setLoading(false)
            })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!mounted) return
            setSession(session)
            setUser(session?.user ?? null)

            if (session?.user) {
                // Only fetch profile if not already loaded or if user changed
                // checking profile?.id !== session.user.id is tricky inside closure without ref, 
                // but fetchProfile handles it.
                fetchProfile(session.user.id)
            } else {
                setProfile(null)
                setLoading(false)
            }
        })

        return () => {
            mounted = false
            subscription.unsubscribe()
        }
    }, [])

    const fetchProfile = async (userId: string) => {
        try {
            const { data } = await supabase
                .from("users")
                .select("*")
                .eq("id", userId)
                .maybeSingle()

            if (data) {
                const profileAny = data as any
                if (profileAny.profile_pic_url) {
                    if (!profileAny.profile_pic_url.startsWith('http')) {
                        const { data: publicUrlData } = supabase.storage
                            .from('avatars')
                            .getPublicUrl(profileAny.profile_pic_url)
                        profileAny.profile_pic_url = publicUrlData.publicUrl
                    }
                    // Also maintain avatar_url for backward compatibility
                    profileAny.avatar_url = profileAny.profile_pic_url
                }
                setProfile(profileAny)
            }
        } catch (e) {
            console.error("Error loading profile", e)
        } finally {
            setLoading(false)
        }
    }

    const refreshProfile = async () => {
        if (user) await fetchProfile(user.id)
    }

    const signOut = async () => {
        await supabase.auth.signOut()
        setUser(null)
        setSession(null)
        setProfile(null)
        window.location.href = "/"
    }

    return (
        <AuthContext.Provider value={{ user, session, loading, profile, refreshProfile, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}
