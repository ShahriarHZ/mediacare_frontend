"use client";
import { useEffect, useState } from "react";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/users`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setUsers)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (email, role) => {
    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/users/role/${email}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ role }),
    });
    fetchUsers();
  };

  const handleDelete = async (email) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/users/${email}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchUsers();
  };

  if (loading) return <div className="flex justify-center mt-20"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <select
                    className="select select-bordered select-xs"
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.email, e.target.value)}
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <span className="badge badge-success">{u.status}</span>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(u.email)}
                    className="btn btn-xs btn-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;