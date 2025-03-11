import type React from "react"
import { WorkoutsClientLayout } from "./client-layout"

export default function WorkoutsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <WorkoutsClientLayout>{children}</WorkoutsClientLayout>
}

