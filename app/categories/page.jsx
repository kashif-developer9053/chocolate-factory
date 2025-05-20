import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import MainNav from "@/components/main-nav"
import Footer from "@/components/footer"

export default function CategoriesPage() {
  const categories = [
    {
      id: "artisan-breads",
      name: "Artisan Breads",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      description: "Handcrafted loaves made with traditional methods",
      productCount: 12,
    },
    {
      id: "cakes-pastries",
      name: "Cakes & Pastries",
      image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      description: "Delicious treats for every occasion",
      productCount: 18,
    },
    {
      id: "cookies-biscuits",
      name: "Cookies & Biscuits",
      image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      description: "Sweet and savory bite-sized delights",
      productCount: 15,
    },
    {
      id: "specialty-desserts",
      name: "Specialty Desserts",
      image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      description: "Indulgent treats crafted with premium ingredients",
      productCount: 10,
    },
    {
      id: "coffee-beverages",
      name: "Coffee & Beverages",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      description: "Specialty coffees and refreshing drinks",
      productCount: 14,
    },
    {
      id: "breakfast-items",
      name: "Breakfast Items",
      image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      description: "Start your day with our morning specialties",
      productCount: 16,
    },
    {
      id: "traditional-pakistani",
      name: "Traditional Pakistani",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      description: "Authentic flavors from local recipes",
      productCount: 9,
    },
    {
      id: "seasonal-specials",
      name: "Seasonal Specials",
      image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      description: "Limited-time offerings using seasonal ingredients",
      productCount: 8,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f5f2]">
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-12">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-[#2a201c]">Our Delicious Categories</h1>
            <p className="mt-4 text-lg text-gray-600">
              Explore our handcrafted selection of freshly baked goods and cafe delights
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <Link key={category.id} href={`/products/category/${category.id}`} className="h-full">
                <Card className="overflow-hidden transition-all hover:shadow-lg border-none h-full flex flex-col">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="aspect-[4/3] overflow-hidden flex-shrink-0">
                      <img
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <div className="p-6 bg-white flex flex-col flex-grow">
                      <h3 className="text-xl font-semibold text-[#2a201c]">{category.name}</h3>
                      <p className="mt-2 text-sm text-gray-600 flex-grow">{category.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs px-2 py-1 bg-[#f8f5f2] text-[#8B5A2B] rounded-full">{category.productCount} Items</span>
                        <span className="text-sm font-medium text-[#C8815F] hover:underline">Browse Category</span>
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