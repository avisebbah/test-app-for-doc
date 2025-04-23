"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, FileText, Home, LogOut, Menu, Settings, User, X } from "lucide-react"

export function AppHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center ml-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2E7D32"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">מרשם דיגיטלי</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/dashboard">
              <Button
                variant={isActive("/dashboard") ? "secondary" : "ghost"}
                className={`h-9 px-4 ${isActive("/dashboard") ? "text-white" : "text-gray-700"}`}
              >
                <Home className="h-4 w-4 ml-2" />
                לוח בקרה
              </Button>
            </Link>
            <Link href="/prescriptions">
              <Button
                variant={isActive("/prescriptions") ? "secondary" : "ghost"}
                className={`h-9 px-4 ${isActive("/prescriptions") ? "text-white" : "text-gray-700"}`}
              >
                <FileText className="h-4 w-4 ml-2" />
                מרשמים
              </Button>
            </Link>
            <Link href="/patients">
              <Button
                variant={isActive("/patients") ? "secondary" : "ghost"}
                className={`h-9 px-4 ${isActive("/patients") ? "text-white" : "text-gray-700"}`}
              >
                <User className="h-4 w-4 ml-2" />
                מטופלים
              </Button>
            </Link>
          </nav>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-700" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="https://ui-avatars.com/api/?name=ד.+כהן&background=random" alt="ד״ר כהן" />
                    <AvatarFallback>דכ</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">ד״ר כהן</p>
                    <p className="text-xs text-gray-500">doctor@example.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="ml-2 h-4 w-4" />
                  <span>פרופיל</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="ml-2 h-4 w-4" />
                  <span>הגדרות</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="ml-2 h-4 w-4" />
                  <span>התנתק</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="container mx-auto px-4 py-3 space-y-1">
            <Link href="/dashboard">
              <Button
                variant={isActive("/dashboard") ? "secondary" : "ghost"}
                className={`w-full justify-start ${isActive("/dashboard") ? "text-white" : "text-gray-700"}`}
              >
                <Home className="h-4 w-4 ml-2" />
                לוח בקרה
              </Button>
            </Link>
            <Link href="/prescriptions">
              <Button
                variant={isActive("/prescriptions") ? "secondary" : "ghost"}
                className={`w-full justify-start ${isActive("/prescriptions") ? "text-white" : "text-gray-700"}`}
              >
                <FileText className="h-4 w-4 ml-2" />
                מרשמים
              </Button>
            </Link>
            <Link href="/patients">
              <Button
                variant={isActive("/patients") ? "secondary" : "ghost"}
                className={`w-full justify-start ${isActive("/patients") ? "text-white" : "text-gray-700"}`}
              >
                <User className="h-4 w-4 ml-2" />
                מטופלים
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
