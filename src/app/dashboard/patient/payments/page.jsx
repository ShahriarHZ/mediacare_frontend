"use client";

import { useEffect, useState } from "react";
import useRole from "@/hooks/useRole";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";

const PaymentHistory = () => {
  const { user, loading: roleLoading } = useRole();
  const [payments, setPayments] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    setFetching(true);
    apiFetch(`/payments/patient/${user.email}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setPayments(data || []))
      .catch(() => toast.error("Failed to load payment history."))
      .finally(() => setFetching(false));
  }, [user]);

  if (roleLoading || fetching) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-teal-600"></span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto my-4 p-4 sm:p-8 bg-white border border-slate-100 shadow-xl rounded-2xl">
      <h1 className="text-2xl font-black text-slate-800 mb-6">Payment History</h1>

      {payments.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-xl">
          <p className="text-sm text-slate-400">No payment records found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="table w-full text-slate-700 bg-white">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-4 px-4">Doctor</th>
                <th className="py-4 px-4">Amount</th>
                <th className="py-4 px-4">Transaction ID</th>
                <th className="py-4 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {payments.map((p) => (
                <tr key={p._id}>
                  <td className="py-4 px-4 font-bold text-slate-800">{p.doctorName || p.doctorId}</td>
                  <td className="py-4 px-4 font-bold text-teal-600">${Number(p.amount || 0).toFixed(2)}</td>
                  <td className="py-4 px-4 font-mono text-xs text-slate-500">{p.transactionId || "—"}</td>
                  <td className="py-4 px-4 text-slate-600">
                    {new Date(p.paymentDate).toLocaleDateString("en-US", {
                      year: "numeric", month: "short", day: "numeric",
                    })}
                  </td>
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