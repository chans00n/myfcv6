"use client"

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useSidebarContext } from "@/components/sidebar-context"
import FavoritesContent from "./favorites-content"

export default function FavoritesClientPage() {
  const [isClient, setIsClient] = useState(false)
  const { isOpen } = useSidebarContext()

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <SidebarProvider defaultOpen={isOpen}>
      <AppSidebar />
      <SidebarInset>
        <FavoritesContent />
      </SidebarInset>
    </SidebarProvider>
  )
} 