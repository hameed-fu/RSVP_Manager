import { usePage } from '@inertiajs/react';
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer
} from '@paypal/react-paypal-js';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

function PayPalButtonWrapper({ rsvpId, onSuccess }) {
  const [{ isPending }] = usePayPalScriptReducer();

  // 🔥 Loader before PayPal loads
  if (isPending) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="animate-spin w-6 h-6 text-gray-600" />
        <span className="ml-2 text-sm text-gray-600">
          Loading PayPal...
        </span>
      </div>
    );
  }

  return (
    <PayPalButtons
      style={{ layout: 'vertical' }}
      createOrder={async () => {
        const res = await axios.post('/paypal/create-order', {
          rsvp_id: rsvpId,
        });
        return res.data.orderID;
      }}
      onApprove={async (data) => {
        const res = await axios.post('/paypal/capture-order', {
          orderID: data.orderID,
        });

        if (res.data.ticket && onSuccess) {
          onSuccess(res.data.ticket);
        }
      }}
      onError={(err) => {
        console.error(err);
        alert('PayPal error');
      }}
    />
  );
}

export default function PayPalCheckout({ rsvpId, onSuccess }) {
  const { paypal_client_id } = usePage().props;

  return (
    <PayPalScriptProvider
      options={{
        'client-id': paypal_client_id,
        currency: 'USD',
      }}
    >
      <PayPalButtonWrapper
        rsvpId={rsvpId}
        onSuccess={onSuccess}
      />
    </PayPalScriptProvider>
  );
}