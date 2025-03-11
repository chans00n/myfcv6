"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { usePathname } from "next/navigation"

type SidebarStateContextType = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const SidebarStateContext = createContext<SidebarStateContextType | undefined>(undefined)

export function SidebarStateProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(true)
  const pathname = usePathname()

  // On initial load, read the sidebar state from cookie
  useEffect(() => {
    const cookies = document.cookie.split(";")
    const sidebarCookie = cookies.find((cookie) => cookie.trim().startsWith("sidebar:state="))
    if (sidebarCookie) {
      const sidebarState = sidebarCookie.split("=")[1]
      setIsOpen(sidebarState === "true")
    }
  }, [])

  // Update the cookie when the sidebar state changes
  useEffect(() => {
    document.cookie = `sidebar:state=${isOpen}; path=/; max-age=${60 * 60 * 24 * 7}`
  }, [isOpen])

  // Prevent state reset on pathname change
  useEffect(() => {
    // This is intentionally empty to show we're handling pathname changes
    // but not resetting the sidebar state
  }, [pathname])

  return <SidebarStateContext.Provider value={{ isOpen, setIsOpen }}>{children}</SidebarStateContext.Provider>
}

export function useSidebarState() {
  const context = useContext(SidebarStateContext)
  if (context === undefined) {
    throw new Error("useSidebarState must be used within a SidebarStateProvider")
  }
  return context
}

