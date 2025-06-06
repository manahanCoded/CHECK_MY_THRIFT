import Navbar from "@/components/Navbar";
import "./globals.css";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { cookies } from "next/headers";
import React from "react";
import { Toaster } from "@/components/ui/sonner"
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})



export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="w-full">
        <SidebarProvider defaultOpen={defaultOpen}>
          <Navbar />
          <AppSidebar />
          <ThemeSwitcher />
          {children}
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  );
}
