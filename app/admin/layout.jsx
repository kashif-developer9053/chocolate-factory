"use client"

import { useState, Suspense } from "react"
import {  useEffect } from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"



export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

 useEffect(() => {
    // Get user data from localStorage
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } else {
        // Redirect to login if no user data
        router.push('/login')
        return
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }, [router])




  const routes = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      href: "/admin/orders",
      label: "Orders",
      icon: ShoppingBag,
      active: pathname === "/admin/orders",
    },
    {
      href: "/admin/coupons",
      label: "Coupons",
      icon: ShoppingBag,
      active: pathname === "/admin/coupons",
    },
    {
      href: "/admin/customers",
      label: "Customers",
      icon: Users,
      active: pathname === "/admin/customers",
    },
    {
      href: "/admin/messages",
      label: "Messages",
      icon: Users,
      active: pathname === "/admin/customers",
    },
            { href: "/admin/products/categories", label: "Categories", icon: Package },

    {
      href: "/admin/products",
      label: "Products",
      icon: Package,
      active: pathname === "/admin/products",
    },
    {
      href: "/admin/analytics",
      label: "Analytics",
      icon: BarChart3,
      active: pathname === "/admin/analytics",
    },
    {
      href: "/admin/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/admin/settings",
    },

  ]

  return (
    <div className="flex min-h-screen flex-col">
      
      <div className="flex flex-1">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-background pt-16 transition-transform duration-200 md:static md:translate-x-0 ${
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
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <route.icon className="mr-3 h-5 w-5" />
                {route.label}
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-4 left-0 right-0 p-4">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/">
                <LogOut className="mr-2 h-5 w-5" />
                Back to Store
              </Link>
            </Button>
          </div>
        </aside>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Suspense>{children}</Suspense>
        </main>
      </div>
    </div>
  )
}
