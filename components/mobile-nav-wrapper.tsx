"use client"

import { usePathname } from "next/navigation"
import { MobileNav } from "./mobile-nav"

export function MobileNavWrapper() {
  const pathname = usePathname()

  // Check if the current path is an auth page or landing page
  const isAuthPage = pathname?.startsWith("/auth")
  const isLandingPage = pathname === "/"

  // Don't render the navigation on auth pages or landing page
  if (isAuthPage || isLandingPage) {
    return null
  }

  return <MobileNav />
}

