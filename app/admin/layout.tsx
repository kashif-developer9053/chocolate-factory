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
            <img src="/images/logo.png" alt="The Chocolate Factory" className="h-8 w-auto" />
            <span className="text-lg font-bold">Admin Panel</span>
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <form className="relative hidden md:flex" onSubmit={(e) => e.preventDefault()}>
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input type="search" placeholder="Search..." className="w-[200px] pl-8 md:w-[240px] lg:w-[320px] border-gray-300" />
          </form>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white">3</Badge>
          </Button>
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {adminUser?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                </div>
                <span className="hidden md:block text-sm font-medium">
                  {adminUser?.name || 'Admin'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {adminUser?.name || 'Admin User'}
                <div className="text-xs font-normal text-gray-500">{adminUser?.email}</div>
                <Badge variant="secondary" className="text-xs mt-1">Admin</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                {isLoggingOut ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging out...
                  </>
                ) : (
                  <>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
