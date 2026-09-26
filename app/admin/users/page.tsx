"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    ArrowLeft,
    Search,
    MoreHorizontal,
    Shield,
    CheckCircle,
    XCircle,
    User as UserIcon,
    Trash2,
    Wallet,
    Eye,
    EyeOff,
    Crown,
    SlidersHorizontal
} from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { MembershipPlanCard } from "@/components/admin/MembershipPlanCard"
import { SetPlanDialog, activeTier, TIER_STYLE, type MemberPlan, type TierInfo } from "@/components/admin/SetPlanDialog"
import type { PlanTier } from "@/lib/plan-features"
import { usePresence } from "@/components/providers/PresenceProvider"

interface User {
    id: string
    username: string
    full_name: string
    profile_pic_url?: string
    avatar_url?: string // Computed
    created_at: string
    verification_status?: string
    subscription_status?: string
    role?: string
    wallet_balance?: number
    is_social_blocked?: boolean
}

export default function UserManagementPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [blockingId, setBlockingId] = useState<string | null>(null)
    const [rechargeModalOpen, setRechargeModalOpen] = useState(false)
    const [rechargeAmount, setRechargeAmount] = useState("")
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [recharging, setRecharging] = useState(false)
    const [isSyncing, setIsSyncing] = useState(false)
    // Membership plans (Free / Basic / Pro / Max)
    const [plans, setPlans] = useState<Record<string, MemberPlan>>({})
    const [tiers, setTiers] = useState<TierInfo[]>([])
    const [planUser, setPlanUser] = useState<User | null>(null)
    const [planFilter, setPlanFilter] = useState<PlanTier | "all">("all")
    const router = useRouter()
    const { onlineUsers } = usePresence()

    useEffect(() => {
        checkAdminAuth()
    }, [])

    const handleSyncUsers = async () => {
        if (!confirm("This will attempt to sync all users from Auth to the public table. Continue?")) return

        setIsSyncing(true)
        try {
            const response = await fetch('/api/admin/users', { method: 'POST' })
            const result = await response.json()
            if (response.ok) {
                alert(`Success: ${result.message}`)
                fetchUsers() // Refresh the list
            } else {
                throw new Error(result.error || "Sync failed")
            }
        } catch (error: any) {
            alert(`Sync Error: ${error.message}`)
        } finally {
            setIsSyncing(false)
        }
    }

    const checkAdminAuth = async () => {
        try {
            const adminSession = localStorage.getItem("admin_session")

            if (!adminSession) {
                router.push("/admin/login")
                return
            }

            const session = JSON.parse(adminSession)

            // Check if session is valid (not older than 24 hours)
            const sessionAge = Date.now() - session.timestamp
            const maxAge = 24 * 60 * 60 * 1000 // 24 hours

            if (sessionAge > maxAge) {
                localStorage.removeItem("admin_session")
                router.push("/admin/login")
                return
            }

            setIsAuthenticated(true)
            fetchUsers()
        } catch (error) {
            console.error("Admin auth error:", error)
            router.push("/admin/login")
        }
    }

    const fetchPlans = async () => {
        try {
            const [plansRes, tiersRes] = await Promise.all([
                fetch('/api/admin/plans?list=1', { cache: 'no-store' }),
                fetch('/api/admin/plan-settings', { cache: 'no-store' }),
            ])
            if (plansRes.ok) {
                const { plans: rows } = await plansRes.json()
                const map: Record<string, MemberPlan> = {}
                for (const row of rows || []) map[row.user_id] = row
                setPlans(map)
            }
            if (tiersRes.ok) {
                const { tiers: t } = await tiersRes.json()
                setTiers((t || []).map((x: any) => ({ tier: x.tier, label: x.label, monthlyCredits: x.monthlyCredits })))
            }
        } catch (error) {
            console.error("Error fetching plans:", error)
        }
    }

    const fetchUsers = async () => {
        fetchPlans()
        try {
            const response = await fetch('/api/admin/users')
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to fetch users')
            }

            const { users: data } = await response.json()
            const supabase = createClient()

            // Process users to resolve avatar URLs
            const processedUsers = (data || []).map((user: any) => {
                let avatar_url = undefined
                if (user.profile_pic_url) {
                    if (user.profile_pic_url.startsWith('http')) {
                        avatar_url = user.profile_pic_url
                    } else {
                        const { data: publicUrlData } = supabase.storage
                            .from('avatars')
                            .getPublicUrl(user.profile_pic_url)
                        avatar_url = publicUrlData.publicUrl
                    }
                }
                return { ...user, avatar_url }
            })

            setUsers(processedUsers)
        } catch (error: any) {
            console.error("Error fetching users:", error)
            alert(`FETCH ERROR: ${error.message || 'Check API route'}`)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteUser = async (userId: string, userName: string) => {
        if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
            return
        }

        setDeletingId(userId)
        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to delete user')
            }

            // Remove user from local state
            setUsers(prev => prev.filter(u => u.id !== userId))
            alert('User deleted successfully')
        } catch (error) {
            console.error('Error deleting user:', error)
            alert(error instanceof Error ? error.message : 'Failed to delete user')
        } finally {
            setDeletingId(null)
        }
    }

    const handleToggleSocialBlock = async (user: User) => {
        setBlockingId(user.id)
        try {
            const newStatus = !user.is_social_blocked

            const response = await fetch('/api/admin/toggle-social-block', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    isBlocked: newStatus
                })
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to update user status')
            }

            // Update local state
            setUsers(users.map(u =>
                u.id === user.id
                    ? { ...u, is_social_blocked: newStatus }
                    : u
            ))

        } catch (error) {
            console.error('Error updating user:', error)
            alert('Failed to update user social visibility')
        } finally {
            setBlockingId(null)
        }
    }

    const openRechargeModal = (user: User) => {
        setSelectedUser(user)
        setRechargeAmount("")
        setRechargeModalOpen(true)
    }

    const handleRecharge = async () => {
        if (!selectedUser || !rechargeAmount || isNaN(parseFloat(rechargeAmount))) return;

        setRecharging(true)
        try {
            const response = await fetch('/api/admin/recharge-wallet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: selectedUser.id,
                    amount: parseFloat(rechargeAmount)
                })
            })

            if (!response.ok) throw new Error('Failed to recharge')

            const data = await response.json()

            setUsers(users.map(u =>
                u.id === selectedUser?.id
                    ? { ...u, wallet_balance: data.newBalance }
                    : u
            ))

            setRechargeModalOpen(false)
            alert('Wallet recharged successfully')
        } catch (error) {
            console.error('Error recharging wallet:', error)
            alert('Failed to recharge wallet')
        } finally {
            setRecharging(false)
        }
    }

    const filteredUsers = users.filter(user =>
        (planFilter === "all" || activeTier(plans[user.id]) === planFilter) && (
        user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    const tierLabel = (t: PlanTier) => tiers.find(x => x.tier === t)?.label || t

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-slate-300">Loading Users...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return null
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={() => router.push('/admin/dashboard')}
                            className="text-slate-400 hover:text-white hover:bg-slate-800"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-white">User Management (Social)</h1>
                            <p className="text-slate-400">Manage and monitor platform users</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/plans"
                            className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-amber-500/40 text-amber-300 hover:bg-amber-500/10 text-sm"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            <span>Plan settings</span>
                        </Link>
                        <Link
                            href="/admin/xp"
                            className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-lime-400/40 text-lime-300 hover:bg-lime-400/10 text-sm"
                        >
                            <span className="font-bold">XP</span>
                            <span>settings</span>
                        </Link>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSyncUsers}
                            disabled={isSyncing}
                            className="border-slate-700 text-slate-300 hover:bg-slate-800"
                        >
                            {isSyncing ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                    <span>Syncing...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span>Repair Database</span>
                                </div>
                            )}
                        </Button>
                        <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-slate-300">
                                {Array.from(onlineUsers).length} Online Now
                            </span>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <MembershipPlanCard />

                <Card className="bg-slate-800 border-slate-700 mb-8">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <Input
                                    placeholder="Search users by name, username or ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:ring-blue-500"
                                />
                            </div>
                            <select
                                value={planFilter}
                                onChange={(e) => setPlanFilter(e.target.value as PlanTier | "all")}
                                className="h-10 px-3 rounded-md bg-slate-900 border border-slate-700 text-white text-sm"
                                title="Filter by plan"
                            >
                                <option value="all">All plans</option>
                                {(["free", "basic", "pro", "max"] as PlanTier[]).map(t => (
                                    <option key={t} value={t}>{tierLabel(t)}</option>
                                ))}
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white">All Users ({users.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border border-slate-700 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-slate-900">
                                    <TableRow className="border-slate-700 hover:bg-slate-900">
                                        <TableHead className="text-slate-400">User</TableHead>
                                        <TableHead className="text-slate-400">Status</TableHead>
                                        <TableHead className="text-slate-400">Role</TableHead>
                                        <TableHead className="text-slate-400">Plan</TableHead>
                                        <TableHead className="text-slate-400">Wallet</TableHead>
                                        <TableHead className="text-slate-400">Joined</TableHead>
                                        <TableHead className="text-slate-400 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.length === 0 ? (
                                        <TableRow className="border-slate-700">
                                            <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                                                No users found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredUsers.map((user) => {
                                            const isOnline = onlineUsers.has(user.id)
                                            const isDeleting = deletingId === user.id
                                            const isBlocking = blockingId === user.id
                                            return (
                                                <TableRow key={user.id} className="border-slate-700 hover:bg-slate-750">
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative">
                                                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                                                                    {user.avatar_url ? (
                                                                        <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <span className="text-lg font-bold text-slate-400">
                                                                            {user.full_name?.charAt(0).toUpperCase() || '?'}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {isOnline && (
                                                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-slate-800 rounded-full"></div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-white">{user.full_name}</div>
                                                                <div className="text-sm text-slate-400">@{user.username}</div>
                                                                {user.is_social_blocked && (
                                                                    <div className="text-xs text-red-400 font-medium">Hidden from Social</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col gap-1">
                                                            {isOnline ? (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-400 w-fit">
                                                                    Online
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-700 text-slate-400 w-fit">
                                                                    Offline
                                                                </span>
                                                            )}
                                                            {user.verification_status === 'verified' && (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-400 w-fit">
                                                                    Verified
                                                                </span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-slate-300 capitalize">
                                                            {user.role || 'User'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        {(() => {
                                                            const p = plans[user.id]
                                                            const t = activeTier(p)
                                                            return (
                                                                <button
                                                                    onClick={() => setPlanUser(user)}
                                                                    className="flex flex-col items-start gap-0.5 text-left"
                                                                    title="Change plan"
                                                                >
                                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${TIER_STYLE[t]}`}>
                                                                        {tierLabel(t)}
                                                                    </span>
                                                                    {t !== "free" && (
                                                                        <span className="text-[11px] text-slate-400">
                                                                            {p?.expires_at ? `until ${new Date(p.expires_at).toLocaleDateString()}` : "no end date"}
                                                                        </span>
                                                                    )}
                                                                    {t === "free" && p && p.plan_tier !== "free" && (
                                                                        <span className="text-[11px] text-red-400">{tierLabel(p.plan_tier)} expired</span>
                                                                    )}
                                                                </button>
                                                            )
                                                        })()}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-emerald-400 font-medium">
                                                            ₹{user.wallet_balance?.toFixed(2) || '0.00'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-slate-400">
                                                            {new Date(user.created_at).toLocaleDateString()}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className={`${user.is_social_blocked
                                                                    ? "text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                                                    : "text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                                                                    }`}
                                                                onClick={() => handleToggleSocialBlock(user)}
                                                                disabled={isBlocking}
                                                                title={user.is_social_blocked ? "Show on Social" : "Hide from Social"}
                                                            >
                                                                {isBlocking ? (
                                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                                                ) : user.is_social_blocked ? (
                                                                    <EyeOff className="w-4 h-4" />
                                                                ) : (
                                                                    <Eye className="w-4 h-4" />
                                                                )}
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-amber-400 hover:text-amber-300 hover:bg-amber-900/20"
                                                                onClick={() => setPlanUser(user)}
                                                                title="Set plan"
                                                            >
                                                                <Crown className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20"
                                                                onClick={() => openRechargeModal(user)}
                                                            >
                                                                <Wallet className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                                                onClick={() => handleDeleteUser(user.id, user.full_name)}
                                                                disabled={isDeleting}
                                                            >
                                                                {isDeleting ? (
                                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
                                                                ) : (
                                                                    <Trash2 className="w-4 h-4" />
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>


            <SetPlanDialog
                open={!!planUser}
                onOpenChange={(open) => { if (!open) setPlanUser(null) }}
                member={planUser ? { id: planUser.id, name: planUser.full_name || planUser.username || "member" } : null}
                current={planUser ? plans[planUser.id] || null : null}
                tiers={tiers}
                onSaved={({ plan, creditsAdded, walletBalance }) => {
                    setPlans(prev => ({ ...prev, [plan.user_id]: { ...prev[plan.user_id], ...plan } }))
                    if (walletBalance !== null) {
                        setUsers(prev => prev.map(u => u.id === plan.user_id ? { ...u, wallet_balance: walletBalance } : u))
                    }
                    alert(
                        plan.plan_tier === "free"
                            ? "Plan removed."
                            : `Saved: now on ${tierLabel(plan.plan_tier)}.${creditsAdded > 0 ? ` ${creditsAdded.toLocaleString("en-IN")} credits added to their wallet.` : ""}`
                    )
                }}
            />

            <Dialog open={rechargeModalOpen} onOpenChange={setRechargeModalOpen}>
                <DialogContent className="bg-slate-800 border-slate-700 text-white">

                    <DialogHeader>
                        <DialogTitle>Recharge Wallet</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Add funds to {selectedUser?.full_name}'s wallet.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                                Amount (₹)
                            </Label>
                            <Input
                                id="amount"
                                type="number"
                                value={rechargeAmount}
                                onChange={(e) => setRechargeAmount(e.target.value)}
                                className="col-span-3 bg-slate-900 border-slate-700 text-white"
                                placeholder="Enter amount..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={handleRecharge}
                            disabled={recharging}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            {recharging ? "Processing..." : "Recharge"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    )
}
