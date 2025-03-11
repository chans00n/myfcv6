"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type SidebarContextType = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // On mount, read the sidebar state from localStorage
  useEffect(() => {
    // Only run this once on client-side
    if (typeof window !== "undefined" && !isInitialized) {
      const savedState = localStorage.getItem("sidebar-state")
      if (savedState !== null) {
        setIsOpen(savedState === "true")
      }
      setIsInitialized(true)
    }
  }, [isInitialized])

  // Update localStorage when the sidebar state changes
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem("sidebar-state", String(isOpen))
      console.log("Sidebar state saved to localStorage:", isOpen)
    }
  }, [isOpen, isInitialized])

  return <SidebarContext.Provider value={{ isOpen, setIsOpen }}>{children}</SidebarContext.Provider>
}

export function useSidebarContext() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebarContext must be used within a SidebarProvider")
  }
  return context
}

