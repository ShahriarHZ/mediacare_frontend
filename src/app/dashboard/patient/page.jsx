"use client";

import { useEffect, useState } from "react";
import useRole from "@/hooks/useRole";
import { apiFetch } from "@/lib/api";

const StatCard = ({ label, value, icon }) => (
  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <span className="text-2xl">{icon}</span>
    </div>
    <p className="text-2xl font-black text-slate-800">{value}</p>
    <p className="text-xs text-slate-400 font-medium mt-1">{label}</p>
  </div>
);

export default function PatientOverviewPage() {
  const { user, loading: roleLoading } = useRole();
  const [stats, setStats] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    setFetching(true);
    apiFetch(`/dashboard/patient/stats/${user.email}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setStats(data))
      .catch(() => setStats(null))
      .finally(() => setFetching(false));
  }, [user]);

  if (roleLoading || fetching) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <span className="loading loading-spinner loading-lg text-teal-600"></span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <span className="bg-teal-50 text-teal-600 p-1 rounded-lg text-lg">📊</span>
          <span>Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Here`s a quick snapshot of your healthcare activity.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Appointments" value={stats?.totalAppointments ?? 0} icon="📅" />
        <StatCard label="Pending" value={stats?.pendingAppointments ?? 0} icon="⏳" />
        <StatCard label="Completed" value={stats?.completedAppointments ?? 0} icon="✅" />
        <StatCard label="Total Spent" value={`$${Number(stats?.totalSpent ?? 0).toFixed(2)}`} icon="💳" />
      </div>
    </div>
  );
}