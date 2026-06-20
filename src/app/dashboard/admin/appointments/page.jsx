"use client";
import { useEffect, useState } from "react";

const statusColors = {
  pending: "badge-warning",
  accepted: "badge-info",
  completed: "badge-success",
  cancelled: "badge-error",
};

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/appointments`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setAppointments)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center mt-20"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Appointments</h1>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Slot</th>
              <th>Fee</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a._id}>
                <td>{a.patientName}</td>
                <td>{a.doctorName}</td>
                <td>{a.date}</td>
                <td>{a.slot}</td>
                <td>${a.fee}</td>
                <td>
                  <span className={`badge ${statusColors[a.appointmentStatus]}`}>
                    {a.appointmentStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAppointments;