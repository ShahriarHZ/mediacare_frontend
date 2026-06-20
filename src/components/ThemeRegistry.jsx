"use client";

import { ThemeProvider } from "next-themes";

export function ThemeRegistry({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
      {children}
    </ThemeProvider>
  );
}