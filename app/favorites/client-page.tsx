"use client"

import { useEffect, useState } from "react"
import { FavoritesProvider } from "@/context/favorites-context"
import { SidebarProvider } from "@/components/sidebar-context"
import FavoritesContent from "./favorites-content"

export default function FavoritesClientPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <SidebarProvider>
      <FavoritesProvider>
        <FavoritesContent />
      </FavoritesProvider>
    </SidebarProvider>
  )
} 