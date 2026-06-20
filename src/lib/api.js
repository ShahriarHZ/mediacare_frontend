import { authClient } from "@/lib/auth-client";

export async function apiFetch(path, options = {}) {
  const session = await authClient.getSession();
  console.log("apiFetch session:", session); // TEMP DEBUG

  const token = session?.data?.session?.token;
  console.log("apiFetch token:", token); // TEMP DEBUG

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