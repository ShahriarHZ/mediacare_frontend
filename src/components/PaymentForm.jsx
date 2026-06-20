"use client";

import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";

const cardStyle = {
  style: {
    base: {
      fontSize: "15px",
      color: "#1e293b",
      "::placeholder": { color: "#94a3b8" },
    },
    invalid: { color: "#e11d48" },
  },
};

const PaymentForm = ({ doctor, selectedSlot, user, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setCardError("");

    try {
      const intentRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ fee: doctor.appointmentFee }),
      });

      if (!intentRes.ok) throw new Error("Could not initialize payment.");
      const { clientSecret } = await intentRes.json();

      const cardElement = elements.getElement(CardElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user.name || "Anonymous Patient",
            email: user.email,
          },
        },
      });

      if (error) {
        setCardError(error.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/appointments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            doctorId: doctor._id,
            doctorName: doctor.doctorName,
            specialization: doctor.specialization,
            fee: doctor.appointmentFee,
            slot: selectedSlot,
            patientEmail: user.email,
            patientName: user.name || "Anonymous Patient",
            date: new Date().toISOString().split("T")[0],
            appointmentStatus: "pending",
            transactionId: paymentIntent.id,
          }),
        });

        if (!res.ok) throw new Error("Payment succeeded but booking failed.");

        toast.success("Payment successful — appointment booked!");
        onSuccess();
      }
    } catch (err) {
      toast.error(err.message || "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-slate-200 rounded-xl p-4 bg-slate-50/50 mt-4">
      <div>
        <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2 block">
          Card Details
        </label>
        <div className="bg-white border border-slate-200 rounded-lg p-3">
          <CardElement options={cardStyle} />
        </div>
        {cardError && <p className="text-rose-600 text-xs mt-2">{cardError}</p>}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={processing}
          className="btn btn-ghost flex-1 rounded-xl text-slate-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="btn bg-teal-600 hover:bg-teal-700 border-none text-white flex-1 rounded-xl font-semibold"
        >
          {processing ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            `Pay $${Number(doctor.appointmentFee || 0).toFixed(2)}`
          )}
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;