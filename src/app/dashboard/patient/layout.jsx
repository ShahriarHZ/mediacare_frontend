import PatientRoute from "@/components/PatientRoute";
import Link from "next/link";

export default function PatientDashboardLayout({ children }) {
  return (
    <PatientRoute>
      <div className="flex min-h-screen">
        <aside className="w-64 bg-base-200 p-6 space-y-2">
          <h2 className="text-lg font-bold mb-4">Patient Dashboard</h2>
          <Link href="/dashboard/patient" className="btn btn-ghost w-full justify-start">Overview</Link>
          <Link href="/dashboard/patient/appointments" className="btn btn-ghost w-full justify-start">My Appointments</Link>
          <Link href="/dashboard/patient/payments" className="btn btn-ghost w-full justify-start">Payment History</Link>
          <Link href="/dashboard/patient/reviews" className="btn btn-ghost w-full justify-start">My Reviews</Link>
          <Link href="/dashboard/patient/profile" className="btn btn-ghost w-full justify-start">Profile</Link>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </PatientRoute>
  );
}