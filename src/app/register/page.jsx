"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient",
  });
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setProcessing(true);

    try {
     await signUp.email({
  email: form.email,
  password: form.password,
  name: form.name,
  role: form.role, // 👈 add this — gets picked up in ctx.body inside the hook
  fetchOptions: {
    onSuccess: () => {
      toast.success("Account created! Welcome to MediCare Connect.");
      router.push("/");
    },
    onError: (ctx) => {
      toast.error(ctx.error.message || "Registration failed.");
      setProcessing(false);
    },
  },
});
    } catch (err) {
      toast.error("An unexpected error occurred.");
      setProcessing(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      toast.error("Google authentication failed.");
    }
  };

  return (
    <div className="min-h-[90vh] grid grid-cols-1 lg:grid-cols-12 bg-slate-50">

      {/* Left Info Panel */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-400/10 rounded-full blur-2xl -ml-20 -mb-20"></div>

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-black tracking-tight text-white mb-16">
            <span className="bg-white/20 backdrop-blur-md text-white p-1.5 rounded-lg text-sm">🩺</span>
            <span>MediCare Connect</span>
          </Link>

          <div className="space-y-6 max-w-md">
            <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
              Your Health Journey Starts Here.
            </h2>
            <p className="text-teal-100/90 leading-relaxed text-sm">
              Connect with verified doctors, book appointments online, and manage your healthcare journey seamlessly.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 relative z-10 border-t border-white/10 pt-8">
          <div>
            <p className="text-2xl font-black text-white">99.4%</p>
            <p className="text-xs text-teal-200/80 mt-0.5">Patient Satisfaction Score</p>
          </div>
          <div>
            <p className="text-2xl font-black text-white">500+</p>
            <p className="text-xs text-teal-200/80 mt-0.5">Verified Medical Specialists</p>
          </div>
        </div>
      </div>

      {/* Right Registration Form */}
      <div className="col-span-1 lg:col-span-7 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-xl bg-white border border-slate-100 shadow-xl shadow-slate-100/40 rounded-2xl p-6 sm:p-10">

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-800">
              Create an Account
            </h1>
            <p className="text-slate-400 text-sm mt-1.5">
              Join MediCare Connect today.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text font-semibold text-slate-700 text-xs uppercase tracking-wider">Full Name</span>
                </label>
                <input
                  className="input input-bordered w-full bg-slate-50/50 text-slate-800 rounded-xl"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text font-semibold text-slate-700 text-xs uppercase tracking-wider">Email Address</span>
                </label>
                <input
                  className="input input-bordered w-full bg-slate-50/50 text-slate-800 rounded-xl"
                  type="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-semibold text-slate-700 text-xs uppercase tracking-wider">I am a</span>
              </label>
              <div className="grid grid-cols-2 gap-4 mt-1">
                <label className={`flex flex-col sm:flex-row items-center justify-center gap-3 border-2 rounded-xl p-3.5 cursor-pointer transition-all ${
                  form.role === "patient" ? "border-teal-500 bg-teal-50/50 text-teal-700 font-bold" : "border-slate-200 hover:bg-slate-50 text-slate-500"
                }`}>
                  <input type="radio" name="role" value="patient" className="hidden"
                    checked={form.role === "patient"} onChange={() => setForm({ ...form, role: "patient" })} />
                  <span className="text-xl">🧑‍⚕️</span>
                  <span className="text-sm">Patient</span>
                </label>

                <label className={`flex flex-col sm:flex-row items-center justify-center gap-3 border-2 rounded-xl p-3.5 cursor-pointer transition-all ${
                  form.role === "doctor" ? "border-teal-500 bg-teal-50/50 text-teal-700 font-bold" : "border-slate-200 hover:bg-slate-50 text-slate-500"
                }`}>
                  <input type="radio" name="role" value="doctor" className="hidden"
                    checked={form.role === "doctor"} onChange={() => setForm({ ...form, role: "doctor" })} />
                  <span className="text-xl">🩺</span>
                  <span className="text-sm">Doctor</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text font-semibold text-slate-700 text-xs uppercase tracking-wider">Password</span>
                </label>
                <input
                  className="input input-bordered w-full bg-slate-50/50 text-slate-800 rounded-xl"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>

              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text font-semibold text-slate-700 text-xs uppercase tracking-wider">Confirm Password</span>
                </label>
                <input
                  className="input input-bordered w-full bg-slate-50/50 text-slate-800 rounded-xl"
                  type="password"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="btn bg-teal-600 hover:bg-teal-700 border-none text-white w-full rounded-xl mt-3 font-semibold shadow-sm transition-all"
            >
              {processing ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Create Secure Account"
              )}
            </button>
          </form>

          <div className="divider text-slate-300 text-xs tracking-widest font-bold my-6 uppercase">Or</div>

          <button
            onClick={handleGoogle}
            type="button"
            className="btn btn-outline border-slate-200 hover:bg-slate-50 text-slate-600 w-full rounded-xl gap-3 font-medium"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.4-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.2C40.7 35.8 44 30.3 44 24c0-1.3-.1-2.7-.4-4z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-slate-400 mt-6 font-medium">
            Already registered?{" "}
            <Link href="/login" className="text-teal-600 font-bold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}