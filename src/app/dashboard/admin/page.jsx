"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

const AdminOverview = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    apiFetch(`/dashboard/admin/stats`)
      .then((res) => res.json())
      .then(setStats);
  }, []);

  if (!stats) return <div className="flex justify-center mt-20"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="stat bg-base-200 rounded-xl">
          <div className="stat-title">Total Users</div>
          <div className="stat-value">{stats.totalUsers}</div>
        </div>
        <div className="stat bg-base-200 rounded-xl">
          <div className="stat-title">Total Doctors</div>
          <div className="stat-value">{stats.totalDoctors}</div>
        </div>
        <div className="stat bg-base-200 rounded-xl">
          <div className="stat-title">Pending Verifications</div>
          <div className="stat-value text-warning">{stats.pendingDoctors}</div>
        </div>
        <div className="stat bg-base-200 rounded-xl">
          <div className="stat-title">Total Appointments</div>
          <div className="stat-value">{stats.totalAppointments}</div>
        </div>
        <div className="stat bg-base-200 rounded-xl">
          <div className="stat-title">Total Revenue</div>
          <div className="stat-value text-success">${stats.totalRevenue}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;