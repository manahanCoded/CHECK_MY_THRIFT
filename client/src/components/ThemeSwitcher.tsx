"use client";

import { useTheme } from "@/lib/useTheme";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect } from "react";

export default function ThemeSwitcher() {
  const { theme, setTheme, mode, setMode } = useTheme();


  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') || 'light';
    setMode(savedMode);
    if (savedMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [setMode]);

  const handleModeToggle = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
    
    if (newMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };



  const availableThemeColors = [
    { name: 'Zinc', light: 'bg-zinc-500', dark: 'bg-zinc-700' },
    { name: 'Red', light: 'bg-red-500', dark: 'bg-red-700' },
    { name: 'Rose', light: 'bg-rose-500', dark: 'bg-rose-700' },
    { name: 'Blue', light: 'bg-blue-500', dark: 'bg-blue-700' },
    { name: 'Green', light: 'bg-green-500', dark: 'bg-green-700' },
    { name: 'Orange', light: 'bg-orange-500', dark: 'bg-orange-700' },
    { name: 'Yellow', light: 'bg-yellow-500', dark: 'bg-yellow-700' },
    { name: 'Violet', light: 'bg-violet-500', dark: 'bg-violet-700' },
  ];

  return (
    <section
      className={`fixed bottom-6  right-3.5 z-10 text-primary drop-shadow-[0_0_0.3rem_#ffffff70]`}
    >
      <div className="flex items-center gap-2">
        <Select value={theme} onValueChange={setTheme}>
          <SelectTrigger className="rounded-full border-none p-2 !bg-white !text-black">
            <SelectValue className="" placeholder="Select Theme" />
          </SelectTrigger>
          <SelectContent>
            {availableThemeColors.map((themeColor) => (
              <div key={themeColor.name}>
                <SelectItem value={`${themeColor.name.toLowerCase()}`}>
                  <div className="flex items-center space-x-3">
                    <div
                      className={`h-[20px] w-[20px] rounded-full ${
                        mode === 'light' ? themeColor.light : themeColor.dark
                      }`}
                    ></div>
                    <div className="text-sm">{`${themeColor.name} `}</div>
                  </div>
                </SelectItem>
              </div>
            ))}
          </SelectContent>
        </Select>

        <Button
          size="icon"
          onClick={handleModeToggle}
          className="rounded-full !bg-white !text-black cursor-pointer"
        >
          {mode === 'light' ? (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          )}
        </Button>
      </div>
    </section>
  );
}