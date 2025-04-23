import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { TopProgressBar } from "@/components/top-progress-bar"

// Initialize the Inter font
const inter = Inter({
  subsets: ["latin", "hebrew"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "אפליקציית מרשמים דיגיטלית",
  description: "אפליקציה מודרנית למרשמים דיגיטליים עבור אנשי מקצוע בתחום הבריאות",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${inter.className} rtl`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <TopProgressBar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
