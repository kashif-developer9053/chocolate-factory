"use client"

import { useState, useEffect, ReactNode } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  User,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { toast } from "@/hooks/use-toast"

interface AdminUser {
  name?: string
  email?: string
  role?: string
}

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem('user')
        if (!userData) {
          setIsAuthenticated(false)
          setIsLoading(false)
          if (pathname !== "/admin/admin-login") router.push("/admin/admin-login")
          return
        }
        const parsedUser: AdminUser = JSON.parse(userData)
        if (parsedUser.role !== "admin") {
          setIsAuthenticated(false)
          setIsLoading(false)
          if (pathname !== "/admin/admin-login") router.push("/admin/admin-login")
          return
        }
        setAdminUser(parsedUser)
        setIsAuthenticated(true)
        setIsLoading(false)
      } catch {
        setIsAuthenticated(false)
        setIsLoading(false)
        localStorage.removeItem('user')
        if (pathname !== "/admin/admin-login") router.push("/admin/admin-login")
      }
    }

    if (pathname !== "/admin/admin-login") {
      checkAuth()
    } else {
      setIsLoading(false)
    }
  }, [router, pathname])

  useEffect(() => {
    const handleAuthChange = () => {
      if (pathname !== "/admin/admin-login") {
        const userData = localStorage.getItem('user')
        if (!userData) {
          setIsAuthenticated(false)
          setAdminUser(null)
          router.push("/admin/admin-login")
        } else {
          try {
            const parsedUser: AdminUser = JSON.parse(userData)
            if (parsedUser.role === "admin") {
              setAdminUser(parsedUser)
              setIsAuthenticated(true)
            } else {
              setIsAuthenticated(false)
              setAdminUser(null)
              router.push("/admin/admin-login")
            }
          } catch {
            setIsAuthenticated(false)
            setAdminUser(null)
            localStorage.removeItem('user')
            router.push("/admin/admin-login")
          }
        }
      }
    }

    window.addEventListener('authChanged', handleAuthChange)
    return () => window.removeEventListener('authChanged', handleAuthChange)
  }, [router, pathname])

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      localStorage.removeItem('user')
      setIsAuthenticated(false)
      setAdminUser(null)
      toast({ title: "Success", description: "Logged out successfully" })
      window.dispatchEvent(new CustomEvent('authChanged'))
      router.push("/admin/admin-login")
    } catch {
      localStorage.removeItem('user')
      setIsAuthenticated(false)
      setAdminUser(null)
      toast({ title: "Logged out", description: "You have been logged out" })
      window.dispatchEvent(new CustomEvent('authChanged'))
      router.push("/admin/admin-login")
    } finally {
      setIsLoggingOut(false)
    }
  }

  const routes = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/products/categories", label: "Categories", icon: Package },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ]

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2">Loading admin panel...</span>
      </div>
    )
  }

  if (!isAuthenticated && pathname !== "/admin/admin-login") return null
  if (pathname === "/admin/admin-login") return <div className="min-h-screen">{children}</div>

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center border-b bg-gray-50 px-4 md:px-6">
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-lg font-bold">Admin Panel</span>
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-4">
         
        </div>
      </header>
      <div className="flex flex-1">
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-gray-50 pt-16 transition-transform duration-200 md:static md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <nav className="space-y-1 p-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${pathname === route.href ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"}`}
              >
                <route.icon className="mr-3 h-5 w-5" />
                {route.label}
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-4 left-0 right-0 p-4">
            <Button variant="outline" className="w-full justify-start border-gray-300" asChild>
              <Link href="/">
                <LogOut className="mr-2 h-5 w-5" /> Back to Store
              </Link>
            </Button>
          </div>
        </aside>
        <main className="flex-1 p-6 md:pt-16">
          {children}
        </main>
      </div>
    </div>
  )
}
