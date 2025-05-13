import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import MainNav from "@/components/main-nav"
import Footer from "@/components/footer"

export default function CategoriesPage() {
  const categories = [
    {
      id: "electronics",
      name: "Electronics",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=600&auto=format&fit=crop",
      description: "Latest gadgets and electronic devices",
      productCount: 42,
    },
    {
      id: "fashion",
      name: "Fashion",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=600&auto=format&fit=crop",
      description: "Trendy clothing, shoes, and accessories",
      productCount: 56,
    },
    {
      id: "home-kitchen",
      name: "Home & Kitchen",
      image: "https://images.unsplash.com/photo-1556911220-bda9f7f7597e?q=80&w=600&auto=format&fit=crop",
      description: "Everything you need for your home",
      productCount: 38,
    },
    {
      id: "beauty",
      name: "Beauty",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop",
      description: "Makeup, skincare, and personal care products",
      productCount: 29,
    },
    {
      id: "sports",
      name: "Sports & Outdoors",
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop",
      description: "Equipment and gear for all sports and outdoor activities",
      productCount: 34,
    },
    {
      id: "books",
      name: "Books & Media",
      image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=600&auto=format&fit=crop",
      description: "Books, movies, music, and more",
      productCount: 47,
    },
    {
      id: "toys",
      name: "Toys & Games",
      image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?q=80&w=600&auto=format&fit=crop",
      description: "Fun for all ages",
      productCount: 31,
    },
    {
      id: "jewelry",
      name: "Jewelry & Watches",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop",
      description: "Elegant jewelry and watches",
      productCount: 25,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-12">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Shop by Category</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Browse our wide selection of products across popular categories
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <Link key={category.id} href={`/products/category/${category.id}`}>
                <Card className="overflow-hidden transition-all hover:shadow-lg">
                  <CardContent className="p-0">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold">{category.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm font-medium">{category.productCount} Products</span>
                        <span className="text-sm font-medium text-primary">View All</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
