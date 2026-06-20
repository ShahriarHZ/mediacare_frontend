"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import useRole from "@/hooks/useRole";
import toast from "react-hot-toast";

const PrescriptionsContent = () => {
  const { user, loading: roleLoading } = useRole();
  const [prescriptions, setPrescriptions] = useState([]);
  const [fetching, setFetching] = useState(true);
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");

  useEffect(() => {
    if (!user?.email || roleLoading) return;
    setFetching(true);
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/prescriptions/patient/${user.email}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setPrescriptions(data || []))
      .catch(() => toast.error("Failed to load prescriptions."))
      .finally(() => setFetching(false));
  }, [user, roleLoading]);

  if (roleLoading || fetching) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-teal-600"></span>
      </div>
    );
  }

  const sorted = appointmentId
    ? [
        ...prescriptions.filter((p) => p.appointmentId === appointmentId),
        ...prescriptions.filter((p) => p.appointmentId !== appointmentId),
      ]
    : prescriptions;

  return (
    <div className="max-w-4xl mx-auto my-4 p-4 sm:p-8 bg-white border border-slate-100 shadow-xl rounded-2xl">
      <div className="border-b border-slate-100 pb-5 mb-6">
        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <span className="bg-teal-50 text-teal-600 p-1 rounded-lg">📋</span>
          My Prescriptions
        </h1>
        <p className="text-xs text-slate-400 mt-1">Prescriptions written by your doctors</p>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-xl">
          <p className="text-sm text-slate-400">No prescriptions found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sorted.map((p) => (
            <div
              key={p._id}
              className={`border rounded-2xl p-6 ${
                p.appointmentId === appointmentId
                  ? "border-teal-300 bg-teal-50/30"
                  : "border-slate-100 bg-white"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="font-black text-slate-800 text-lg">Dr. {p.doctorName}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(p.createdAt).toLocaleDateString("en-US", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </p>
                </div>
                <span className="badge bg-teal-50 text-teal-700 border border-teal-100 text-xs font-bold px-3 py-1 rounded-xl">
                  Prescription
                </span>
              </div>

              {p.diagnosis && (
                <div className="mb-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Diagnosis</h3>
                  <p className="text-slate-700 text-sm bg-slate-50 rounded-xl p-3">{p.diagnosis}</p>
                </div>
              )}

              {p.medications && (
                <div className="mb-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Medications</h3>
                  <p className="text-slate-700 text-sm bg-slate-50 rounded-xl p-3 whitespace-pre-line">{p.medications}</p>
                </div>
              )}

              {p.notes && (
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Doctor's Notes</h3>
                  <p className="text-slate-700 text-sm bg-slate-50 rounded-xl p-3 italic">{p.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PatientPrescriptions = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[50vh]">
          <span className="loading loading-spinner loading-lg text-teal-600"></span>
        </div>
      }
    >
      <PrescriptionsContent />
    </Suspense>
  );
};

export default PatientPrescriptions;