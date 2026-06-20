import { authClient } from "@/lib/auth-client";

export async function apiFetch(path, options = {}) {
  const session = await authClient.getSession();
  const token = session?.data?.session?.token;

  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });
}