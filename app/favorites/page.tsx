import { FavoritesProvider } from "@/context/favorites-context"
import { SidebarProvider } from "@/components/sidebar-context"
import { FavoritesClientPage } from "./client-page"

export default function FavoritesPage() {
  return (
    <SidebarProvider>
      <FavoritesProvider>
        <FavoritesClientPage />
      </FavoritesProvider>
    </SidebarProvider>
  )
}

