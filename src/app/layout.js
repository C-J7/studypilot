"use client";

import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext"; //Use AuthProvider to verify login state and info
import { DashboardProvider } from "@/contexts/DashboardContext"; //Import DashboardProvider

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <DashboardProvider>
            {children}
          </DashboardProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
