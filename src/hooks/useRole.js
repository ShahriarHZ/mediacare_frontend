"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";

// Changed "export function" to "export default function" to fix all build errors!
export default function useRole() {
  const { data: session, isPending: authLoading } = useSession();
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!session?.user?.email) {
      setRole(null);
      setRoleLoading(false);
      return;
    }

    setRoleLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/users/role/${session.user.email}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setRole(data.role);
      })
      .catch(() => {
        setRole("patient"); // Safe fallback
      })
      .finally(() => {
        setRoleLoading(false);
      });
  }, [session, authLoading]);

  // Included both 'session' and 'user' alongside statuses so ALL your dashboard files work seamlessly
  return { 
    role, 
    loading: authLoading || roleLoading, 
    roleLoading: authLoading || roleLoading, 
    user: session?.user,
    session: session 
  };
}