"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useRole from "@/hooks/useRole";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";

const statusColors = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  accepted: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

const MyAppointments = () => {
  const { user, loading: roleLoading } = useRole();
  const [appointments, setAppointments] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [symptoms, setSymptoms] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchAppointments = () => {
    if (!user?.email) return;
    setFetching(true);
    apiFetch(`/appointments/patient/${user.email}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setAppointments(data || []))
      .catch(() => toast.error("Failed to load appointments."))
      .finally(() => setFetching(false));
  };

  useEffect(() => {
    if (!roleLoading) fetchAppointments();
  }, [user, roleLoading]);

  const handleCancel = async (id) => {
    if (!confirm("Cancel this appointment?")) return;
    try {
      const res = await apiFetch(`/appointments/cancel/${id}`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error();
      toast.success("Appointment cancelled.");
      fetchAppointments();
    } catch {
      toast.error("Failed to cancel appointment.");
    }
  };

  const handleSubmitSymptoms = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    setSubmitting(true);
    try {
      const res = await apiFetch(
        `/appointments/symptoms/${selectedAppointment._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ symptoms }),
        }
      );
      if (!res.ok) throw new Error();
      toast.success("Problem description submitted to your doctor.");
      setSelectedAppointment(null);
      setSymptoms("");
      fetchAppointments();
    } catch {
      toast.error("Failed to submit problem description.");
    } finally {
      setSubmitting(false);
    }
  };

  if (roleLoading || fetching) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-teal-600"></span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-4 p-4 sm:p-8 bg-white border border-slate-100 shadow-xl rounded-2xl">
      <div className="border-b border-slate-100 pb-5 mb-6">
        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <span className="bg-teal-50 text-teal-600 p-1 rounded-lg">📅</span>
          My Appointments
        </h1>
      </div>

      {/* Problem Description Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-black text-slate-800 mb-1">Describe Your Problem</h2>
            <p className="text-xs text-slate-400 mb-4">
              Appointment with <b>{selectedAppointment.doctorName}</b>
            </p>
            <form onSubmit={handleSubmitSymptoms} className="space-y-4">
             <textarea
                className="textarea textarea-bordered w-full min-h-[120px] bg-white text-slate-800 placeholder:text-slate-400"
                placeholder="Describe your symptoms, concerns, or questions for the doctor..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                required
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setSelectedAppointment(null); setSymptoms(""); }}
                  className="btn btn-ghost flex-1 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn bg-teal-600 hover:bg-teal-700 border-none text-white flex-1 rounded-xl"
                >
                  {submitting ? <span className="loading loading-spinner loading-sm"></span> : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-xl">
          <p className="text-sm text-slate-400">No appointments found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="table w-full text-slate-700 bg-white">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-4 px-4">Doctor</th>
                <th className="py-4 px-4">Specialization</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4">Slot</th>
                <th className="py-4 px-4">Fee</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {appointments.map((a) => (
                <tr key={a._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center">🩺</div>
                      <span className="font-bold text-slate-800">{a.doctorName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-500">{a.specialization || "General Medicine"}</td>
                  <td className="py-4 px-4 font-semibold text-slate-600">
                    {new Date(a.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </td>
                  <td className="py-4 px-4">
                    <span className="badge bg-slate-100 text-slate-600 border-none rounded-md font-mono text-xs px-2 py-1">
                      {a.slot}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-800">${Number(a.fee || 0).toFixed(2)}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`badge border text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${statusColors[a.appointmentStatus] || "bg-slate-100"}`}>
                      {a.appointmentStatus}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex gap-2 justify-end">
                      {a.appointmentStatus === "accepted" && !a.symptoms && (
                        <button
                          onClick={() => setSelectedAppointment(a)}
                          className="btn btn-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border-none rounded-lg font-bold"
                        >
                          Describe Problem
                        </button>
                      )}
                      {a.appointmentStatus === "accepted" && a.symptoms && (
                        <span className="text-xs text-emerald-600 font-semibold">Problem Submitted ✓</span>
                      )}
                      {a.appointmentStatus === "pending" && (
                        <button
                          onClick={() => handleCancel(a._id)}
                          className="btn btn-xs btn-ghost hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded-lg font-bold"
                        >
                          Cancel
                        </button>
                      )}
                      {a.appointmentStatus === "completed" && (
                        <Link
                          href={`/dashboard/patient/prescriptions?appointmentId=${a._id}`}
                          className="btn btn-xs bg-teal-50 hover:bg-teal-100 text-teal-700 border-none rounded-lg font-bold"
                        >
                          View Rx
                        </Link>
                      )}
                    </div>
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

export default MyAppointments;