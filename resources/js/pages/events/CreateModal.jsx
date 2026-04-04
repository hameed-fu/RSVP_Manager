import { useState } from "react"
import { router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Plus, Loader2 } from "lucide-react"

export default function CreateModal() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        guests_count: 1,
        status: 'pending'
    })

    const submit = () => {
        if (!form.name || !form.phone || !form.email) return

        setLoading(true)

        router.post('/rsvps', form, {
            onFinish: () => setLoading(false),
            preserveState: false,
            
            onSuccess: () => {
                // reset form
                setForm({
                    name: '',
                    phone: '',
                    email: '',
                    guests_count: 1,
                    status: 'pending'
                })

                // close modal
                setOpen(false)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New RSVP
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create RSVP</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">

                    {/* NAME */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Name</label>
                        <Input
                            placeholder="Enter name"
                            className="mt-1 h-10 text-lg   border-[#de8f18]"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                        />
                    </div>

                    {/* PHONE */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Phone</label>
                        <Input
                            placeholder="Enter phone"
                            className="mt-1 h-10 text-lg   border-[#de8f18]"
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                        />
                    </div>

                    {/* EMAIL */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                            placeholder="Enter email"
                            type="email"
                            className="mt-1 h-10 text-lg   border-[#de8f18]"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                        />
                    </div>

                    {/* GUESTS */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Guests</label>
                        <Input
                        className="mt-1 h-10 text-lg   border-[#de8f18]"
                            type="number"
                            min={1}
                            value={form.guests_count}
                            onChange={e => setForm({ ...form, guests_count: Number(e.target.value) })}
                        />
                    </div>

                    {/* STATUS */}
                    <div className="space-y-1 ">
                        <label className="text-sm font-medium">Status</label>
                        <Select
                            value={form.status}
                            onValueChange={(v) => setForm({ ...form, status: v })}
                            className="mt-1 border-[#de8f18] w-full"
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

                    {/* SUBMIT */}
                    <Button
                        onClick={submit}
                        disabled={loading}
                        className="w-full"
                    >
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Submit
                    </Button>

                </div>
            </DialogContent>
        </Dialog>
    )
}