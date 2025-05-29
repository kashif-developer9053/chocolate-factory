"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, User, Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/context/CartContext" // Import cart context

export default function MainNav() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cartCount } = useCart() // Use cart count from context

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
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search products..." className="w-[200px] pl-8 md:w-[250px] lg:w-[300px]" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/login">Login</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/register">Register</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/profile">My Profile</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
              <Link href="/login" className="text-sm font-medium hover:text-primary">
                Login
              </Link>
              <Link href="/cart" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge variant="destructive" className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                    {cartCount}
                  </Badge>
                )}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}