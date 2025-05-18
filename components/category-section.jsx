import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export default function CategorySection() {
  const categories = [
    {
      name: "Artisan Breads",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      href: "/categories/artisan-breads",
    },
    {
      name: "Cakes & Pastries",
      image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      href: "/categories/cakes-pastries",
    },
    {
      name: "Cookies & Biscuits",
      image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      href: "/categories/cookies-biscuits",
    },
    {
      name: "Specialty Desserts",
      image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      href: "/categories/specialty-desserts",
    },
    {
      name: "Coffee & Beverages",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      href: "/categories/coffee-beverages",
    },
    {
      name: "Breakfast Items",
      image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      href: "/categories/breakfast-items",
    },
  ]

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-[#f8f5f2]">
      <div className="container">
        <div className="mb-8 flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Delicious Categories</h2>
          <p className="mt-4 max-w-[700px] text-gray-600">
            Explore our handcrafted selection of freshly baked goods and cafe delights
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <Link key={category.name} href={category.href}>
              <Card className="overflow-hidden transition-all hover:shadow-lg border-none">
                <CardContent className="p-0">
                  <div className="aspect-square overflow-hidden rounded-t-lg">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="p-4 text-center bg-white rounded-b-lg">
                    <h3 className="font-medium text-[#8B5A2B]">{category.name}</h3>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link 
            href="/menu" 
            className="inline-flex items-center px-6 py-3 rounded-md bg-[#C8815F] text-white hover:bg-[#A66B4F] transition-colors"
          >
            View Full Menu
          </Link>
        </div>
      </div>
    </section>
  )
}