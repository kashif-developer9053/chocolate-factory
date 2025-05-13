import Link from "next/link"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProductCardProps {
  product: {
    id: number
    name: string
    price: number
    rating: number
    image: string
    category: string
    discount?: number
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const { id, name, price, rating, image, category, discount } = product

  return (
    <Card className="overflow-hidden group">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        {discount && <Badge className="absolute top-2 left-2 bg-rose-500 hover:bg-rose-600">{discount}% OFF</Badge>}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="secondary" size="icon" className="rounded-full shadow-md">
            <Heart className="h-4 w-4" />
            <span className="sr-only">Add to wishlist</span>
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground mb-1">{category}</div>
        <Link href={`/products/${id}`}>
          <h3 className="font-medium text-lg leading-tight hover:underline line-clamp-2 mb-1">{name}</h3>
        </Link>
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{rating}</span>
        </div>
        <div className="flex items-center gap-2">
          {discount ? (
            <>
              <span className="font-bold text-lg">${(price * (1 - discount / 100)).toFixed(2)}</span>
              <span className="text-muted-foreground line-through text-sm">${price.toFixed(2)}</span>
            </>
          ) : (
            <span className="font-bold text-lg">${price.toFixed(2)}</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full gap-2">
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
