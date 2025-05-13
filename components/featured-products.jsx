import Link from "next/link"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function FeaturedProducts() {
  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 129.99,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop",
      category: "Electronics",
      isNew: true,
      isSale: false,
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 199.99,
      originalPrice: 249.99,
      rating: 4.2,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop",
      category: "Electronics",
      isNew: false,
      isSale: true,
    },
    {
      id: 3,
      name: "Leather Backpack",
      price: 79.99,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=400&auto=format&fit=crop",
      category: "Fashion",
      isNew: true,
      isSale: false,
    },
    {
      id: 4,
      name: "Coffee Maker",
      price: 89.99,
      originalPrice: 119.99,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1570486876339-c7a79f5c8a9a?q=80&w=400&auto=format&fit=crop",
      category: "Home & Kitchen",
      isNew: false,
      isSale: true,
    },
    {
      id: 5,
      name: "Fitness Tracker",
      price: 49.99,
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd6b0?q=80&w=400&auto=format&fit=crop",
      category: "Sports",
      isNew: false,
      isSale: false,
    },
    {
      id: 6,
      name: "Wireless Earbuds",
      price: 89.99,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=400&auto=format&fit=crop",
      category: "Electronics",
      isNew: true,
      isSale: false,
    },
    {
      id: 7,
      name: "Portable Speaker",
      price: 59.99,
      originalPrice: 79.99,
      rating: 4.4,
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=400&auto=format&fit=crop",
      category: "Electronics",
      isNew: false,
      isSale: true,
    },
    {
      id: 8,
      name: "Digital Camera",
      price: 399.99,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop",
      category: "Electronics",
      isNew: false,
      isSale: false,
    },
  ]

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container">
        <div className="mb-8 flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Featured Products</h2>
          <p className="mt-4 max-w-[700px] text-muted-foreground">
            Discover our most popular products, hand-picked for their quality and value
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <Link href={`/products/${product.id}`}>
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                  {product.isNew && (
                    <Badge className="absolute left-2 top-2 bg-green-500 hover:bg-green-600">New</Badge>
                  )}
                  {product.isSale && (
                    <Badge variant="destructive" className="absolute right-2 top-2">
                      Sale
                    </Badge>
                  )}
                </div>
              </Link>
              <CardContent className="p-4">
                <div className="mb-1 text-sm text-muted-foreground">{product.category}</div>
                <Link href={`/products/${product.id}`} className="hover:underline">
                  <h3 className="line-clamp-1 text-lg font-medium">{product.name}</h3>
                </Link>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : i < product.rating
                              ? "fill-yellow-400 text-yellow-400 [clip-path:inset(0_50%_0_0)]"
                              : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">{product.rating}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  {product.originalPrice ? (
                    <>
                      <span className="font-medium text-primary">${product.price.toFixed(2)}</span>
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="font-medium">${product.price.toFixed(2)}</span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full">Add to Cart</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button asChild size="lg">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
