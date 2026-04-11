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
            .catch((error: any) => {
                console.error("Error getting session:", error)
                // If it's a fatal auth error (like missing refresh token), clear the state
                if (error.message?.includes("Refresh Token Not Found") || error.code === "refresh_token_not_found") {
                    supabase.auth.signOut().then(() => {
                        if (mounted) {
                            setSession(null)
                            setUser(null)
                            setProfile(null)
                            setLoading(false)
                        }
                    })
                } else if (mounted) {
                    setLoading(false)
                }
            })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
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
            // Fetch from 'users' table (basic sync)
            const { data: userData } = await supabase
                .from("users")
                .select("*")
                .eq("id", userId)
                .maybeSingle()

            // Fetch from 'profiles' table (detailed info)
            const { data: profileData } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", userId)
                .maybeSingle()

            // Merge data (profiles takes precedence for shared fields like full_name)
            if (userData || profileData) {
                const mergedProfile = { ...userData, ...profileData }
                
                if (mergedProfile.profile_pic_url || mergedProfile.avatar_url) {
                    const picPath = mergedProfile.profile_pic_url || mergedProfile.avatar_url
                    if (picPath && !picPath.startsWith('http')) {
                        const { data: publicUrlData } = supabase.storage
                            .from('avatars')
                            .getPublicUrl(picPath)
                        mergedProfile.profile_pic_url = publicUrlData.publicUrl
                    }
                    // Also maintain avatar_url for backward compatibility
                    mergedProfile.avatar_url = mergedProfile.profile_pic_url
                }
                setProfile(mergedProfile)
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
