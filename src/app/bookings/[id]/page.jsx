"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import stripePromise from "@/lib/stripe";
import CheckoutForm from "@/components/CheckoutForm";

const TIME_SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];

const BookingPage = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [problem, setProblem] = useState(""); // Added state for patient problem
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/doctors/${id}`)
      .then((res) => res.json())
      .then((data) => setDoctor(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="flex justify-center mt-20"><span className="loading loading-spinner loading-lg text-[#0d5c4e]"></span></div>;
  }
  if (!doctor) return <p className="text-center mt-20">Doctor not found.</p>;

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">Book Appointment</h1>
      <p className="text-gray-500 mb-6">{doctor.doctorName} — {doctor.specialization} — ${doctor.fee}</p>

      <div className="space-y-4 mb-6">
        <input
          type="date"
          className="input input-bordered w-full"
          value={date}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setDate(e.target.value)}
        />
        <select
          className="select select-bordered w-full"
          value={slot}
          onChange={(e) => setSlot(e.target.value)}
        >
          <option value="">Select a time slot</option>
          {TIME_SLOTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        
        {/* Added Problem Description Field */}
        <textarea
          className="textarea textarea-bordered w-full h-24"
          placeholder="Please describe your symptoms or reason for the visit..."
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
        />
      </div>

      {date && slot && problem ? (
        <Elements stripe={stripePromise}>
          {/* Passed the new 'problem' prop to CheckoutForm */}
          <CheckoutForm doctor={doctor} date={date} slot={slot} problem={problem} />
        </Elements>
      ) : (
        <p className="text-sm text-gray-400">Pick a date, time slot, and describe your problem to continue to payment.</p>
      )}
    </div>
  );
};

export default BookingPage;