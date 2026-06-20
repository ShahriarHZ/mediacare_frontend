"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useRole from "@/hooks/useRole";

const AdminRoute = ({ children }) => {
  const { role, roleLoading, session } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (roleLoading) return;
    if (!session?.user) return router.push("/login");
    if (role !== "admin") return router.push("/");
  }, [roleLoading, role, session, router]);

  if (roleLoading || role !== "admin") {
    return <div className="flex justify-center mt-20"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  return children;
};

export default AdminRoute;