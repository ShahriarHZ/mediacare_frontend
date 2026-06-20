"use client";
import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import useRole from "@/hooks/useRole";

// Added 'problem' to the destructured props
const CheckoutForm = ({ doctor, date, slot, problem }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { session } = useRole();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError("");

    try {
      const intentRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ fee: doctor.fee }),
      });
      const { clientSecret } = await intentRes.json();

      const card = elements.getElement(CardElement);
      const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card, billing_details: { email: session?.user?.email } },
      });

      if (confirmError) {
        setError(confirmError.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        const appointmentRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/appointments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            doctorId: doctor._id,
            doctorName: doctor.name,
            specialization: doctor.specialization,
            fee: doctor.fee,
            patientEmail: session?.user?.email,
            patientName: session?.user?.name,
            date,
            slot,
            problem, // ✅ Include the problem here
            transactionId: paymentIntent.id,
          }),
        });

        if (appointmentRes.ok) {
          router.push("/dashboard/patient/appointments");
        } else {
          setError("Payment succeeded but saving the appointment failed. Save this transaction ID: " + paymentIntent.id);
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border rounded-lg p-4 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
        <CardElement options={{ style: { base: { fontSize: "16px", color: "#475569" } } }} />
      </div>
      {error && <p className="text-error text-sm">{error}</p>}
      <button type="submit" disabled={!stripe || processing} className="btn btn-primary w-full bg-[#0d5c4e] border-none hover:bg-[#0a463b] text-white">
        {processing ? "Processing..." : `Pay $${doctor.fee}`}
      </button>
    </form>
  );
};

export default CheckoutForm;