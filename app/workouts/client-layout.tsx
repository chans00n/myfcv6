"use client"

import type { ReactNode } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useSidebarContext } from "@/components/sidebar-context"

export function WorkoutsClientLayout({ children }: { children: ReactNode }) {
  const { isOpen } = useSidebarContext()

  return (
    <SidebarProvider defaultOpen={isOpen}>
      <AppSidebar />
      <SidebarInset className="w-full">{children}</SidebarInset>
    </SidebarProvider>
  )
}

