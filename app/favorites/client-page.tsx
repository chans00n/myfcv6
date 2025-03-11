"use client"

import { FavoritesProvider } from "@/context/favorites-context"
import { SidebarProvider } from "@/components/sidebar-context"
import FavoritesContent from "./favorites-content"

export default function FavoritesClientPage() {
  return (
    <SidebarProvider>
      <FavoritesProvider>
        <FavoritesContent />
      </FavoritesProvider>
    </SidebarProvider>
  )
} 