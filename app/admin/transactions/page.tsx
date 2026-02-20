"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { ArrowLeft, ArrowRight, DollarSign, Search, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"

interface Transaction {
    id: string
    amount: number
    type: 'credit' | 'debit'
    description: string
    created_at: string
    users: {
        full_name: string
        email: string
    } | null
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const limit = 20
    const router = useRouter()

    useEffect(() => {
        fetchTransactions()
    }, [page])

    const fetchTransactions = async () => {
        setLoading(true)
        try {
            const offset = (page - 1) * limit
            const response = await fetch(`/api/admin/transactions?limit=${limit}&offset=${offset}`, { cache: 'no-store' })
            const data = await response.json()
            setTransactions(data.data || [])
            if (data.count) {
                setTotalPages(Math.ceil(data.count / limit))
            }
        } catch (error) {
            console.error('Error fetching transactions:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredTransactions = transactions.filter(t =>
        t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.users?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.users?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-slate-900 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="text-white" onClick={() => router.push('/admin/dashboard')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                            <Plus className="w-8 h-8 text-emerald-500" />
                            Credit Transactions
                        </h1>
                    </div>
                </div>

                <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-white">Transaction Logs</CardTitle>
                            <div className="relative w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search transactions..."
                                    className="pl-8 bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center text-slate-400 py-8">Loading transactions...</div>
                        ) : (
                            <div className="space-y-4">
                                <div className="rounded-md border border-slate-700">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-slate-700 hover:bg-slate-800">
                                                <TableHead className="text-slate-300">Date</TableHead>
                                                <TableHead className="text-slate-300">User</TableHead>
                                                <TableHead className="text-slate-300">Type</TableHead>
                                                <TableHead className="text-slate-300">Amount</TableHead>
                                                <TableHead className="text-slate-300">Description</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredTransactions.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                                                        No transactions found
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredTransactions.map((transaction) => (
                                                    <TableRow key={transaction.id} className="border-slate-700 hover:bg-slate-750">
                                                        <TableCell className="text-slate-300">
                                                            {new Date(transaction.created_at).toLocaleString()}
                                                        </TableCell>
                                                        <TableCell className="text-white">
                                                            <div className="flex flex-col">
                                                                <span className="font-medium">{transaction.users?.full_name || 'Unknown User'}</span>
                                                                <span className="text-xs text-slate-500">{transaction.users?.email}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant={transaction.type === 'credit' ? 'default' : 'secondary'}
                                                                className={transaction.type === 'credit' ? 'bg-green-600' : 'bg-red-600'}
                                                            >
                                                                {transaction.type.toUpperCase()}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className={`font-bold ${transaction.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                                                            {transaction.type === 'credit' ? '+' : '-'}{transaction.amount}
                                                        </TableCell>
                                                        <TableCell className="text-slate-300 max-w-md truncate" title={transaction.description}>
                                                            {transaction.description}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Pagination */}
                                <div className="flex items-center justify-between mt-4">
                                    <div className="text-sm text-slate-400">
                                        Page {page} of {totalPages}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className="border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-50"
                                        >
                                            <ArrowLeft className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                            className="border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-50"
                                        >
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
