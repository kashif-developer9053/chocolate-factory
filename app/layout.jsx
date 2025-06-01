import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import MainNav from "@/components/main-nav"
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "The Chocolate Factory - Delicious Treats & Gifts",
  description: "Discover premium handcrafted chocolates, candies and sweet treats",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>

      <body className={inter.className}>

        <ThemeProvider attribute="class" defaultTheme="light">

              <CartProvider>
<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
          {children}

                  </CartProvider>

        </ThemeProvider>
      </body>
    </html>
  )
}
