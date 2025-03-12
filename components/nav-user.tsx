"use client"

import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Moon, Sun } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "@/components/theme-context"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const router = useRouter()
  const { signOut } = useAuth()
  const { isMobile, state } = useSidebar()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const isCollapsed = state === "collapsed"

  // After mounting, we have access to the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  const isDarkMode = theme === "dark"

  const toggleTheme = (checked: boolean) => {
    const newTheme = checked ? "dark" : "light"
    setTheme(newTheme)

    // Force a class update on the HTML element for immediate feedback
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(newTheme)

    // Apply theme-specific styles directly
    if (newTheme === "dark") {
      document.documentElement.style.setProperty("--primary", "65 70% 45%")
      document.documentElement.style.setProperty("--primary-foreground", "0 0% 100%")
      document.documentElement.style.setProperty("--accent", "65 50% 25%")
      document.documentElement.style.setProperty("--accent-foreground", "65 70% 90%")
      document.documentElement.style.setProperty("--secondary", "65 10% 15%")
      document.documentElement.style.setProperty("--secondary-foreground", "65 10% 98%")
      document.documentElement.style.setProperty("--muted", "65 10% 15%")
      document.documentElement.style.setProperty("--muted-foreground", "65 10% 65%")
      document.documentElement.style.setProperty("--border", "65 10% 20%")
      document.documentElement.style.setProperty("--input", "65 10% 20%")
      document.documentElement.style.setProperty("--ring", "65 70% 40%")
      document.documentElement.style.setProperty("--sidebar-primary", "65 70% 45%")
      document.documentElement.style.setProperty("--sidebar-primary-foreground", "0 0% 100%")
      document.documentElement.style.setProperty("--sidebar-accent", "65 50% 25%")
      document.documentElement.style.setProperty("--sidebar-accent-foreground", "65 70% 90%")
      document.documentElement.style.setProperty("--sidebar-border", "65 10% 20%")
    } else {
      document.documentElement.style.setProperty("--primary", "65 70% 62%")
      document.documentElement.style.setProperty("--primary-foreground", "65 10% 10%")
      document.documentElement.style.setProperty("--accent", "65 70% 92%")
      document.documentElement.style.setProperty("--accent-foreground", "65 10% 15%")
      document.documentElement.style.setProperty("--secondary", "65 10% 96%")
      document.documentElement.style.setProperty("--secondary-foreground", "65 10% 15%")
      document.documentElement.style.setProperty("--muted", "65 10% 96%")
      document.documentElement.style.setProperty("--muted-foreground", "65 10% 45%")
      document.documentElement.style.setProperty("--border", "65 10% 90%")
      document.documentElement.style.setProperty("--input", "65 10% 90%")
      document.documentElement.style.setProperty("--ring", "65 70% 50%")
      document.documentElement.style.setProperty("--sidebar-primary", "65 70% 62%")
      document.documentElement.style.setProperty("--sidebar-primary-foreground", "65 10% 10%")
      document.documentElement.style.setProperty("--sidebar-accent", "65 70% 92%")
      document.documentElement.style.setProperty("--sidebar-accent-foreground", "65 10% 15%")
      document.documentElement.style.setProperty("--sidebar-border", "65 10% 90%")
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success("Signed out successfully")
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Failed to sign out")
    }
  }

  if (!mounted) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="justify-center p-2 h-auto">
            <Avatar className="h-6 w-6 rounded-full">
              <AvatarImage 
                src={user.avatar} 
                alt={user.name}
                className="object-cover"
              />
              <AvatarFallback className="text-xs">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  // For collapsed state
  if (isCollapsed) {
    return (
      <TooltipProvider>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton size="lg" className="justify-center p-2 h-auto">
                      <Avatar className="h-6 w-6 rounded-full">
                        <AvatarImage 
                          src={user.avatar} 
                          alt={user.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-xs">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="right" align="center">
                  {user.name}
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent
                className="min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage 
                        src={user.avatar} 
                        alt={user.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="rounded-lg">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user.name}</span>
                      <span className="truncate text-xs">{user.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center justify-between cursor-default">
                  <div className="flex items-center">
                    {isDarkMode ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                    Dark Mode
                  </div>
                  <Switch checked={isDarkMode} onCheckedChange={toggleTheme} />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/settings?tab=account">
                      <BadgeCheck className="mr-2 h-4 w-4" />
                      Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings?tab=billing">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Billing
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings?tab=notifications">
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </TooltipProvider>
    )
  }

  // For expanded state
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage 
                  src={user.avatar} 
                  alt={user.name}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-lg">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage 
                    src={user.avatar} 
                    alt={user.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-lg">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center justify-between cursor-default">
              <div className="flex items-center">
                {isDarkMode ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                Dark Mode
              </div>
              <Switch checked={isDarkMode} onCheckedChange={toggleTheme} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/settings?tab=account">
                  <BadgeCheck className="mr-2 h-4 w-4" />
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings?tab=billing">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings?tab=notifications">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

