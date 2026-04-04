import { Head, usePage, router } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import {
    Users, UserCheck, Calendar, TrendingUp,
    FileDown, Search
} from "lucide-react"

import {
    Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"

import CreateModal from './CreateModal'
import RsvpTable from './DataTable'
import { toast } from 'sonner'

export default function RsvpsIndex() {

    const { stats, recent, filters, flash } = usePage().props as any

    const [search, setSearch] = useState(filters?.search || '')
    const [status, setStatus] = useState(filters?.status || 'all')
    const [from, setFrom] = useState(filters?.from || '')
    const [to, setTo] = useState(filters?.to || '')

    const handleFilter = () => {
        router.get('/rsvps', {
            search,
            status: status !== 'all' ? status : '',
            from,
            to
        }, {
            preserveState: true,
            preserveScroll: true
        })
    }

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.success, flash?.error]);

    return (
        <>
            <Head title="RSVPs" />

            <div className="p-6 space-y-8">

                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">RSVP Manager</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage all your rsvp responses
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                const params = new URLSearchParams({
                                    search,
                                    status: status !== 'all' ? status : '',
                                    from,
                                    to
                                }).toString();

                                window.open(`/rsvps/export/pdf?${params}`, '_blank');
                            }}
                        >
                            <FileDown className="w-4 h-4 mr-2" />
                            Export PDF
                        </Button>

                        <CreateModal />
                    </div>
                </div>

                {/* STATS */}
                <div className="grid gap-4 md:grid-cols-4">
                    <StatCard title="Total RSVPs" value={stats.total_rsvps} icon={Users} variant="blue" />
                    <StatCard title="Guests" value={stats.total_guests} icon={UserCheck} variant="green" />
                    <StatCard title="Today" value={stats.today_rsvps} icon={Calendar} variant="amber" />
                    <StatCard title="Confirmed" value={stats.confirmed_rsvps} icon={UserCheck} variant="purple" />
                </div>

                {/* FILTER */}
                <Card>
                    <CardContent  >
                        <div className="flex flex-wrap items-center gap-2  p-2 rounded-xl">

                            {/* SEARCH */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 h-9 w-[180px]"
                                />
                            </div>

                            {/* STATUS */}
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="h-9 w-[140px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* FROM DATE */}
                            <Input
                                type="date"
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                className="h-9 w-[150px]"
                            />

                            {/* TO DATE */}
                            <Input
                                type="date"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                className="h-9 w-[150px]"
                            />

                            {/* ACTION BUTTONS */}
                            <div className="flex items-center gap-2 ml-auto">

                                <Button size="sm" onClick={handleFilter}>
                                    Apply
                                </Button>

                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        setSearch('')
                                        setStatus('all')
                                        setFrom('')
                                        setTo('')
                                        router.get('/rsvps')
                                    }}
                                >
                                    Reset
                                </Button>
                            </div>

                        </div>


                    </CardContent>
                </Card>

                {/* TABLE COMPONENT */}
                <RsvpTable data={recent} />

            </div>
        </>
    )
}

function StatCard({ title, value, icon: Icon, variant }: any) {

    const variants: any = {
        blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    };

    return (
        <div className="bg-card border rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200">

            {/* LEFT */}
            <div>
                <p className="text-sm text-muted-foreground">
                    {title}
                </p>

                <h2 className="text-3xl font-semibold mt-1 tracking-tight">
                    {value}
                </h2>
            </div>

            {/* ICON */}
            <div className={`p-3 rounded-xl ${variants[variant]}`}>
                <Icon className="w-5 h-5" />
            </div>

        </div>
    );
}
