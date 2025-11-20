import type React from "react"
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import Sidebar from "@/components/sidebar"
import { Toaster } from "sonner"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Casa Rancha Admin Dashboard",
  description: "Manage your Casa Rancha platform",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} min-h-screen`}>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-64">{children}</main>
        </div>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
