"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, RefreshCw, Upload, FileSpreadsheet } from "lucide-react"

type Lead = {
    id?: string
    name: string
    course?: string
    mode?: string
    requirement?: string
    location?: string
    budget?: string
    contact_info?: string
    status: 'open' | 'contacted' | 'closed'
    source: string
}

export default function LeadSync() {
    const [syncUrl, setSyncUrl] = useState("")
    const [pasteData, setPasteData] = useState("")
    const [isSyncing, setIsSyncing] = useState(false)
    const { toast } = useToast()

    const handleUrlSync = async () => {
        if (!syncUrl) return
        setIsSyncing(true)
        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'sync_url', payload: { url: syncUrl } })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Sync failed")

            toast({ title: "Sync Successful", description: `Imported ${data.count} leads from sheet.` })
            // Note: Since this is on admin dashboard, we don't necessarily need to refresh a local list unless we show it here.
        } catch (error: any) {
            toast({
                title: "Sync Failed",
                description: error.message || "Could not fetch data. check your URL or Database.",
                variant: "destructive"
            })
        } finally {
            setIsSyncing(false)
        }
    }

    const handleManualImport = async () => {
        if (!pasteData) return
        setIsSyncing(true)
        try {
            const rows = pasteData.split('\n').filter(r => r.trim().length > 0)
            const parsedLeads: Lead[] = rows.map(row => {
                return {
                    name: "Imported Lead",
                    requirement: row,
                    status: 'open',
                    source: 'manual_paste'
                }
            })

            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'manual_import', payload: { data: parsedLeads } })
            })
            if (!res.ok) throw new Error("Import failed")
            toast({ title: "Import Successful", description: `Added ${parsedLeads.length} leads.` })
            setPasteData("")
        } catch (error) {
            toast({ title: "Import Failed", description: "Could not save leads.", variant: "destructive" })
        } finally {
            setIsSyncing(false)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wide gap-2">
                    <RefreshCw size={16} /> Sync Leads
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0d1321] border-slate-800 text-slate-200">
                <DialogHeader>
                    <DialogTitle>Sync Leads</DialogTitle>
                    <DialogDescription>Import leads from Google Sheets or Paste data manually.</DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="sheet" className="w-full">
                    <TabsList className="bg-slate-900 w-full">
                        <TabsTrigger value="sheet" className="flex-1">Google Sheet</TabsTrigger>
                        <TabsTrigger value="paste" className="flex-1">Manual Paste</TabsTrigger>
                    </TabsList>
                    <TabsContent value="sheet" className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-500">Google Sheet CSV URL</label>
                            <Input
                                placeholder="https://docs.google.com/.../pub?output=csv"
                                value={syncUrl}
                                onChange={(e) => setSyncUrl(e.target.value)}
                                className="bg-slate-950 border-slate-800 focus:border-emerald-500"
                            />
                            <p className="text-[10px] text-slate-500">
                                In Google Sheets: File {'>'} Share {'>'} Publish to web {'>'} Select Sheet & CSV Format
                            </p>
                        </div>
                        <Button onClick={handleUrlSync} disabled={isSyncing} className="w-full bg-emerald-600">
                            {isSyncing ? <Loader2 className="animate-spin" /> : <FileSpreadsheet className="mr-2 h-4 w-4" />}
                            {isSyncing ? "Syncing..." : "Sync Now"}
                        </Button>
                    </TabsContent>
                    <TabsContent value="paste" className="space-y-4 pt-4">
                        <Textarea
                            placeholder="Paste lead data here..."
                            value={pasteData}
                            onChange={(e) => setPasteData(e.target.value)}
                            className="min-h-[150px] bg-slate-950 border-slate-800 focus:border-emerald-500"
                        />
                        <Button onClick={handleManualImport} disabled={isSyncing} className="w-full bg-emerald-600">
                            {isSyncing ? <Loader2 className="animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                            Import Data
                        </Button>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
