"use client"

import { ReactNode } from "react"
import dynamic from "next/dynamic"
import { Toaster } from "sonner"

const ThemeProvider = dynamic(() => import("@/components/theme-context").then(mod => mod.ThemeProvider), { ssr: false })
const SidebarProvider = dynamic(() => import("@/components/sidebar-context").then(mod => mod.SidebarProvider), { ssr: false })
const FavoritesProvider = dynamic(() => import("@/context/favorites-context").then(mod => mod.FavoritesProvider), { ssr: false })
const MobileNavWrapper = dynamic(() => import("@/components/mobile-nav-wrapper").then(mod => mod.MobileNavWrapper), { ssr: false })
const PWAInitializer = dynamic(() => import("./pwa-init").then(mod => mod.PWAInitializer), { ssr: false })
const PWAInstallPrompt = dynamic(() => import("@/components/pwa-install-prompt").then(mod => mod.PWAInstallPrompt), { ssr: false })
const AuthProvider = dynamic(() => import("@/context/auth-context").then(mod => mod.AuthProvider), { ssr: false })

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <SidebarProvider>
          <FavoritesProvider>
            <Toaster richColors position="top-center" />
            <PWAInitializer />
            {children}
            <MobileNavWrapper />
            <PWAInstallPrompt />
          </FavoritesProvider>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  )
} 