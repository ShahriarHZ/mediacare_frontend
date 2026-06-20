"use client";

import { useEffect, useState } from "react";
import useRole from "@/hooks/useRole";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";

const PatientProfileCard = () => {
  const { user, loading } = useRole();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    bloodGroup: "",
    age: "",
  });
  const [fetchingProfile, setFetchingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = () => {
    if (!user?.email) return;

    setFetchingProfile(true);
    apiFetch(`/users/profile/${user.email}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        const loaded = {
          name: data?.name || user.name || "",
          phone: data?.phone || "",
          address: data?.address || "",
          bloodGroup: data?.bloodGroup || "",
          age: data?.age || "",
        };
        setProfile(loaded);
        setForm(loaded);
      })
      .catch(() => {
        const fallback = { name: user.name || "", phone: "", address: "", bloodGroup: "", age: "" };
        setProfile(fallback);
        setForm(fallback);
      })
      .finally(() => setFetchingProfile(false));
  };

  useEffect(() => {
    if (user?.email) fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.email) return;

    setIsSaving(true);
    try {
      const res = await apiFetch(`/users/profile/${user.email}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      toast.success("Profile updated successfully!");
      setProfile(form);
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to save profile updates.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setForm(profile);
    setIsEditing(false);
  };

  if (loading || fetchingProfile) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <span className="loading loading-spinner loading-lg text-teal-600"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-8 bg-white border border-slate-100 rounded-2xl shadow-sm">
        <p className="text-slate-400 font-medium">Session unauthorized or expired. Please sign in.</p>
      </div>
    );
  }

  if (!isEditing) {
    return (
      <div className="max-w-2xl mx-auto my-6 p-6 sm:p-10 bg-white border border-slate-100 shadow-xl shadow-slate-100/40 rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <span className="bg-teal-50 text-teal-600 p-1 rounded-lg text-lg">👤</span>
              <span>My Profile</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Your personal health identity details.</p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-sm bg-teal-600 hover:bg-teal-700 border-none text-white rounded-xl"
          >
            Edit Profile
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-teal-100 overflow-hidden">
            {user?.image ? (
              <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              profile.name?.charAt(0).toUpperCase() || "P"
            )}
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800">{profile.name || "Unnamed Patient"}</p>
            <p className="text-xs text-slate-400 font-mono">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</p>
            <p className="text-sm font-semibold text-slate-700">{profile.phone || "Not provided"}</p>
          </div>
          <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Age</p>
            <p className="text-sm font-semibold text-slate-700">{profile.age || "Not provided"}</p>
          </div>
          <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Blood Group</p>
            <p className="text-sm font-semibold text-slate-700">{profile.bloodGroup || "Not provided"}</p>
          </div>
          <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-4 sm:col-span-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Address</p>
            <p className="text-sm font-semibold text-slate-700">{profile.address || "Not provided"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-6 p-6 sm:p-10 bg-white border border-slate-100 shadow-xl shadow-slate-100/40 rounded-2xl">
      <div className="border-b border-slate-100 pb-5 mb-6">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <span className="bg-teal-50 text-teal-600 p-1 rounded-lg text-lg">✏️</span>
          <span>Edit Profile</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text font-semibold text-slate-600 text-xs uppercase tracking-wider">Legal Full Name</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full bg-slate-50/50 rounded-xl"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-semibold text-slate-600 text-xs uppercase tracking-wider">Phone</span>
            </label>
            <input
              type="tel"
              className="input input-bordered w-full bg-slate-50/50 rounded-xl"
              placeholder="+880 17XXXXXXXX"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-semibold text-slate-600 text-xs uppercase tracking-wider">Age</span>
            </label>
            <input
              type="number"
              className="input input-bordered w-full bg-slate-50/50 rounded-xl"
              placeholder="e.g. 24"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
            />
          </div>
        </div>

        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text font-semibold text-slate-600 text-xs uppercase tracking-wider">Blood Group</span>
          </label>
          <select
            className="select select-bordered w-full bg-slate-50/50 rounded-xl"
            value={form.bloodGroup}
            onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
          >
            <option value="">Select blood group</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>

        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text font-semibold text-slate-600 text-xs uppercase tracking-wider">Address</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full bg-slate-50/50 rounded-xl min-h-[90px]"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleCancelEdit}
            disabled={isSaving}
            className="btn btn-ghost flex-1 rounded-xl text-slate-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="btn bg-teal-600 hover:bg-teal-700 border-none text-white flex-1 rounded-xl font-semibold"
          >
            {isSaving ? <span className="loading loading-spinner loading-sm"></span> : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientProfileCard;