import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface CategoryCardProps {
  category: {
    id: number
    name: string
    image: string
    count: number
  }
}

export function CategoryCard({ category }: CategoryCardProps) {
  const { id, name, image, count } = category

  return (
    <Link href={`/products/category/${id}`}>
      <Card className="overflow-hidden group h-full transition-all hover:shadow-md">
        <CardContent className="p-0">
          <div className="relative">
            <div className="aspect-square overflow-hidden">
              <img
                src={image || "/placeholder.svg"}
                alt={name}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4 text-white">
              <h3 className="font-medium text-lg">{name}</h3>
              <p className="text-sm opacity-90">{count} Products</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
