import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProviderWrapper } from "@/components/providers/auth-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HR Portal - Complete HR Management Solution",
  description:
    "Streamline your hiring process, manage talent effectively, and build amazing teams with our comprehensive HR management platform.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProviderWrapper>
          {children}
          <Toaster />
        </AuthProviderWrapper>
      </body>
    </html>
  )
}
