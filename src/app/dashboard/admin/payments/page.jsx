"use client";
import { useEffect, useState } from "react";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/payments`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setPayments)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center mt-20"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Payments</h1>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Patient</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id}>
                <td className="text-xs font-mono">{p.transactionId}</td>
                <td>{p.patientEmail}</td>
                <td>${p.amount}</td>
                <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPayments;