import { useForm, usePage } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";

import { QRCodeCanvas } from "qrcode.react";
import { toPng } from "html-to-image";
import { useRef } from "react";
import PaymentModal from "./PaymentModal";
export default function Welcome() {
  document.title = "Reserve Your Place - RSVP Manager";

  return (
    <div className="min-h-screen bg-[#f5efe6] flex flex-col">

      {/* HERO */}
      <div className="bg-gradient-to-r from-[#1a1209] via-[#2b1b0f] to-[#1a1209] text-center py-10 px-4 text-[#f5efe6]">
        <p className="text-xs tracking-[0.3em] text-[#c9993a] mb-4">
          ✦ YOU'RE INVITED ✦
        </p>

        <h1 className="font-serif text-xl md:text-3xl font-light leading-relaxed">
          Truman, Taylor Center and Kennedy 40 Year
          <span className="text-[#c9993a] italic"> Class Reunion </span>
        </h1>

        <p className="mt-4 text-sm text-[#de8f18] max-w-md mx-auto">
          We'd be delighted to have you join us. Please complete
          the form below to confirm your attendance.
        </p>

        <div className="w-16 h-[1px] bg-[#c9993a] mx-auto mt-6 opacity-50"></div>
      </div>

      {/* FORM */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl">

          {/* LOGO */}
          <div className="flex justify-center -mt-16 mb-6">
            <img
              src="/logo.jpeg"
              className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg"
            />
          </div>

          {/* CARD */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-[#f9e4c5]">
            <RSVPForm />
          </div>

        </div>
      </div>
    </div>
  );
}

/* ================= FORM ================= */

function RSVPForm() {
  const { flash } = usePage().props as any;
  const ticketRef = useRef(null);
  const { data, setData, errors, reset } = useForm({
    name: "",
    phone: "",
    email: "",
    guests_count: 1,
    payment_type: null,
  });

  const [loading, setLoading] = useState(false);
  const [paypalData, setPaypalData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [ticket, setTicket] = useState<any>(null);


  useEffect(() => {
    if (flash?.ticket) {
      setTicket(flash.ticket);
    }
  }, [flash]);


  const submitWithType = async (type: string) => {
    if (loading) return;

    try {
      setLoading(true);

      const res = await axios.post("/rsvp/store", {
        ...data,
        payment_type: type,
      });

      const { type: resType, data: resData } = res.data;

      // ✅ STRIPE
      if (resType === "stripe") {
        window.location.href = resData.checkout_url;
        return;
      }

      // ✅ PAYPAL
      if (resType === "paypal") {
        setPaypalData(resData);
        return;
      }

      // ✅ PAY LATER (TICKET GENERATED)
      if (resType === "success") {
        setTicket(resData); // 🎟 STORE TICKET
        setShowModal(false);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const downloadTicket = async () => {
    if (!ticketRef.current) return;

    try {
      const dataUrl = await toPng(ticketRef.current, {
        cacheBust: true,
        pixelRatio: 3, // ✅ HIGH QUALITY
      });

      const link = document.createElement("a");
      link.download = `ticket-${ticket.ticket_code}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed", err);
    }
  };
  /* ================= SUCCESS / TICKET VIEW ================= */

  if (ticket) {
    return (
      <div className="text-center py-10 space-y-6">

        <div className="w-16 h-16 mx-auto bg-green-600 text-white rounded-full flex items-center justify-center text-2xl">
          ✓
        </div>

        <h2 className="text-xl font-serif">Booking Confirmed 🎉</h2>

        {/* TICKET CARD */}
        {/* TICKET CARD */}
        <div
          ref={ticketRef} // ✅ ATTACH REF HERE
          className="border rounded-xl p-6 bg-[#faf6ee] shadow-sm"
        >

          <p className="text-xs tracking-widest text-gray-500 mb-3">
            YOUR EVENT TICKET
          </p>

          {/* QR CODE */}
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white rounded-lg shadow-inner border">

              <QRCodeCanvas
                value={ticket.ticket_code}
                size={160}
              />

            </div>
          </div>

          {/* CODE */}
          <p className="text-lg font-bold tracking-widest text-[#1a1209]">
            {ticket.ticket_code}
          </p>


        </div>
        <Button
          onClick={downloadTicket}
          className="bg-green-600 text-white hover:bg-green-700 mr-2"
        >
          Download Ticket <CreditCard className="ml-2" />
        </Button>
        <Button
          onClick={() => {
            setTicket(null);
            reset();
          }}
        >
          Book Another Ticket
        </Button>
      </div>
    );
  }

  /* ================= FORM ================= */

  return (
    <>
      <form className="space-y-5">

        <div className="text-xs tracking-[0.25em] text-[#8a6b28] flex items-center gap-2 mb-4">
          YOUR DETAILS
          <div className="flex-1 h-[1px] bg-[#e8e0d4]"></div>
        </div>

        {/* NAME */}
        <div>
          <label className="text-sm font-medium">
            Full Name <span className="text-[#c9993a]">*</span>
          </label>
          <Input
            className="mt-1 h-12 bg-[#faf6ee]"
            placeholder="Full Name"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* PHONE */}
        <div>
          <label className="text-sm font-medium">
            Phone
          </label>
          <Input
            placeholder="Phone"
            className="h-12 bg-[#faf6ee]"
            value={data.phone}
            onChange={(e) => setData("phone", e.target.value)}
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-sm font-medium">
            Email
          </label>
          <Input
            type="email"
            placeholder="Email"
            className="h-12 bg-[#faf6ee]"
            value={data.email}
            onChange={(e) => setData("email", e.target.value)}
          />
        </div>

        {/* GUESTS */}
        <div>
          <label className="text-sm font-medium">
            Number of Guests
          </label>
          <Input
            type="number"
            min={1}
            className="h-12 bg-[#faf6ee]"
            value={data.guests_count}
            onChange={(e) =>
              setData("guests_count", Number(e.target.value))
            }
          />
        </div>

        {/* PRICE */}
        <p className="text-sm text-center text-gray-600">
          Total: <strong>${data.guests_count * 10}</strong>
        </p>

        {/* BUTTON */}
        <Button
          type="button"
          className="w-full h-12 bg-[#1a1209] text-[#f0d9a0]"
          onClick={() => setShowModal(true)}
        >
          {loading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
          Continue
        </Button>
      </form>

      {/* PAYMENT MODAL */}
      <PaymentModal
        open={showModal}
        setOpen={setShowModal}
        paypalData={paypalData}
        setPaypalData={setPaypalData}
        submitWithType={submitWithType}
        setTicket={setTicket}
      />
    </>
  );
}