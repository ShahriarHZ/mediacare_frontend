"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import useRole from "@/hooks/useRole";

const PrescriptionsPage = () => {
  const { session } = useRole();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");
  const [prescriptions, setPrescriptions] = useState([]);
  const [form, setForm] = useState({
    patientEmail: "",
    patientName: "",
    diagnosis: "",
    medicines: "",
    notes: "",
  });
  const [saved, setSaved] = useState(false);

  const fetchPrescriptions = () => {
    if (!session?.user?.email) return;
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/prescriptions/doctor/${session.user.email}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setPrescriptions);
  };

  useEffect(() => { fetchPrescriptions(); }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/prescriptions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        ...form,
        doctorEmail: session?.user?.email,
        doctorName: session?.user?.name,
        appointmentId,
      }),
    });
    setForm({ patientEmail: "", patientName: "", diagnosis: "", medicines: "", notes: "" });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    fetchPrescriptions();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Prescriptions</h1>

      <form onSubmit={handleSubmit} className="bg-base-200 p-6 rounded-xl mb-8 space-y-3 max-w-lg">
        <h2 className="font-semibold">Write New Prescription</h2>
        <input
          className="input input-bordered w-full"
          placeholder="Patient email"
          value={form.patientEmail}
          onChange={(e) => setForm({ ...form, patientEmail: e.target.value })}
          required
        />
        <input
          className="input input-bordered w-full"
          placeholder="Patient name"
          value={form.patientName}
          onChange={(e) => setForm({ ...form, patientName: e.target.value })}
          required
        />
        <input
          className="input input-bordered w-full"
          placeholder="Diagnosis"
          value={form.diagnosis}
          onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
          required
        />
        <textarea
          className="textarea textarea-bordered w-full"
          placeholder="Medicines (one per line)"
          value={form.medicines}
          onChange={(e) => setForm({ ...form, medicines: e.target.value })}
          required
        />
        <textarea
          className="textarea textarea-bordered w-full"
          placeholder="Additional notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
        <button type="submit" className="btn btn-primary w-full">Save Prescription</button>
        {saved && <p className="text-success text-sm">Prescription saved!</p>}
      </form>

      <div className="space-y-4">
        {prescriptions.map((p) => (
          <div key={p._id} className="bg-base-200 p-4 rounded-xl">
            <p className="font-semibold">{p.patientName} — {p.patientEmail}</p>
            <p className="text-sm mt-1"><span className="font-medium">Diagnosis:</span> {p.diagnosis}</p>
            <p className="text-sm"><span className="font-medium">Medicines:</span> {p.medicines}</p>
            {p.notes && <p className="text-sm"><span className="font-medium">Notes:</span> {p.notes}</p>}
            <p className="text-xs text-gray-400 mt-2">{new Date(p.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrescriptionsPage;