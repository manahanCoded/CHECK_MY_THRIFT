"use client"
import { Calendar, Home, Inbox, Search, Settings, X} from "lucide-react"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
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
import Image from "next/image"


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
  const {toggleSidebar} = useSidebar()


  return (
    <section className="relative text-primary ">
      <Sidebar className="mt-14 border-none">
        <SidebarContent className=" md:z-10 sm:-z-10 md:mt-0  bg-background text-primary">
          <SidebarGroup>
            <div className="md:hidden flex items-center  justify-between">
            <Image
              src="/Branding_Img/CMT_Logo.png"
              alt="Check My Thrift Logo"
              width={80}
              height={80}
              className=" select-none h-12 w-20 "
              draggable={false}
            />
            <X onClick={toggleSidebar} className="stroke-[1] size-8 cursor-pointer p-1 rounded-full hover:bg-secondary"/>
            </div>
            <SidebarGroupContent className="pl-2">
              <SidebarMenu className="mt-2">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a className="px-5.5 text-lg h-10" href={item.url}>
                        <item.icon className="!h-5.5 !w-5.5 stroke-[1.5] mr-1.5 " />
                        <span className="tracking-wide">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <div className="absolute md:block hidden mt-14 md:-right-5 -right-5 z-20 h-screen  border-gray-200">
        <div className="absolute mt-14 right-4 ">
          <SidebarTrigger className="fixed z-30 top-[4.8rem] h-8 w-8" />
          <div className="fixed ml-4 z-20 top-14 md:border-r h-screen"></div>
        </div>
      </div>
    </section>
  )
}