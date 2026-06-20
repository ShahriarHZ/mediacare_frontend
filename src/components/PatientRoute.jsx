"use client";
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
// 1. FIXED: Removed curly braces to match the default export hook
import useRole from "@/hooks/useRole"; 

const PatientRoute = ({ children }) => {
  // 2. Extracted keys matching our hook fallback structure
  const { role, loading, user } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (role !== "patient") {
        router.push("/");
      }
    }
  }, [role, loading, user, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-teal-600"></span>
      </div>
    );
  }

  return user && role === "patient" ? children : null;
};

export default PatientRoute;