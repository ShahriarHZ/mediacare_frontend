"use client";

import { useEffect, useState } from "react";
import useRole from "@/hooks/useRole";
import { apiFetch } from "@/lib/api";
import toast from "react-hot-toast";

export default function AdminProfile() {
  const { user, session, loading } = useRole();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({ name: "", phone: "", address: "" });
  const [form, setForm] = useState(profile);
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    setFetching(true);
    apiFetch(`/users/profile/${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        const loaded = { name: data?.name || user.name || "", phone: data?.phone || "", address: data?.address || "" };
        setProfile(loaded);
        setForm(loaded);
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiFetch(`/users/profile/${user.email}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Profile updated.");
      setProfile(form);
      setIsEditing(false);
    } catch {
      toast.error("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || fetching) return <div className="flex justify-center mt-20"><span className="loading loading-spinner loading-lg text-teal-600"></span></div>;

  if (!isEditing) {
    return (
      <div className="max-w-2xl mx-auto my-6 p-6 sm:p-10 bg-white border border-slate-100 shadow-xl rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <span className="bg-teal-50 text-teal-600 p-1 rounded-lg">🛡️</span> Admin Profile
          </h1>
          <button onClick={() => setIsEditing(true)} className="btn btn-sm bg-teal-600 hover:bg-teal-700 border-none text-white rounded-xl">
            Edit Profile
          </button>
        </div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xl overflow-hidden">
            {session?.user?.image ? <img src={session.user.image} alt="Admin" className="w-full h-full object-cover" /> : profile.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800">{profile.name || "Admin"}</p>
            <p className="text-xs text-slate-400 font-mono">{user?.email}</p>
            <span className="badge bg-teal-50 text-teal-700 border-teal-100 text-xs font-bold mt-1">Administrator</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</p>
            <p className="text-sm font-semibold text-slate-700">{profile.phone || "Not provided"}</p>
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
    <div className="max-w-2xl mx-auto my-6 p-6 sm:p-10 bg-white border border-slate-100 shadow-xl rounded-2xl">
      <h1 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
        <span className="bg-teal-50 text-teal-600 p-1 rounded-lg">✏️</span> Edit Admin Profile
      </h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="form-control">
          <label className="label py-1"><span className="label-text font-semibold text-slate-600 text-xs uppercase tracking-wider">Full Name</span></label>
          <input className="input input-bordered w-full bg-slate-50/50 rounded-xl" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="form-control">
          <label className="label py-1"><span className="label-text font-semibold text-slate-600 text-xs uppercase tracking-wider">Phone</span></label>
          <input className="input input-bordered w-full bg-slate-50/50 rounded-xl" placeholder="+880 17XXXXXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div className="form-control">
          <label className="label py-1"><span className="label-text font-semibold text-slate-600 text-xs uppercase tracking-wider">Address</span></label>
          <textarea className="textarea textarea-bordered w-full bg-slate-50/50 rounded-xl" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => { setForm(profile); setIsEditing(false); }} disabled={saving} className="btn btn-ghost flex-1 rounded-xl">Cancel</button>
          <button type="submit" disabled={saving} className="btn bg-teal-600 hover:bg-teal-700 border-none text-white flex-1 rounded-xl">
            {saving ? <span className="loading loading-spinner loading-sm"></span> : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}