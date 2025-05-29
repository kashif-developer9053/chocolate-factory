"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  BarChart3,
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

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [adminUser, setAdminUser] = useState(null)

  // Modified useEffect with improved error handling
useEffect(() => {
  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/current-user", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
      
      // If not authenticated, redirect without throwing error
      if (!response.ok) {
        console.log("Not authenticated, redirecting to login")
        setIsAuthenticated(false)
        setIsLoading(false)
        
        // Only redirect if not already on login page
        if (pathname !== "/admin-login") {
          router.push("/admin-login")
        }
        return // Exit early
      }
      
      // If we got here, we have a successful response
      const data = await response.json()

      if (!data.success || data.data.role !== "admin") {
        console.log("Not an admin, redirecting to login")
        setIsAuthenticated(false)
        setIsLoading(false)
        
        if (pathname !== "/admin-login") {
          router.push("/admin-login")
        }
        return // Exit early
      }
      
      // User is authenticated and is an admin
      setAdminUser(data.data)
      setIsAuthenticated(true)
      setIsLoading(false)
    } catch (error) {
      // Only log the error, don't show toast
      console.log("Auth check issue:", error.message)
      setIsAuthenticated(false)
      setIsLoading(false)
      
      if (pathname !== "/admin-login") {
        router.push("/admin-login")
      }
    }
  }
  
  if (pathname !== "/admin-login") {
    checkAuth()
  } else {
    setIsLoading(false)
  }
}, [router, pathname])

  const handleLogout = async () => {
    if (isLoggingOut) return
    
    setIsLoggingOut(true)
    
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Logout failed")
      }
      
      toast({
        title: "Success",
        description: "Logged out successfully",
      })
      
      router.push("/admin-login")
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to log out",
        variant: "destructive",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  const routes = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, active: pathname === "/admin" },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag, active: pathname === "/admin/orders" },
    { href: "/admin/customers", label: "Customers", icon: Users, active: pathname === "/admin/customers" },
    { href: "/admin/products", label: "Products", icon: Package, active: pathname.startsWith("/admin/products") },
    { href: "/admin/products/categories", label: "Categories", icon: Package, active: pathname.startsWith("/admin/categories") },

    { href: "/admin/analytics", label: "Analytics", icon: BarChart3, active: pathname === "/admin/analytics" },
    { href: "/admin/settings", label: "Settings", icon: Settings, active: pathname === "/admin/settings" },
  ]

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2">Loading admin panel...</span>
      </div>
    )
  }

  // Not authenticated and not on login page
  if (!isAuthenticated && pathname !== "/admin-login") {
    return null // Redirect handled in useEffect
  }

  // Don't show header and sidebar on login page
  if (pathname === "/admin-login") {
    return <div className="min-h-screen">{children}</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center border-b bg-gray-50 px-4 md:px-6">
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle Menu</span>
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
            <span className="sr-only">Notifications</span>
          </Button>
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <img src="/placeholder.svg?height=32&width=32" alt="Avatar" className="h-8 w-8 rounded-full" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {adminUser?.name || 'Admin User'}
                <div className="text-xs font-normal text-gray-500">{adminUser?.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                <LogOut className="mr-2 h-4 w-4" />
                {isLoggingOut ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  "Logout"
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="flex flex-1">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-gray-50 pt-16 transition-transform duration-200 md:static md:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="space-y-1 p-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                  route.active
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                <route.icon className="mr-3 h-5 w-5" />
                {route.label}
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-4 left-0 right-0 p-4">
            <Button variant="outline" className="w-full justify-start border-gray-300" asChild>
              <Link href="/">
                <LogOut className="mr-2 h-5 w-5" />
                Back to Store
              </Link>
            </Button>
          </div>
        </aside>
        {/* Overlay to close sidebar on mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden" 
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-white">
          {children}
        </main>
      </div>
    </div>
  )
}