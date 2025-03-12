"use client"

import type * as React from "react"
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  SmilePlus,
  Waves,
  Home,
  Settings,
  Heart,
} from "lucide-react"
import { useAuth } from "@/context/auth-context"

import { NavMain } from "./nav-main"
// NavCalendar removed as requested
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Workouts",
      url: "/workouts",
      icon: SmilePlus,
      items: [
        {
          title: "All Workouts",
          url: "/workouts",
        },
        {
          title: "Facial Fitness",
          url: "/workouts?category=Facial-Fitness",
        },
        {
          title: "Cardio",
          url: "/workouts?category=Cardio",
        },
        {
          title: "Power Flow",
          url: "/workouts?category=Power-Flow",
        },
      ],
    },
    {
      title: "Movements",
      url: "/movements",
      icon: Waves,
      items: [
        {
          title: "All Movements",
          url: "/movements",
        },
        {
          title: "Forehead",
          url: "/movements?category=Forehead",
        },
        {
          title: "Eyes",
          url: "/movements?category=Eyes",
        },
        {
          title: "Cheeks",
          url: "/movements?category=Cheeks",
        },
      ],
    },
    {
      title: "Favorites",
      url: "/favorites",
      icon: Heart,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  
  const userData = {
    name: user?.user_metadata?.name || user?.email?.split('@')[0] || 'User',
    email: user?.email || '',
    avatar: user?.user_metadata?.avatar_url || '',
  }

  return (
    <TooltipProvider>
      <Sidebar collapsible="icon" className="hidden md:block" {...props}>
        <SidebarHeader>
          <TeamSwitcher />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={userData} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </TooltipProvider>
  )
}

