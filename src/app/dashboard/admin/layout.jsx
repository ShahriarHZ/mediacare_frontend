import AdminRoute from "@/components/AdminRoute";
import Link from "next/link";

export default function AdminDashboardLayout({ children }) {
  return (
    <AdminRoute>
      <div className="flex min-h-screen">
        <aside className="w-64 bg-base-200 p-6 space-y-2">
          <h2 className="text-lg font-bold mb-4">Admin Dashboard</h2>
          <Link href="/dashboard/admin" className="btn btn-ghost w-full justify-start">Overview</Link>
          <Link href="/dashboard/admin/users" className="btn btn-ghost w-full justify-start">Manage Users</Link>
          <Link href="/dashboard/admin/doctors" className="btn btn-ghost w-full justify-start">Manage Doctors</Link>
          <Link href="/dashboard/admin/appointments" className="btn btn-ghost w-full justify-start">Appointments</Link>
          <Link href="/dashboard/admin/payments" className="btn btn-ghost w-full justify-start">Payments</Link>
          <Link href="/dashboard/admin/analytics" className="btn btn-ghost w-full justify-start">Analytics</Link>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </AdminRoute>
  );
}