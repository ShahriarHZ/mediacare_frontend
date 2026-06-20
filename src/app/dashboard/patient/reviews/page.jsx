"use client";

import { useEffect, useState } from "react";
import useRole from "@/hooks/useRole";
import toast from "react-hot-toast";

const MyReviews = () => {
  const { user, loading: roleLoading } = useRole();
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ doctorName: "", rating: 5, comment: "" });
  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = () => {
    if (!user?.email) return;

    setFetching(true);
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/reviews/patient/${user.email}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setReviews(data || []))
      .catch(() => toast.error("Failed to sync historical feedback logs."))
      .finally(() => setFetching(false));
  };

  useEffect(() => {
    if (!roleLoading) {
      fetchReviews();
    }
  }, [user, roleLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.email) {
      toast.error("Session unauthorized. Please sign in.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          patientEmail: user.email,
          patientName: user.name || "Anonymous Patient",
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("Feedback submitted successfully!");
      setForm({ doctorName: "", rating: 5, comment: "" });
      fetchReviews();
    } catch (err) {
      toast.error("Failed to dispatch your feedback to the server.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this review?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/reviews/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error();

      toast.success("Review deleted successfully.");
      fetchReviews();
    } catch (err) {
      toast.error("Failed to remove review context.");
    }
  };

  if (roleLoading || fetching) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] gap-3">
        <span className="loading loading-spinner loading-lg text-teal-600"></span>
        <p className="text-xs text-slate-400 font-medium tracking-wide">Syncing Feedback Ledger...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-4 p-4 sm:p-8 bg-white border border-slate-100 shadow-xl shadow-slate-100/40 rounded-2xl">

      <div className="border-b border-slate-100 pb-5 mb-8">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <span className="bg-teal-50 text-teal-600 p-1 rounded-lg text-lg">⭐</span>
          <span>My Feedbacks & Reviews</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Log an evaluation summary for a doctor or look over old remarks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        <div className="lg:col-span-5 bg-slate-50/70 border border-slate-200/60 p-5 sm:p-6 rounded-2xl shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <span>✍️</span> Publish Feedback
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-semibold text-slate-600 text-xs uppercase tracking-wider">Practitioner Name</span>
              </label>
              <input
                className="input input-bordered focus:input-teal w-full bg-white rounded-xl"
                placeholder="e.g. Dr. Sarah Rahman"
                value={form.doctorName}
                onChange={(e) => setForm({ ...form, doctorName: e.target.value })}
                required
              />
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-semibold text-slate-600 text-xs uppercase tracking-wider">Rating Score</span>
              </label>
              <select
                className="select select-bordered focus:select-teal w-full bg-white rounded-xl"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{r} Stars {"★".repeat(r)}</option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-semibold text-slate-600 text-xs uppercase tracking-wider">Review Narrative</span>
              </label>
              <textarea
                className="textarea textarea-bordered focus:textarea-teal w-full bg-white rounded-xl min-h-[100px] leading-relaxed"
                placeholder="Share details of your clinical experience or treatment guidance..."
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn bg-teal-600 hover:bg-teal-700 active:bg-teal-800 border-none text-white w-full rounded-xl font-semibold tracking-wide shadow-sm shadow-teal-100 transition-all"
            >
              {submitting ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "File Official Review"
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span>📜</span> Historical Submission History ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/30">
              <p className="text-sm font-medium text-slate-400">No review logs found under your signature.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[580px] overflow-y-auto pr-2 custom-scrollbar">
              {reviews.map((r) => (
                <div
                  key={r._id}
                  className="p-5 bg-white border border-slate-100 rounded-2xl flex flex-col justify-between hover:shadow-md transition-all duration-200"
                >
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                        <span>🩺</span> {r.doctorName}
                      </h3>
                      <p className="text-amber-500 text-xs tracking-wider mt-1 drop-shadow-sm">
                        {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDelete(r._id)}
                      className="btn btn-ghost hover:bg-rose-50 text-slate-300 hover:text-rose-600 btn-xs rounded-lg font-bold transition-colors"
                    >
                      Delete
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50/70 p-3 rounded-xl border border-slate-100/60 mt-1">
                    {r.comment || "No commentary text detailed."}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MyReviews;