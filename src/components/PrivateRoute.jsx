"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useRole from "@/hooks/useRole";

const PrivateRoute = ({ children }) => {
  const { session, roleLoading } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (!roleLoading && !session?.user) {
      router.push("/login");
    }
  }, [roleLoading, session, router]);

  if (roleLoading) {
    return <div className="flex justify-center mt-20"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  if (!session?.user) return null;

  return children;
};

export default PrivateRoute;