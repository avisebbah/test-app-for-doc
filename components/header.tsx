"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { UserCircle, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="bg-white border-b border-gray-200 dark:bg-gray-950 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-900 dark:text-white">רופא דיגיטלי</span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4 md:mr-4">
            <Link href="/dashboard">
              <Button variant={isActive("/dashboard") ? "default" : "ghost"}>דף הבית</Button>
            </Link>
            <Link href="/prescriptions/new">
              <Button variant={isActive("/prescriptions/new") ? "default" : "ghost"}>מרשם חדש</Button>
            </Link>
            <Link href="/prescriptions/history">
              <Button variant={isActive("/prescriptions/history") ? "default" : "ghost"}>היסטוריית מרשמים</Button>
            </Link>
            <Link href="/pharmacies">
              <Button variant={isActive("/pharmacies") ? "default" : "ghost"}>בתי מרקחת</Button>
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            <Button variant="ghost" size="icon">
              <UserCircle className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/dashboard">
              <Button variant={isActive("/dashboard") ? "default" : "ghost"} className="w-full justify-start">
                דף הבית
              </Button>
            </Link>
            <Link href="/prescriptions/new">
              <Button variant={isActive("/prescriptions/new") ? "default" : "ghost"} className="w-full justify-start">
                מרשם חדש
              </Button>
            </Link>
            <Link href="/prescriptions/history">
              <Button
                variant={isActive("/prescriptions/history") ? "default" : "ghost"}
                className="w-full justify-start"
              >
                היסטוריית מרשמים
              </Button>
            </Link>
            <Link href="/pharmacies">
              <Button variant={isActive("/pharmacies") ? "default" : "ghost"} className="w-full justify-start">
                בתי מרקחת
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
