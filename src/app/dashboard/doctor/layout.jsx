import DoctorRoute from "@/components/DoctorRoute";
import Link from "next/link";

export default function DoctorDashboardLayout({ children }) {
  return (
    <DoctorRoute>
      <div className="flex min-h-screen">
        <aside className="w-64 bg-base-200 p-6 space-y-2">
          <h2 className="text-lg font-bold mb-4">Doctor Dashboard</h2>
          <Link href="/dashboard/doctor" className="btn btn-ghost w-full justify-start">Overview</Link>
          <Link href="/dashboard/doctor/appointments" className="btn btn-ghost w-full justify-start">Appointments</Link>
          <Link href="/dashboard/doctor/schedule" className="btn btn-ghost w-full justify-start">My Schedule</Link>
          <Link href="/dashboard/doctor/prescriptions" className="btn btn-ghost w-full justify-start">Prescriptions</Link>
          <Link href="/dashboard/doctor/profile" className="btn btn-ghost w-full justify-start">Profile</Link>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </DoctorRoute>
  );
}