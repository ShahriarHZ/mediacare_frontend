"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    await signIn.email({
      email: form.email,
      password: form.password,
      fetchOptions: {
        onSuccess: () => {
          toast.success("Welcome back!");
          router.push("/");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Authentication failed.");
          setProcessing(false);
        },
      },
    });
  };

  const handleGoogle = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      toast.error("Failed to initialize Google login.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <div className="card bg-white shadow-xl w-full max-w-md border border-slate-100 rounded-2xl">
        <div className="card-body p-8">
          <h1 className="text-2xl font-bold text-center text-slate-800 mb-2">Welcome Back</h1>
          <p className="text-center text-slate-500 mb-6 text-sm">
            Login to your MediCare Connect account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-semibold text-slate-600">Email</span>
              </label>
              <input
                className="input input-bordered w-full bg-white text-slate-800"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-semibold text-slate-600">Password</span>
              </label>
              <input
                className="input input-bordered w-full bg-white text-slate-800"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              disabled={processing}
              className="btn bg-[#0d5c4e] hover:bg-[#0a463b] text-white border-none w-full font-bold transition-all rounded-xl mt-2"
            >
              {processing ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="divider text-slate-400 my-6 text-xs font-semibold">OR</div>

          <button
            onClick={handleGoogle}
            type="button"
            className="btn btn-outline border-slate-200 text-slate-700 hover:bg-slate-50 w-full gap-2 rounded-xl font-semibold"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.4-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.2C40.7 35.8 44 30.3 44 24c0-1.3-.1-2.7-.4-4z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#0d5c4e] font-bold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}