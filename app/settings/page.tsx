"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { AppSidebar } from "../../components/app-sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountSettings } from "@/components/settings/account-settings"
import { BillingSettings } from "@/components/settings/billing-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useSidebarContext } from "@/components/sidebar-context"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home, Settings } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("account")
  const { isOpen } = useSidebarContext()

  // Set the active tab based on URL parameter
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && ["account", "billing", "notifications"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`/settings?tab=${value}`, { scroll: false })
  }

  return (
    <SidebarProvider defaultOpen={isOpen}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 w-full">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">
                    <Home className="h-4 w-4 mr-1" />
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/settings">
                    <Settings className="h-4 w-4 mr-1" />
                    Settings
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/settings?tab=${activeTab}`}>
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col p-4 pt-0">
          <div className="py-6">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="mb-8 grid w-full grid-cols-3 md:w-[400px]">
                <TabsTrigger value="account" onClick={() => router.push("/settings?tab=account", { scroll: false })}>
                  Account
                </TabsTrigger>
                <TabsTrigger value="billing" onClick={() => router.push("/settings?tab=billing", { scroll: false })}>
                  Billing
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  onClick={() => router.push("/settings?tab=notifications", { scroll: false })}
                >
                  Notifications
                </TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <AccountSettings />
              </TabsContent>
              <TabsContent value="billing">
                <BillingSettings />
              </TabsContent>
              <TabsContent value="notifications">
                <NotificationSettings />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

