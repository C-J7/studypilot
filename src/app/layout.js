"use client";

import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { useState } from 'react';

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <button onClick={toggleTheme} style={{ position: 'fixed', top: '1rem', right: '1rem' }}>
          Toggle Theme
        </button>
        {children}
      </body>
    </html>
  );
}
