import { useForm, usePage } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function Welcome() {
  useEffect(() => {
    document.title = "Reserve Your Place - RSVP Manager";
  }, []);

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
              className="w-60 h-60 rounded object-cover border-4 border-white shadow-lg"
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
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    phone: "",
    email: "",
    guests_count: 1,
    message: "",
  });

  const { flash } = usePage().props as any;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    post("/rsvp/store", {
      onSuccess: () => reset(),
    });
  };

  const bookAnother = () => {
     flash.success = null;
     reset();
  }

  if (flash?.success) {
    return (
      <div className="text-center py-10">
        <div className="w-14 h-14 mx-auto bg-[#3a4a2e] text-white rounded-full flex items-center justify-center text-xl mb-4">
          ✓
        </div>
        <h3 className="font-serif text-xl mb-2">You're on the list!</h3>
        <p className="text-sm text-gray-500">{flash.success}</p>

        <Button
          onClick={() => bookAnother()}
          className="mt-4 border px-4 p-5 rounded-lg text-lg"
        >
          Submit another RSVP
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">

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
          className="mt-1 h-12 bg-[#faf6ee] border-[#de8f18]"
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
          className="h-12 bg-[#faf6ee] border-[#de8f18]"
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
          className="h-12 bg-[#faf6ee] border-[#de8f18]"
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
          className="h-12 bg-[#faf6ee] border-[#de8f18]"
          value={data.guests_count}
          onChange={(e) =>
            setData("guests_count", Number(e.target.value))
          }
        />
      </div>

      {/* BUTTON */}
      <Button
        type="submit"
        className="w-full h-12 bg-[#1a1209] text-[#f0d9a0]"
        disabled={processing}
      >
        {processing && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
        Submit
      </Button>
    </form>
  );
}