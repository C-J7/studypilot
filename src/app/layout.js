"use client";

import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext"; //Use AuthProvider to verify login state and info

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
