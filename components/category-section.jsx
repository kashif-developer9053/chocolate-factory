import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export default function CategorySection() {
  const categories = [
    {
      name: "Electronics",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=300&auto=format&fit=crop",
      href: "/categories/electronics",
    },
    {
      name: "Fashion",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=300&auto=format&fit=crop",
      href: "/categories/fashion",
    },
    {
      name: "Home & Kitchen",
      image: "https://images.unsplash.com/photo-1556911220-bda9f7f7597e?q=80&w=300&auto=format&fit=crop",
      href: "/categories/home-kitchen",
    },
    {
      name: "Beauty",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=300&auto=format&fit=crop",
      href: "/categories/beauty",
    },
    {
      name: "Sports",
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=300&auto=format&fit=crop",
      href: "/categories/sports",
    },
    {
      name: "Books",
      image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=300&auto=format&fit=crop",
      href: "/categories/books",
    },
  ]

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container">
        <div className="mb-8 flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Shop by Category</h2>
          <p className="mt-4 max-w-[700px] text-muted-foreground">
            Browse our wide selection of products across popular categories
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((category) => (
            <Link key={category.name} href={category.href}>
              <Card className="overflow-hidden transition-all hover:shadow-md">
                <CardContent className="p-0">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-medium">{category.name}</h3>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
