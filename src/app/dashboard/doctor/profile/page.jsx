"use client";
import { useEffect, useState } from "react";
import useRole from "@/hooks/useRole";
import toast from "react-hot-toast";

const DoctorProfile = () => {
  const { session } = useRole();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    doctorName: "",
    specialization: "",
    degree: "",
    experienceYears: "",
    appointmentFee: "",
    hospital: "",
    bio: "",
  });
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = () => {
    if (!session?.user?.email) return;
    setFetching(true);
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/doctors/profile/${session.user.email}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const loaded = {
          doctorName: data?.doctorName || session.user.name || "",
          specialization: data?.specialization || "",
          degree: data?.degree || "",
          experienceYears: data?.experienceYears || "",
          appointmentFee: data?.appointmentFee || "",
          hospital: data?.hospital || "",
          bio: data?.bio || "",
        };
        setProfile(loaded);
        setForm(loaded);
        // If profile is essentially empty (first time), start in edit mode
        if (!data?.specialization && !data?.appointmentFee) {
          setIsEditing(true);
        }
      })
      .catch(() => toast.error("Could not load profile."))
      .finally(() => setFetching(false));
  };

  useEffect(() => {
    fetchProfile();
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/doctors/profile/${session.user.email}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          email: session.user.email,
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("Profile saved successfully!");
      setProfile(form);
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(profile);
    setIsEditing(false);
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <span className="loading loading-spinner loading-lg text-teal-600"></span>
      </div>
    );
  }

  // ---- VIEW MODE (card) ----
  if (!isEditing && profile) {
    return (
      <div className="max-w-2xl mx-auto my-6 p-6 sm:p-10 bg-white border border-slate-100 shadow-xl shadow-slate-100/40 rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <span className="bg-teal-50 text-teal-600 p-1 rounded-lg text-lg">🩺</span>
              <span>Doctor Profile</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Your public practitioner information.</p>
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
            {session?.user?.image ? (
              <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              profile.doctorName?.charAt(0).toUpperCase() || "D"
            )}
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800">Dr. {profile.doctorName || "Unnamed"}</p>
            <p className="text-xs text-teal-600 font-semibold">{profile.specialization || "Specialization not set"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Degree</p>
            <p className="text-sm font-semibold text-slate-700">{profile.degree || "Not provided"}</p>
          </div>
          <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Experience</p>
            <p className="text-sm font-semibold text-slate-700">{profile.experienceYears || 0} Years</p>
          </div>
          <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Consultation Fee</p>
            <p className="text-sm font-semibold text-slate-700">${Number(profile.appointmentFee || 0).toFixed(2)}</p>
          </div>
          <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Hospital / Clinic</p>
            <p className="text-sm font-semibold text-slate-700">{profile.hospital || "Not provided"}</p>
          </div>
          <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-4 sm:col-span-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Bio</p>
            <p className="text-sm font-semibold text-slate-700">{profile.bio || "Not provided"}</p>
          </div>
        </div>
      </div>
    );
  }

  // ---- EDIT MODE (form) ----
  return (
    <div className="max-w-lg mx-auto my-6 p-6 sm:p-8 bg-white border border-slate-100 shadow-xl shadow-slate-100/40 rounded-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Doctor Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="input input-bordered w-full" placeholder="Full name"
          value={form.doctorName} onChange={(e) => setForm({ ...form, doctorName: e.target.value })} />
        <input className="input input-bordered w-full" placeholder="Specialization"
          value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
        <input className="input input-bordered w-full" placeholder="Degree"
          value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} />
        <input className="input input-bordered w-full" placeholder="Years of experience"
          type="number" value={form.experienceYears}
          onChange={(e) => setForm({ ...form, experienceYears: Number(e.target.value) })} />
        <input className="input input-bordered w-full" placeholder="Consultation fee ($)"
          type="number" value={form.appointmentFee}
          onChange={(e) => setForm({ ...form, appointmentFee: Number(e.target.value) })} />
        <input className="input input-bordered w-full" placeholder="Hospital / Clinic"
          value={form.hospital} onChange={(e) => setForm({ ...form, hospital: e.target.value })} />
        <textarea className="textarea textarea-bordered w-full" placeholder="Bio"
          value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />

        <div className="flex gap-3 pt-2">
          {profile && (
            <button type="button" onClick={handleCancel} disabled={saving} className="btn btn-ghost flex-1">
              Cancel
            </button>
          )}
          <button type="submit" disabled={saving} className="btn btn-primary flex-1">
            {saving ? <span className="loading loading-spinner loading-sm"></span> : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorProfile;