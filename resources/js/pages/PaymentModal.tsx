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
              <Button
                className="w-full border"
                variant="secondary"
                disabled={isLoading}
                onClick={() => handleSubmit("later")}
              >
                {loadingType === "later" && (
                  <Loader2 className="animate-spin mr-2" />
                )}
                Pay Later
              </Button>

              {/* Stripe */}
              <Button
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
              </Button>

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