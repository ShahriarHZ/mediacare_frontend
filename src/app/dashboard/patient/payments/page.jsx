"use client";
import { useEffect, useState } from "react";
import useRole from "@/hooks/useRole";

const PaymentHistory = () => {
  const { session } = useRole();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.email) return;
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/payments/patient/${session.user.email}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setPayments)
      .finally(() => setLoading(false));
  }, [session]);

  if (loading) return <div className="flex justify-center mt-20"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Payment History</h1>
      {payments.length === 0 ? (
        <p className="text-gray-500">No payments yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Doctor</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td className="text-xs font-mono">{p.transactionId}</td>
                  <td>{p.doctorId}</td>
                  <td>${p.amount}</td>
                  <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;