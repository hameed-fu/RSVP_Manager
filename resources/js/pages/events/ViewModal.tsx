import {
    Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog"

export default function ViewModal({ item, open, setOpen }: any) {

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md">

                <DialogHeader>
                    <DialogTitle>RSVP Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-3 text-sm">
                    <p><b>Name:</b> {item.name}</p>
                    <p><b>Phone:</b> {item.phone}</p>
                    <p><b>Email:</b> {item.email}</p>
                    <p><b>Guests:</b> {item.guests_count}</p>
                    <p><b>Status:</b> {item.status}</p>
                </div>

            </DialogContent>
        </Dialog>
    )
}