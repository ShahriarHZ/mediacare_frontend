"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useRole from "@/hooks/useRole";

const statusColors = {
  pending: "badge-warning",
  accepted: "badge-info",
  completed: "badge-success",
  cancelled: "badge-error",
};

const DoctorAppointments = () => {
  const { session } = useRole();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchAppointments = () => {
    if (!session?.user?.email) return;
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/appointments/doctor/${session.user.email}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setAppointments)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAppointments(); }, [session]);

  const handleAction = async (id, action) => {
    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/appointments/${action}/${id}`, {
      method: "PATCH",
      credentials: "include",
    });
    if (action === "complete") {
      router.push(`/dashboard/doctor/prescriptions?appointmentId=${id}`);
    } else {
      fetchAppointments();
    }
  };

  const goToPrescription = (id) => {
    router.push(`/dashboard/doctor/prescriptions?appointmentId=${id}`);
  };

  if (loading) return <div className="flex justify-center mt-20"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Appointments</h1>
      {appointments.length === 0 ? (
        <p className="text-gray-500">No appointments yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Problem / Symptoms</th>
                <th>Date</th>
                <th>Slot</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a._id} className="hover">
                  <td>
                    <div className="font-bold">{a.patientName}</div>
                    <div className="text-xs opacity-75">{a.patientEmail}</div>
                  </td>
                  <td className="max-w-xs">
                    <p className="truncate text-sm" title={a.problem || "No description"}>
                      {a.problem || <span className="text-gray-400 italic">No description</span>}
                    </p>
                  </td>
                  <td>{a.date}</td>
                  <td>{a.slot}</td>
                  <td>
                    <span className={`badge ${statusColors[a.appointmentStatus]}`}>
                      {a.appointmentStatus}
                    </span>
                  </td>
                  <td className="space-x-2 whitespace-nowrap">
                    {a.appointmentStatus === "pending" && (
                      <button onClick={() => handleAction(a._id, "accept")} className="btn btn-xs btn-info">
                        Accept
                      </button>
                    )}
                    {a.appointmentStatus === "accepted" && (
                      <>
                        <button onClick={() => goToPrescription(a._id)} className="btn btn-xs btn-outline">
                          Prescribe
                        </button>
                        <button onClick={() => handleAction(a._id, "complete")} className="btn btn-xs btn-success">
                          Complete
                        </button>
                      </>
                    )}
                    {a.appointmentStatus === "completed" && (
                      <button onClick={() => goToPrescription(a._id)} className="btn btn-xs btn-outline">
                        View Rx
                      </button>
                    )}
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

export default DoctorAppointments;