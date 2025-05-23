"use client"
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathName = usePathname()

  const dontShow = ["/authentication/register"]
  if (dontShow.includes(pathName)) return null

  
  return (
    <section className="relative ">
      <Sidebar className="mt-14 border-none">
        <SidebarContent className="md:z-10 sm:-z-10 sm: mt-14 md:mt-0  bg-white dark:bg-sidebar ">
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent >
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <div className="absolute mt-14 md:-right-5 -right-5 z-20 h-screen  border-gray-200">
        <div className="absolute mt-14 right-4 ">
          <SidebarTrigger className="fixed z-30 top-20 " />
          <div className="fixed ml-4 z-20 top-14 border-r h-screen"></div>
        </div>
      </div>
    </section>
  )
}