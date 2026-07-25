import { useState } from "react"
import { router } from "@inertiajs/react"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"

import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { CreditCard, DollarSign, Eye, FileDown, MoreVertical, Pencil, QrCode, Trash2, Users } from "lucide-react"

import EditModal from "./EditModal"
import ViewModal from "./ViewModal"

export default function DataTable({ data }: any) {

    const [selected, setSelected] = useState<any>(null)
    const [viewOpen, setViewOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [showId, setShowId] = useState<Set<number>>(new Set())

    const toggleId = (id: number) => {
        setShowId(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id); else next.add(id)
            return next
        })
    }

    const truncateId = (id: string) => {
        if (id.length <= 16) return id
        return id.slice(0, 8) + '...' + id.slice(-4)
    }

    const deleteRecord = (id: number) => {
        if (confirm("Are you sure you want to delete this record?")) {
            router.delete(`/rsvps/${id}`, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setSelected(null)
                    setViewOpen(false)
                    setEditOpen(false)
                }
            })
        }
    }

    const StatusBadge = ({ status }: { status: string }) => {
        const map: any = {
            pending: "bg-amber-50 text-amber-700 border border-amber-200",
            confirmed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
            cancelled: "bg-red-50 text-red-700 border border-red-200",
        }
        return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${map[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        )
    }

    const PaymentMethodIcon = ({ provider }: { provider: string }) => {
        const colors: any = {
            stripe: "text-indigo-600",
            paypal: "text-blue-600",
        }
        return <CreditCard className={`w-3.5 h-3.5 ${colors[provider] || 'text-gray-500'}`} />
    }

    return (
        <div className="bg-card border rounded-xl overflow-hidden shadow-sm">

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="w-10">#</TableHead>
                            <TableHead className="min-w-[200px]">Name</TableHead>
                            <TableHead className="min-w-[130px]">Ticket</TableHead>
                            <TableHead className="min-w-[180px]">Payment</TableHead>
                            <TableHead>Guests</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="min-w-[100px]">Date</TableHead>
                            <TableHead className="w-12"></TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-16 text-muted-foreground">
                                    <div className="flex flex-col items-center gap-2">
                                        <Users className="w-8 h-8 text-muted-foreground/50" />
                                        <span className="text-sm font-medium">No RSVPs found</span>
                                        <span className="text-xs">Try adjusting your search or filters</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.data.map((item: any, i: number) => (
                                <TableRow key={item.id} className="group hover:bg-muted/30 transition-colors">

                                    <TableCell className="text-muted-foreground text-xs font-medium">
                                        {i + 1}
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#c9993a]/20 to-[#8a6b28]/20 flex items-center justify-center text-sm font-bold text-[#8a6b28] shrink-0">
                                                {item.name?.charAt(0)?.toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-semibold text-sm truncate">{item.name}</div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span className="truncate">{item.email}</span>
                                                    {item.phone && (
                                                        <>
                                                            <span className="text-muted-foreground/30">|</span>
                                                            <span className="truncate">{item.phone}</span>
                                                        </>
                                                    )}
                                                </div>
                                                {item.address && (
                                                    <div className="text-[11px] text-muted-foreground/70 truncate mt-0.5">
                                                        {item.address}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        {item.ticket_code ? (
                                            <div className="flex items-center gap-1.5">
                                                <QrCode className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                                                <span className="font-mono text-xs tracking-wider font-bold bg-muted px-2.5 py-1 rounded-md border">
                                                    {item.ticket_code}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground/50 italic">Not issued</span>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {item.payment ? (
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                                                        item.payment.status === "paid"
                                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                            : "bg-amber-50 text-amber-700 border border-amber-200"
                                                    }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${item.payment.status === "paid" ? "bg-emerald-500" : "bg-amber-500"}`} />
                                                        {item.payment.status}
                                                    </span>
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium capitalize border ${
                                                        item.payment.provider === "stripe"
                                                            ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                                            : "bg-blue-50 text-blue-700 border-blue-200"
                                                    }`}>
                                                        <PaymentMethodIcon provider={item.payment.provider} />
                                                        {item.payment.provider}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs font-semibold text-gray-700">
                                                    <DollarSign className="w-3 h-3" />
                                                    {item.payment.amount}
                                                </div>
                                                <button
                                                    onClick={() => toggleId(item.id)}
                                                    className="text-[10px] font-mono text-muted-foreground/60 hover:text-muted-foreground/90 transition-colors text-left cursor-pointer"
                                                >
                                                    ID: {showId.has(item.id)
                                                        ? item.payment.payment_id
                                                        : truncateId(item.payment.payment_id || '—')}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-muted-foreground/50 italic">No payment</span>
                                                {item.payment_type && (
                                                    <span className="text-[10px] text-muted-foreground/40">
                                                        Type: {item.payment_type}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border border-amber-200">
                                            <Users className="w-3 h-3" />
                                            {item.guests_count}
                                        </span>
                                    </TableCell>

                                    <TableCell>
                                        <StatusBadge status={item.status} />
                                    </TableCell>

                                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                        <div>{new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                        <div className="text-[10px] text-muted-foreground/50">{new Date(item.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align="end" className="w-52">

                                                <DropdownMenuItem onClick={() => { setSelected(item); setViewOpen(true) }}>
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View Details
                                                </DropdownMenuItem>

                                                <DropdownMenuItem onClick={() => { setSelected(item); setEditOpen(true) }}>
                                                    <Pencil className="w-4 h-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>

                                                <DropdownMenuItem onClick={() => window.open(`/rsvps/${item.id}/pdf`, '_blank')}>
                                                    <FileDown className="w-4 h-4 mr-2" />
                                                    Download PDF
                                                </DropdownMenuItem>

                                                <div className="border-t my-1" />

                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                    onClick={() => deleteRecord(item.id)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>

                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>

                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {selected && (
                <>
                    <ViewModal item={selected} open={viewOpen} setOpen={setViewOpen} />
                    <EditModal item={selected} open={editOpen} setOpen={setEditOpen} />
                </>
            )}
        </div>
    )
}

