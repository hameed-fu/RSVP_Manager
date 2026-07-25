import { Button } from "@/components/ui/button"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import { FileDown, Mail, MapPin, Phone, Ticket, Users } from "lucide-react"

export default function ViewModal({ item, open, setOpen }: any) {

    const StatusBadge = ({ status }: { status: string }) => {
        const map: any = {
            pending: "bg-yellow-100 text-yellow-800",
            confirmed: "bg-green-100 text-green-800",
            cancelled: "bg-red-100 text-red-800",
        }
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${map[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        )
    }

    const PaymentBadge = ({ label }: { label: string }) => {
        const colors: any = {
            stripe: "bg-indigo-100 text-indigo-700",
            paypal: "bg-blue-100 text-blue-700",
            later: "bg-gray-100 text-gray-700",
        }
        return (
            <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${colors[label] || "bg-gray-100 text-gray-700"}`}>
                {label}
            </span>
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-lg">

                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>RSVP Details</span>
                        <StatusBadge status={item.status} />
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">

                    {/* PERSONAL INFO */}
                    <div>
                        <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-3">
                            Personal Information
                        </h4>
                        <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                                    {item.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">{item.email}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm pt-2 border-t border-border/50">
                                <div className="flex items-center gap-2">
                                    <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                                    <span>{item.phone || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-3.5 h-3.5 text-muted-foreground" />
                                    <span>{item.guests_count} Guest{item.guests_count !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex items-center gap-2 col-span-2">
                                    <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                    <span>{item.address || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PAYMENT INFO */}
                    <div>
                        <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-3">
                            Payment Details
                        </h4>
                        <div className="bg-muted/30 rounded-xl p-4 space-y-2 text-sm">
                            {item.payment ? (
                                <>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Provider</span>
                                        <PaymentBadge label={item.payment.provider} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Amount</span>
                                        <span className="font-semibold">${item.payment.amount}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Status</span>
                                        <span className={`font-medium capitalize ${
                                            item.payment.status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                                        }`}>
                                            {item.payment.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Payment ID</span>
                                        <span className="text-xs font-mono text-muted-foreground truncate max-w-[200px]">
                                            {item.payment.payment_id || '—'}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <p className="text-muted-foreground text-center py-2">No payment recorded</p>
                            )}
                        </div>
                    </div>

                    {/* TICKET INFO */}
                    {item.ticket_code && (
                        <div>
                            <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-3">
                                Ticket Information
                            </h4>
                            <div className="bg-muted/30 rounded-xl p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Ticket className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">Ticket Code</span>
                                    </div>
                                    <span className="font-mono font-bold tracking-widest text-base">
                                        {item.ticket_code}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DATES */}
                    <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
                        <span>Created: {new Date(item.created_at).toLocaleString()}</span>
                        {item.updated_at !== item.created_at && (
                            <span>Updated: {new Date(item.updated_at).toLocaleString()}</span>
                        )}
                    </div>

                    {/* PDF BUTTON */}
                    <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => window.open(`/rsvps/${item.id}/pdf`, '_blank')}
                    >
                        <FileDown className="w-4 h-4 mr-2" />
                        Download PDF
                    </Button>

                </div>

            </DialogContent>
        </Dialog>
    )
}