"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MessageSquare, LayoutDashboard, ShieldCheck } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <ShieldCheck className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">AI Support Hub</span>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/" passHref>
              <Button
                variant="ghost"
                className={cn("text-gray-600 hover:text-gray-900", pathname === "/" && "bg-gray-100 text-gray-900")}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/admin" passHref>
              <Button
                variant="ghost"
                className={cn(
                  "text-gray-600 hover:text-gray-900",
                  pathname === "/admin" && "bg-gray-100 text-gray-900",
                )}
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                Admin
              </Button>
            </Link>
            <Link href="/chat" passHref>
              <Button
                variant="ghost"
                className={cn("text-gray-600 hover:text-gray-900", pathname === "/chat" && "bg-gray-100 text-gray-900")}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Support Chat
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

