"use client"

import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import {
  LayoutGrid,
  Users,
  Settings,
  LogOut,
  Dumbbell,
  Video,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const navigation = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutGrid,
  },
  {
    title: "Workouts",
    href: "/admin/workouts",
    icon: Dumbbell,
  },
  {
    title: "Videos",
    href: "/admin/videos",
    icon: Video,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { signOut } = useAuth()

  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r bg-muted/10">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px]">
            <Link
              href="/admin"
              className="flex items-center gap-2 font-semibold"
            >
              <span>Admin Portal</span>
            </Link>
          </div>
          <nav className="flex-1 space-y-1 p-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "transparent"
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              )
            })}
          </nav>
          <div className="border-t p-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-y-auto bg-background">
        {children}
      </main>
    </div>
  )
} 