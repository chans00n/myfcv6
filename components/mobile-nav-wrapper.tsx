"use client"

import { usePathname } from "next/navigation"
import { MobileNav } from "./mobile-nav"

export function MobileNavWrapper() {
  const pathname = usePathname()

  // Check if the current path is an auth page
  const isAuthPage = pathname?.startsWith("/auth")

  // Don't render the navigation on auth pages
  if (isAuthPage) {
    return null
  }

  return <MobileNav />
}

