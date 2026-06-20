"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client"; 
import useRole from "@/hooks/useRole"; 
import toast from "react-hot-toast";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { role, roleLoading } = useRole();

  useEffect(() => setMounted(true), []);

  const handleSignOut = async () => {
    try {
      await signOut({ 
        fetchOptions: { 
          onSuccess: () => { 
            toast.success("Disconnected."); 
            router.push("/login"); 
          } 
        } 
      });
    } catch (err) {
      toast.error("Failed to sign out.");
    }
  };

  const links = [
    { name: "Home", path: "/" },
    { name: "Find Doctors", path: "/doctors" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
  ];

  // Add role-based dashboard link
  if (session?.user && !roleLoading) {
    if (role === "doctor") links.push({ name: "Dashboard", path: "/dashboard/doctor" });
    else if (role === "patient") links.push({ name: "Dashboard", path: "/dashboard/patient/profile" });
    else if (role === "admin") links.push({ name: "Dashboard", path: "/dashboard/admin" });
  }

  if (!mounted) return null;

  return (
    <nav className="w-full bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="font-bold text-[#0d5c4e] dark:text-emerald-400 text-xl">
          MediCare Connect
        </Link>

        {/* Links */}
        <ul className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
          {links.map((link) => (
            <li key={link.path}>
              <Link 
                href={link.path} 
                className={pathname === link.path ? "text-[#0d5c4e] dark:text-emerald-400 border-b-2 border-[#0d5c4e] dark:border-emerald-400" : "hover:text-slate-900 dark:hover:text-white"}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? "☀️" : "🌙"}
          </button>

          {roleLoading ? (
            <span className="loading loading-spinner text-[#0d5c4e]"></span>
          ) : session?.user ? (
  <div className="dropdown dropdown-end">
    <div tabIndex={0} role="button" className="avatar placeholder">
      <div className="w-10 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-bold border border-slate-300 dark:border-slate-600">
        {session.user.image ? <img src={session.user.image} alt="User" /> : session.user.name?.charAt(0)}
      </div>
    </div>
    <ul tabIndex={0} className="mt-3 p-2 shadow-lg menu dropdown-content bg-white dark:bg-slate-800 rounded-box w-40 border border-slate-100 dark:border-slate-700">
      <li>
        <Link
          href={
            role === "doctor"
              ? "/dashboard/doctor/profile"
              : role === "admin"
              ? "/dashboard/admin/profile"
              : "/dashboard/patient/profile"
          }
          className="dark:text-white"
        >
          Profile
        </Link>
      </li>
      <li><button onClick={handleSignOut} className="text-rose-600 font-medium">Disconnect</button></li>
    </ul>
  </div>
) : (
            <div className="flex items-center gap-4 text-sm font-semibold">
              <Link href="/login" className="text-slate-700 dark:text-slate-300">Login</Link>
              <Link href="/register" className="bg-[#0d5c4e] text-white px-4 py-2 rounded-lg hover:bg-[#0a463b]">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;