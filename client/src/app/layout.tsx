
import Navbar from "@/components/Navbar";
import "./globals.css";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Metadata } from "next";


export const metadata : Metadata = {
  title: 'My App',
  description: 'Using Next.js',
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en " >
      
      <body className="w-full ">
        <Navbar/>
        <ThemeSwitcher /> 
        {children}
      </body>
    </html>
  );
}

