import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import PayPalCheckout from "./PayPalCheckout";
import { Button } from "@/components/ui/button";
import { Banknote, CreditCard, Loader2 } from "lucide-react";

export default function PaymentModal({
  open,
  setOpen,
  paypalData,
  setPaypalData,
  submitWithType,
  setTicket,
}) {
  const [loadingType, setLoadingType] = useState(null);

  const handleSubmit = async (type) => {
    try {
      setLoadingType(type);
      await submitWithType(type);
    } finally {
      setLoadingType(null);
    }
  };

  const isLoading = loadingType !== null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md rounded-2xl">

        {!paypalData ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-lg">
                Select Payment Method
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3 mt-2">

              {/* Pay Later */}
              {/* <Button
                className="w-full border"
                variant="secondary"
                disabled={isLoading}
                onClick={() => handleSubmit("later")}
              >
                {loadingType === "later" && (
                  <Loader2 className="animate-spin mr-2" />
                )}
                Pay Later
              </Button> */}

              {/* Stripe */}
              {/* <Button
                className="w-full"
                disabled={isLoading}
                onClick={() => handleSubmit("stripe")}
              >
                {loadingType === "stripe" ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <CreditCard className="mr-2" />
                )}
                Pay with Card
              </Button> */}

              {/* PayPal */}
              <Button
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                disabled={isLoading}
                onClick={() => handleSubmit("paypal")}
              >
                {loadingType === "paypal" ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <Banknote className="mr-2" />
                )}
                Pay with PayPal
              </Button>
              <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-blue-700 leading-tight">
                  You can check out as a guest if you do not have a PayPal account
                </span>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                className="w-full"
                disabled={isLoading}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-lg">
                Complete PayPal Payment
              </DialogTitle>
            </DialogHeader>

            <div className="py-3">
              <PayPalCheckout
                rsvpId={paypalData.rsvp_id}
                onSuccess={(ticket) => {
                  setTicket(ticket);
                  setPaypalData(null);
                  setOpen(false);
                }}
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setPaypalData(null)}
              >
                Back
              </Button>
            </DialogFooter>
          </>
        )}

      </DialogContent>
    </Dialog>
  );
}