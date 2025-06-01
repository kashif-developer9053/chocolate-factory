"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ShoppingCart, User, Search, Menu, X, LogOut, UserCircle, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast"
import { useCart } from "@/context/CartContext"

export default function MainNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { cartCount } = useCart()

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/products",
      label: "Shop",
      active: pathname === "/products",
    },
    {
      href: "/categories",
      label: "Categories",
      active: pathname === "/categories",
    },
    {
      href: "/about",
      label: "About",
      active: pathname === "/about",
    },
    {
      href: "/contact",
      label: "Contact",
      active: pathname === "/contact",
    },
  ]

  // Check auth status from localStorage on component mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  // Listen for auth changes (login/logout)
  useEffect(() => {
    const handleAuthChange = () => {
      checkAuthStatus()
    }

    // Custom event listener for auth changes
    window.addEventListener('authChanged', handleAuthChange)
    
    return () => {
      window.removeEventListener('authChanged', handleAuthChange)
    }
  }, [])

  const checkAuthStatus = () => {
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setUser(null)
      // Clear corrupted data
      localStorage.removeItem('user')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    
    try {
      // Call logout API to clear server-side session
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })

      // Clear localStorage regardless of API response
      localStorage.removeItem('user')
      setUser(null)
      
      toast({
        title: "Logged out successfully",
        description: "See you next time!",
      })
      
      // Dispatch custom event for auth change
      window.dispatchEvent(new CustomEvent('authChanged'))
      
      // Redirect to home page
      router.push("/")
      
    } catch (error) {
      console.error('Logout error:', error)
      // Still clear localStorage even if API call fails
      localStorage.removeItem('user')
      setUser(null)
      
      toast({
        title: "Logged out",
        description: "You have been logged out",
      })
      
      // Dispatch custom event for auth change
      window.dispatchEvent(new CustomEvent('authChanged'))
      router.push("/")
    } finally {
      setIsLoggingOut(false)
    }
  }

  const getUserInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("")
  }

  const renderUserMenu = () => {
    if (loading) {
      return (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
        </div>
      )
    }

    if (user) {
      return (
        <DropdownMenu >
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-sm">
                  {getUserInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:block text-sm font-medium">
                {user.name}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 shadow-lg">
            <div className="flex items-center gap-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-sm">
                  {getUserInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center gap-2">
                <UserCircle className="h-4 w-4" />
                My Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/my-orders" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                My Orders
              </Link>
            </DropdownMenuItem>
            {user.role === 'admin' && (
              <DropdownMenuItem asChild>
                <Link href="/admin" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Admin Panel
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 text-red-600 focus:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
            <span className="sr-only">User menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-gray-800 shadow-lg">
          <DropdownMenuItem asChild>
            <Link href="/login">Login</Link>
          </DropdownMenuItem>

           <DropdownMenuItem asChild>
            <Link href="/track-order">Track Order</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/register">Register</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const renderMobileUserSection = () => {
    if (user) {
      return (
        <div className="flex flex-col space-y-3 pt-4 border-t">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="text-sm">
                {getUserInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <Link 
              href="/profile" 
              className="text-sm font-medium hover:text-primary flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <UserCircle className="h-4 w-4" />
              My Profile
            </Link>
            <Link 
              href="/orders" 
              className="text-sm font-medium hover:text-primary flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingCart className="h-4 w-4" />
              My Orders
            </Link>
            {user.role === 'admin' && (
              <Link 
                href="/admin" 
                className="text-sm font-medium hover:text-primary flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="h-4 w-4" />
                Admin Panel
              </Link>
            )}
            <button
              onClick={() => {
                setIsMenuOpen(false)
                handleLogout()
              }}
              disabled={isLoggingOut}
              className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-2 text-left"
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="flex items-center justify-between pt-4 border-t">
        <Link 
          href="/login" 
          className="text-sm font-medium hover:text-primary"
          onClick={() => setIsMenuOpen(false)}
        >
          Login
        </Link>
        <Link 
          href="/register" 
          className="text-sm font-medium hover:text-primary"
          onClick={() => setIsMenuOpen(false)}
        >
          Register
        </Link>
      </div>
    )
  }

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center">
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus:bg-transparent md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <img src="/images/logo.png" alt="The Chocolate Factory" className="h-10 w-auto" />
        </Link>
        <nav className="hidden gap-6 md:flex">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                route.active ? "text-black dark:text-white" : "text-muted-foreground"
              }`}
            >
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="hidden items-center gap-4 md:flex">
     
        {renderUserMenu()}
        <Button variant="ghost" size="icon" asChild className="relative">
          <Link href="/cart">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge variant="destructive" className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                {cartCount}
              </Badge>
            )}
            <span className="sr-only">Shopping Cart</span>
          </Link>
        </Button>
      </div>
      {isMenuOpen && (
        <div className="absolute inset-x-0 top-16 z-50 w-full bg-background p-4 shadow-lg border-b md:hidden">
          <nav className="flex flex-col space-y-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  route.active ? "text-black dark:text-white" : "text-muted-foreground"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {route.label}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-4 border-t">
              <Link href="/cart" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge variant="destructive" className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                    {cartCount}
                  </Badge>
                )}
              </Link>
            </div>
            {renderMobileUserSection()}
          </nav>
        </div>
      )}
    </div>
  )
}