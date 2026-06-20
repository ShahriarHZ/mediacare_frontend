"use client";
import { useEffect, useState } from "react";

const statusColors = {
  pending: "badge-warning",
  verified: "badge-success",
  rejected: "badge-error",
};

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = () => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/doctors`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setDoctors)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDoctors(); }, []);

  const handleVerify = async (id) => {
    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/doctors/verify/${id}`, {
      method: "PATCH",
      credentials: "include",
    });
    fetchDoctors();
  };

  const handleReject = async (id) => {
    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/doctors/reject/${id}`, {
      method: "PATCH",
      credentials: "include",
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
                <td>{d.name}</td>
                <td>{d.specialization}</td>
                <td>{d.hospital}</td>
                <td>${d.fee}</td>
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