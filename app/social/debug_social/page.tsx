"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase-client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DebugPage() {
    const [users, setUsers] = useState<any[]>([])
    const [matches, setMatches] = useState<any[]>([])
    const [messages, setMessages] = useState<any[]>([])
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [testMessageStatus, setTestMessageStatus] = useState<string>("")

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            setCurrentUser(user)

            // Fetch all users
            const { data: usersData, error: usersError } = await supabase
                .from('users')
                .select('*')
                .limit(20)

            if (usersError) {
                console.error("Users Error:", usersError)
                setError(prev => (prev ? prev + "\n" : "") + "Users Error: " + usersError.message)
            } else {
                // Process avatars
                const processedUsers = (usersData as any[])?.map(u => {
                    let publicUrl = null
                    if (u.profile_pic_url) {
                        if (u.profile_pic_url.startsWith('http')) {
                            publicUrl = u.profile_pic_url
                        } else {
                            const { data } = supabase.storage
                                .from('avatars')
                                .getPublicUrl(u.profile_pic_url)
                            publicUrl = data.publicUrl
                        }
                    }
                    return { ...u, publicUrl }
                })
                setUsers(processedUsers || [])
            }

            if (user) {
                // Fetch Matches
                const { data: matchesData, error: matchesError } = await supabase
                    .from('matches')
                    .select('*')
                    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)

                if (matchesError) {
                    console.error("Matches Error:", matchesError)
                    setError(prev => (prev ? prev + "\n" : "") + "Matches Error: " + matchesError.message)
                } else {
                    setMatches((matchesData as any[]) || [])

                    // If matches exist, try to fetch messages for the first match
                    if (matchesData && matchesData.length > 0) {
                        const firstMatchId = (matchesData[0] as any).id
                        const { data: messagesData, error: messagesError } = await supabase
                            .from('messages')
                            .select('*')
                            .eq('match_id', firstMatchId)
                            .limit(10)

                        if (messagesError) {
                            console.error("Messages Error:", messagesError)
                            setError(prev => (prev ? prev + "\n" : "") + "Messages Error: " + messagesError.message)
                        } else {
                            setMessages((messagesData as any[]) || [])
                        }
                    }
                }
            }

        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const sendTestMessage = async (matchId: string) => {
        if (!currentUser) return
        setTestMessageStatus("Sending...")
        try {
            const supabase = createClient()
            const { data, error } = await (supabase
                .from('messages') as any)
                .insert({
                    match_id: matchId,
                    sender_id: currentUser.id,
                    content: "Test message from debug page " + new Date().toISOString(),
                    message_type: 'text'
                })
                .select()

            if (error) {
                setTestMessageStatus("Error: " + error.message)
                console.error("Send Message Error:", error)
            } else {
                setTestMessageStatus("Success! Message ID: " + (data && data[0]?.id))
                // Refresh messages
                const { data: messagesData } = await supabase
                    .from('messages')
                    .select('*')
                    .eq('match_id', matchId)
                    .limit(10)
                setMessages((messagesData as any[]) || [])
            }
        } catch (e: any) {
            setTestMessageStatus("Exception: " + e.message)
        }
    }

    if (loading) return <div className="p-8 text-white">Loading debug data...</div>

    return (
        <div className="min-h-screen bg-gray-900 p-8 text-white">
            <h1 className="text-2xl font-bold mb-4">Social Debugger</h1>

            {error && (
                <div className="bg-red-500/20 border border-red-500 p-4 rounded mb-4 text-red-200 whitespace-pre-wrap">
                    Error: {error}
                </div>
            )}

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Current User</h2>
                <pre className="bg-gray-800 p-4 rounded overflow-auto">
                    {JSON.stringify(currentUser, null, 2)}
                </pre>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Matches ({matches.length})</h2>
                <div className="grid gap-4">
                    {matches.map(m => (
                        <Card key={m.id} className="bg-gray-800 border-gray-700">
                            <CardContent className="p-4">
                                <div className="mb-2">Match ID: {m.id}</div>
                                <div className="mb-2">User 1: {m.user1_id}</div>
                                <div className="mb-2">User 2: {m.user2_id}</div>
                                <Button
                                    onClick={() => sendTestMessage(m.id)}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    Send Test Message
                                </Button>
                                {testMessageStatus && <div className="mt-2 text-yellow-400">{testMessageStatus}</div>}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Messages (First Match)</h2>
                <pre className="bg-gray-800 p-4 rounded overflow-auto max-h-96">
                    {JSON.stringify(messages, null, 2)}
                </pre>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">Users Table (First 20)</h2>
                <div className="grid gap-4">
                    {users.map(u => (
                        <Card key={u.id} className="bg-gray-800 border-gray-700">
                            <CardContent className="p-4">
                                <div className="flex gap-4">
                                    <div className="w-24 h-24 bg-gray-700 rounded flex-shrink-0 overflow-hidden">
                                        {u.publicUrl ? (
                                            <img
                                                src={u.publicUrl}
                                                alt={u.username}
                                                className="w-full h-full object-cover"
                                                onError={(e) => (e.currentTarget.style.border = '2px solid red')}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 overflow-hidden">
                                        <h3 className="font-bold text-lg">{u.full_name} (@{u.username})</h3>
                                        <div className="text-sm text-gray-400 font-mono mt-1">ID: {u.id}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
