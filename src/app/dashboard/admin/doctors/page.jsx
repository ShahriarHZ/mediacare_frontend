"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

const statusColors = {
  pending: "badge-warning",
  verified: "badge-success",
  rejected: "badge-error",
};

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = () => {
    apiFetch(`/admin/doctors`)
      .then((res) => res.json())
      .then(setDoctors)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDoctors(); }, []);

  const handleVerify = async (id) => {
    await apiFetch(`/admin/doctors/verify/${id}`, {
      method: "PATCH",
    });
    fetchDoctors();
  };

  const handleReject = async (id) => {
    await apiFetch(`/admin/doctors/reject/${id}`, {
      method: "PATCH",
    });
    fetchDoctors();
  };

  if (loading) return <div className="flex justify-center mt-20"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Doctors</h1>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialization</th>
              <th>Hospital</th>
              <th>Fee</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((d) => (
              <tr key={d._id}>
                <td>{d.doctorName || d.name}</td>
                <td>{d.specialization}</td>
                <td>{d.hospital}</td>
                <td>${Number(d.appointmentFee ?? d.fee ?? 0).toFixed(2)}</td>
                <td>
                  <span className={`badge ${statusColors[d.verificationStatus]}`}>
                    {d.verificationStatus}
                  </span>
                </td>
                <td className="space-x-2">
                  {d.verificationStatus !== "verified" && (
                    <button
                      onClick={() => handleVerify(d._id)}
                      className="btn btn-xs btn-success"
                    >
                      Verify
                    </button>
                  )}
                  {d.verificationStatus !== "rejected" && (
                    <button
                      onClick={() => handleReject(d._id)}
                      className="btn btn-xs btn-error"
                    >
                      Reject
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageDoctors;