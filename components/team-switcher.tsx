"use client"

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTheme } from "@/components/theme-context"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

// Logo component with fallback to SVG if image fails to load
const Logo = ({
  src,
  alt = "MYFC Logo",
  width = 32,
  height = 32,
  className = "",
}: {
  src: string
  alt?: string
  width?: number
  height?: number
  className?: string
}) => {
  const [error, setError] = useState(false)

  // Fallback SVG if image fails to load
  if (error) {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <rect width="32" height="32" rx="6" fill="#65a30d" />
        <path d="M7 16H25M16 7V25" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  return (
    <Image
      src={src || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setError(true)}
      priority
    />
  )
}

export function TeamSwitcher() {
  const { theme } = useTheme()
  const { state } = useSidebar()
  const [mounted, setMounted] = useState(false)
  const isCollapsed = state === "collapsed"
  const router = useRouter()

  // Logo URLs based on theme - using vertical logo for both states
  const logoSrc =
    theme === "dark"
      ? "https://framerusercontent.com/images/rZbcSd5yZL0dqzWGUJ9UpRh2ToY.jpg"
      : "https://framerusercontent.com/images/rZbcSd5yZL0dqzWGUJ9UpRh2ToY.jpg"

  // After mounting, we have access to the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle navigation programmatically
  const navigateToDashboard = () => {
    router.push("/dashboard")
  }

  // Show a placeholder while mounting
  if (!mounted) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="justify-center py-4 h-auto">
            <div className="h-8 w-8 bg-sidebar-accent/20 rounded-md"></div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  // For collapsed state with tooltip
  if (isCollapsed) {
    return (
      <TooltipProvider>
        <SidebarMenu>
          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  variant="logo"
                  className="justify-center py-0 h-auto hover:bg-transparent"
                  onClick={navigateToDashboard}
                >
                  <Logo src={logoSrc} width={24} height={48} className="w-6 h-12 object-contain" />
                </SidebarMenuButton>
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                MYFC Dashboard
              </TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
        </SidebarMenu>
      </TooltipProvider>
    )
  }

  // For expanded state without tooltip
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          variant="logo"
          className="justify-center py-0 h-auto hover:bg-transparent"
          onClick={navigateToDashboard}
        >
          <Logo src={logoSrc} width={32} height={64} className="w-8 h-16 object-contain" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

