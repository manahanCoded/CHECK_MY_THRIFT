"use client"
import Navbar from "@/components/Navbar";
import "./globals.css";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { usePathname } from "next/navigation";
import { useState } from "react";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

 
  const hideNavigation = [""]
  return (
    <html lang="en " >
      <body className="w-full ">
      <SidebarProvider defaultOpen={true}>
          {!hideNavigation.includes(pathname) && <Navbar />}
          <AppSidebar />
          <ThemeSwitcher />
          {children}
        </SidebarProvider>
      </body>
    </html>
  );
}

