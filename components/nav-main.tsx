"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const pathname = usePathname()

  // Track open state for each menu item
  const [openItems, setOpenItems] = useState<Record<string, boolean>>(
    // Initialize with active items open
    items.reduce(
      (acc, item) => {
        // Check if this item or any of its children match the current path
        const isActive =
          pathname.startsWith(item.url) || (item.items?.some((subItem) => pathname.startsWith(subItem.url)) ?? false)
        acc[item.title] = isActive
        return acc
      },
      {} as Record<string, boolean>,
    ),
  )

  // Toggle a specific menu item
  const toggleItem = (title: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  // Check if an item is active based on the current path
  const isItemActive = (url: string) => {
    return pathname.startsWith(url)
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <TooltipProvider>
        <SidebarMenu>
          {items.map((item) => {
            const active = isItemActive(item.url)
            const hasActiveChild = item.items?.some((subItem) => isItemActive(subItem.url))
            const isActive = active || hasActiveChild

            return (
              <SidebarMenuItem key={item.title}>
                {isCollapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        asChild={false}
                        isActive={isActive}
                        className="sidebar-hover-primary"
                        onClick={() => {
                          window.location.href = item.url
                        }}
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <>
                    {item.items && item.items.length > 0 ? (
                      // If item has children, make it a toggle button
                      <SidebarMenuButton
                        isActive={isActive}
                        className="sidebar-hover-primary"
                        onClick={() => toggleItem(item.title)}
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span className="text-sm">{item.title}</span>
                        <ChevronRight
                          className={`ml-auto h-4 w-4 transition-transform duration-200 ${openItems[item.title] ? "rotate-90" : ""}`}
                        />
                      </SidebarMenuButton>
                    ) : (
                      // If item has no children, make it a direct link
                      <SidebarMenuButton
                        isActive={isActive}
                        className="sidebar-hover-primary"
                        onClick={() => {
                          window.location.href = item.url
                        }}
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span className="text-sm">{item.title}</span>
                      </SidebarMenuButton>
                    )}
                  </>
                )}

                {openItems[item.title] && item.items && !isCollapsed && (
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          className="text-sm"
                          isActive={isItemActive(subItem.url)}
                          onClick={() => {
                            window.location.href = subItem.url
                          }}
                        >
                          <span>{subItem.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </TooltipProvider>
    </SidebarGroup>
  )
}

