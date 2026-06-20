"use client";
import { useEffect, useState } from "react";
import useRole from "@/hooks/useRole";

const DoctorOverview = () => {
  const { session } = useRole();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!session?.user?.email) return;
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard/doctor/stats/${session.user.email}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setStats);
  }, [session]);

  if (!stats) return <div className="flex justify-center mt-20"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Welcome, Dr. {session?.user?.name}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat bg-base-200 rounded-xl">
          <div className="stat-title">Total Appointments</div>
          <div className="stat-value">{stats.totalAppointments}</div>
        </div>
        <div className="stat bg-base-200 rounded-xl">
          <div className="stat-title">Pending</div>
          <div className="stat-value text-warning">{stats.pending}</div>
        </div>
        <div className="stat bg-base-200 rounded-xl">
          <div className="stat-title">Completed</div>
          <div className="stat-value text-success">{stats.completed}</div>
        </div>
        <div className="stat bg-base-200 rounded-xl">
          <div className="stat-title">Total Earned</div>
          <div className="stat-value">${stats.totalEarned}</div>
        </div>
      </div>
    </div>
  );
};

export default DoctorOverview;