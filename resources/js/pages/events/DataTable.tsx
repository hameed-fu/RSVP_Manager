import { useState } from "react"
import { router } from "@inertiajs/react"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"

import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, Eye, MoreVertical, Pencil, Trash2, XCircle } from "lucide-react"

import EditModal from "./EditModal"
import ViewModal from "./ViewModal"

export default function DataTable({ data }: any) {

    const [selected, setSelected] = useState<any>(null)
    const [viewOpen, setViewOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)

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
        const statusMap: any = {
            pending: "bg-yellow-100 text-yellow-800",
            confirmed: "bg-green-100 text-green-800",
            cancelled: "bg-red-100 text-red-800"
        }

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusMap[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        )
    }

    return (
        <div className="bg-card border rounded-xl overflow-hidden">

            {/* TABLE */}
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Guests</TableHead>
                            <TableHead>Status</TableHead>
                            {/* <TableHead>Payment</TableHead> */}
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        
                        {data.data.map((item: any, i: number) => (
                            <TableRow key={item.id}>

                                <TableCell>{i + 1}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.phone}</TableCell>
                                <TableCell>{item.email}</TableCell>
                                <TableCell>{item.guests_count}</TableCell>
                                <TableCell><StatusBadge status={item.status} /></TableCell>
                                {/* <TableCell className="justify-center">
                                    {item.payment ? (
                                        <div className="flex flex-col gap-1 ">
                                            <div className="space-x-1">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize w-fit ${item.payment.status === "paid"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                    }`}>
                                                    {item.payment.status}
                                                </span>

                                                <span className={`text-xs text-gray-500  ${item.payment.provider === "stripe" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-700"} px-2 py-1 rounded-full w-fit capitalize`}>
                                                    {item.payment.provider}
                                                </span>
                                            </div>

                                            <div className="text-xs font-medium text-center">
                                                ${item.payment.amount}
                                            </div>

                                        </div>
                                    ) : (
                                        <span className="text-gray-400 text-xs">No Payment</span>
                                    )}
                                </TableCell> */}
                                <TableCell>
                                    {new Date(item.created_at).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </TableCell>

                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="icon" variant="ghost">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end" className="w-48">

                                            {/* VIEW */}
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    setSelected(item)
                                                    setViewOpen(true)
                                                }}
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                View
                                            </DropdownMenuItem>

                                            {/* EDIT */}
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    setSelected(item)
                                                    setEditOpen(true)
                                                }}
                                            >
                                                <Pencil className="w-4 h-4 mr-2" />
                                                Edit
                                            </DropdownMenuItem>



                                            <DropdownMenuItem
                                                className="text-red-600 focus:text-red-600"
                                                onClick={() => deleteRecord(item.id)}
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>

                                            {/* ===== STATUS ACTIONS ===== */}
                                                {/* {item.status !== "confirmed" && (
                                                    <>
                                                        <div className="border-t my-1"></div>

                                                        
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                router.patch(`/rsvps/${item.id}/status`, {
                                                                    status: "confirmed",
                                                                })
                                                            }
                                                            className="text-green-600"
                                                        >
                                                            <CheckCircle /> <span className="ml-2">Mark as Confirmed</span>
                                                        </DropdownMenuItem>

                                                    
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                router.patch(`/rsvps/${item.id}/status`, {
                                                                    status: "pending",
                                                                })
                                                            }
                                                        >
                                                            <Clock /> <span className="ml-2">Mark as Pending</span>
                                                        </DropdownMenuItem>

                                                    
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                router.patch(`/rsvps/${item.id}/status`, {
                                                                    status: "cancelled",
                                                                })
                                                            }
                                                            className="text-amber-600"
                                                        >
                                                            <XCircle /> <span className="ml-2">Cancel</span>
                                                        </DropdownMenuItem>
                                                    </>
                                                )} */}



                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* MODALS OUTSIDE */}
            {selected && (
                <>
                    <ViewModal
                        item={selected}
                        open={viewOpen}
                        setOpen={setViewOpen}
                    />

                    <EditModal
                        item={selected}
                        open={editOpen}
                        setOpen={setEditOpen}
                    />
                </>
            )}
        </div>
    )
}

