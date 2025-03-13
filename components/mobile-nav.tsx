"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { SmilePlus, Waves, BookOpen, User } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

export function MobileNav() {
  const pathname = usePathname()

  // Check if the current path is an auth page
  const isAuthPage = pathname?.startsWith("/auth")

  // Don't render the navigation on auth pages
  if (isAuthPage) {
    return null
  }

  // Check if the current path matches the nav item
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/dashboard"
    return pathname?.startsWith(path)
  }

  // Logo URL - using the same one from TeamSwitcher
  const logoSrc = "https://framerusercontent.com/images/rZbcSd5yZL0dqzWGUJ9UpRh2ToY.jpg"

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="grid grid-cols-5 items-center">
        {/* Lifts */}
        <Link
          href="/workouts"
          className={cn(
            "flex flex-col items-center justify-center py-2 text-xs",
            isActive("/workout") ? "text-primary" : "text-muted-foreground",
          )}
        >
          <SmilePlus className="mb-1 h-5 w-5" />
          <span>Lifts</span>
        </Link>

        {/* Movements */}
        <Link
          href="/movements"
          className={cn(
            "flex flex-col items-center justify-center py-2 text-xs",
            isActive("/movements") ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Waves className="mb-1 h-5 w-5" />
          <span>Movements</span>
        </Link>

        {/* Logo in center (Home) */}
        <Link href="/dashboard" className="flex justify-center">
          <div className="flex h-12 w-12 -mt-6 items-center justify-center rounded-md bg-black shadow-lg">
            <Image
              src={logoSrc || "/placeholder.svg"}
              alt="MYFC Logo"
              width={24}
              height={48}
              className="w-10 h-12 object-contain"
            />
          </div>
        </Link>

        {/* Favorites */}
        <Link
          href="/favorites"
          className={cn(
            "flex flex-col items-center justify-center py-2 text-xs",
            isActive("/favorites") ? "text-primary" : "text-muted-foreground",
          )}
        >
          <BookOpen className="mb-1 h-5 w-5" />
          <span>Favs</span>
        </Link>

        {/* Profile */}
        <Link
          href="/settings"
          className={cn(
            "flex flex-col items-center justify-center py-2 text-xs",
            isActive("/settings") ? "text-primary" : "text-muted-foreground",
          )}
        >
          <User className="mb-1 h-5 w-5" />
          <span>Profile</span>
        </Link>
      </div>
    </div>
  )
}

