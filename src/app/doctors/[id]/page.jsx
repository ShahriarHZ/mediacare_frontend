"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import useRole from "@/hooks/useRole";
import toast from "react-hot-toast";
import stripePromise from "@/lib/stripe";
import PaymentForm from "@/components/PaymentForm";

console.log("Stripe key:", process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const DoctorDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: roleLoading } = useRole();

  const [doctor, setDoctor] = useState(null);
  const [fetchingDoctor, setFetchingDoctor] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    if (!id) return;
    setFetchingDoctor(true);
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/doctors/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setDoctor(data))
      .catch(() => toast.error("Failed to load practitioner profile information."))
      .finally(() => setFetchingDoctor(false));
  }, [id]);

  const handleReserveClick = () => {
    if (!user?.email) {
      toast.error("Please log in to book a consultation slot.");
      router.push("/login");
      return;
    }
    if (!selectedSlot) {
      toast.error("Please pick an available time slot block.");
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    router.push("/dashboard/patient/appointments");
  };

  if (roleLoading || fetchingDoctor) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] gap-3">
        <span className="loading loading-spinner loading-lg text-teal-600"></span>
        <p className="text-xs text-slate-400 font-medium tracking-wide">Retrieving Specialist Dossier...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-8 bg-white border border-slate-100 rounded-2xl shadow-sm">
        <p className="text-slate-400 font-medium">Practitioner profile registry entry not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto my-6 p-4 sm:p-8 bg-white border border-slate-100 shadow-xl shadow-slate-100/40 rounded-2xl">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

        <div className="md:col-span-5 bg-slate-50/60 border border-slate-100 p-6 rounded-2xl text-center">
          <div className="w-24 h-24 bg-teal-100 text-teal-700 mx-auto rounded-full flex items-center justify-center text-4xl font-bold shadow-inner mb-4">
            🩺
          </div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Dr. {doctor.doctorName}</h1>
          <span className="badge bg-teal-50 border border-teal-100 text-teal-700 text-xs font-extrabold uppercase tracking-wider rounded-md px-2.5 py-1 mt-2">
            {doctor.specialization || "General Medicine"}
          </span>

          <div className="border-t border-dashed border-slate-200 my-4 pt-4 text-left space-y-2">
            <p className="text-xs text-slate-500 font-medium flex justify-between">
              <span>Experience Timeline:</span>
              <span className="text-slate-800 font-bold">{doctor.experienceYears || "5+"} Years</span>
            </p>
            <p className="text-xs text-slate-500 font-medium flex justify-between">
              <span>Consultation Fee Matrix:</span>
              <span className="text-teal-600 font-extrabold">${Number(doctor.appointmentFee || 0).toFixed(2)}</span>
            </p>
          </div>
        </div>

        <div className="md:col-span-7 space-y-5">
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span>📅</span> Consultation Allocation
            </h2>
            <p className="text-xs text-slate-400">Select an open operational hours slot block to schedule your diagnostic visit.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(doctor.availableSlots || ["09:00 AM - 10:00 AM", "11:00 AM - 12:00 PM", "04:00 PM - 05:00 PM"]).map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => { setSelectedSlot(slot); setShowPayment(false); }}
                className={`p-3 border text-xs font-semibold rounded-xl tracking-wide transition-all ${
                  selectedSlot === slot
                    ? "bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-100 font-bold"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50/50"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>

          {!showPayment ? (
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={handleReserveClick}
                className="btn bg-teal-600 hover:bg-teal-700 active:bg-teal-800 border-none text-white w-full rounded-xl font-semibold tracking-wide shadow-sm shadow-teal-100 transition-all"
              >
                Reserve Consultation Appointment Slot
              </button>
            </div>
          ) : (
            <Elements stripe={stripePromise}>
              <PaymentForm
                doctor={doctor}
                selectedSlot={selectedSlot}
                user={user}
                onSuccess={handlePaymentSuccess}
                onCancel={() => setShowPayment(false)}
              />
            </Elements>
          )}
        </div>

      </div>
    </div>
  );
};

export default DoctorDetailsPage;