"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Sidebar from "@/components/sidebar"

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideSidebar = pathname === "/login"

  if (hideSidebar) {
    return <main className="min-h-screen">{children}</main>
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64">{children}</main>
    </div>
  )
}
