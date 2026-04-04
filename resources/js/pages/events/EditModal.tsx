import { useForm } from "@inertiajs/react"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

import { Label } from "@/components/ui/label"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"

export default function EditModal({ item, open, setOpen }: any) {

    const { data, setData, put, processing } = useForm({
        name: item.name || "",
        phone: item.phone || "",
        email: item.email || "",
        guests_count: item.guests_count || 1,
        status: item.status || "pending",
    })

    const submit = (e: any) => {
        e.preventDefault()

        put(`/rsvps/${item.id}`, {
            preserveScroll: true,
            preserveState: false, 
            onSuccess: () => {
                setOpen(false)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md">

                <DialogHeader>
                    <DialogTitle>Edit RSVP</DialogTitle>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-5">

                    {/* NAME */}
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="Enter name"
                        />
                    </div>

                    {/* PHONE */}
                    <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                            value={data.phone}
                            onChange={(e) => setData("phone", e.target.value)}
                            placeholder="Enter phone"
                        />
                    </div>

                    {/* EMAIL */}
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            placeholder="Enter email"
                        />
                    </div>

                    {/* GUESTS */}
                    <div className="space-y-2">
                        <Label>Guests</Label>
                        <Input
                            type="number"
                            value={data.guests_count}
                            onChange={(e) => setData("guests_count", e.target.value)}
                            placeholder="Number of guests"
                        />
                    </div>

                    {/* STATUS (shadcn select) */}
                    <div className="space-y-2">
                        <Label>Status</Label>

                        <Select
                            value={data.status}
                            onValueChange={(value) => setData("status", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* BUTTON */}
                    <Button className="w-full" disabled={processing}>
                        {processing && (
                            <Loader2 className="animate-spin mr-2 w-4 h-4" />
                        )}
                        Update RSVP
                    </Button>

                </form>

            </DialogContent>
        </Dialog>
    )
}