"use client"

import { useState } from "react"
import Link from "next/link"
import { Star, Filter, ChevronDown, ChevronUp, X, CirclePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import MainNav from "@/components/main-nav"
import Footer from "@/components/footer"

export default function ProductsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedTypes, setSelectedTypes] = useState([])
  const [sortOption, setSortOption] = useState("featured")

  const products = [
    {
      id: 1,
      name: "Chocolate Croissant",
      price: 350,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1623334044303-241021148842?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      category: "Pastries",
      type: "Breakfast",
      isNew: true,
      isSale: false,
      description: "Buttery, flaky croissant filled with rich chocolate, baked to golden perfection."
    },
    {
      id: 2,
      name: "Classic Tiramisu",
      price: 450,
      originalPrice: 500,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      category: "Desserts",
      type: "Italian",
      isNew: false,
      isSale: true,
      description: "Layers of coffee-soaked ladyfingers and mascarpone cream, dusted with cocoa powder."
    },
    {
      id: 3,
      name: "Artisan Sourdough Bread",
      price: 300,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      category: "Bread",
      type: "Artisan",
      isNew: true,
      isSale: false,
      description: "Traditional sourdough made with our 5-year-old starter, featuring a crispy crust and chewy interior."
    },
    {
      id: 4,
      name: "Lotus Cheesecake",
      price: 550,
      originalPrice: 650,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      category: "Desserts",
      type: "Signature",
      isNew: false,
      isSale: true,
      description: "Creamy cheesecake with a layer of Lotus Biscoff spread and crumbled biscuit topping."
    },
    {
      id: 5,
      name: "Pistachio Baklava",
      price: 280,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      category: "Middle Eastern",
      type: "Traditional",
      isNew: false,
      isSale: false,
      description: "Layers of flaky phyllo pastry filled with chopped pistachios, soaked in honey syrup."
    },
    {
      id: 6,
      name: "Cinnamon Rolls",
      price: 250,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      category: "Pastries",
      type: "Breakfast",
      isNew: true,
      isSale: false,
      description: "Soft, fluffy rolls with a swirl of cinnamon sugar, topped with cream cheese frosting."
    },
    {
      id: 7,
      name: "Mango Mousse Cake",
      price: 500,
      originalPrice: 600,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      category: "Desserts",
      type: "Seasonal",
      isNew: false,
      isSale: true,
      description: "Light and airy mousse cake made with fresh Pakistani mangoes on a vanilla sponge base."
    },
    {
      id: 8,
      name: "Fresh Naan",
      price: 100,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      category: "Bread",
      type: "Traditional",
      isNew: false,
      isSale: false,
      description: "Soft, pillowy traditional naan bread baked in our tandoor oven, brushed with butter."
    },
    {
      id: 9,
      name: "Butter Cookies",
      price: 200,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      category: "Cookies",
      type: "Signature",
      isNew: false,
      isSale: false,
      description: "Melt-in-your-mouth butter cookies made with premium French butter and vanilla."
    },
    {
      id: 10,
      name: "Classic Croissant",
      price: 180,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      category: "Pastries",
      type: "Breakfast",
      isNew: false,
      isSale: false,
      description: "Authentic French croissants with a buttery, flaky exterior and soft, airy interior."
    },
    {
      id: 11,
      name: "Carrot Cake",
      price: 400,
      originalPrice: 450,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1566121933407-3c7ccdd26763?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      category: "Cakes",
      type: "Signature",
      isNew: false,
      isSale: true,
      description: "Moist carrot cake with walnuts and cream cheese frosting, a Chalet Cafe classic."
    },
    {
      id: 12,
      name: "Chocolate Chip Cookies",
      price: 220,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      category: "Cookies",
      type: "Popular",
      isNew: true,
      isSale: false,
      description: "Perfectly baked cookies with chunks of premium chocolate and a soft, chewy center."
    },
  ]

  const categories = [
    { id: "pastries", name: "Pastries" },
    { id: "desserts", name: "Desserts" },
    { id: "bread", name: "Bread" },
    { id: "middle-eastern", name: "Middle Eastern" },
    { id: "cookies", name: "Cookies" },
    { id: "cakes", name: "Cakes" },
  ]

  const types = [
    { id: "breakfast", name: "Breakfast" },
    { id: "italian", name: "Italian" },
    { id: "artisan", name: "Artisan" },
    { id: "signature", name: "Signature" },
    { id: "traditional", name: "Traditional" },
    { id: "seasonal", name: "Seasonal" },
    { id: "popular", name: "Popular" },
  ]

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const toggleType = (typeId) => {
    setSelectedTypes((prev) => (prev.includes(typeId) ? prev.filter((id) => id !== typeId) : [...prev, typeId]))
  }

  const handlePriceChange = (value) => {
    setPriceRange(value)
  }

  const filteredProducts = products.filter((product) => {
    // Filter by price
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false
    }

    // Filter by category
    if (selectedCategories.length > 0) {
      const categoryId = product.category.toLowerCase().replace(/\s+/g, "-")
      if (!selectedCategories.includes(categoryId)) {
        return false
      }
    }

    // Filter by type
    if (selectedTypes.length > 0) {
      const typeId = product.type.toLowerCase().replace(/\s+/g, "")
      if (!selectedTypes.includes(typeId)) {
        return false
      }
    }

    return true
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-low-high":
        return a.price - b.price
      case "price-high-low":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "newest":
        return a.isNew ? -1 : b.isNew ? 1 : 0
      default:
        return 0 // featured
    }
  })

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f5f2]">
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#2a201c]">Our Menu</h1>
              <p className="text-gray-600">Showing {sortedProducts.length} delicious items</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-[#C8815F] text-[#C8815F] md:hidden"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="h-4 w-4" />
                Filters
                {isFilterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#2a201c]">Sort by:</span>
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-[180px] border-[#E6DDD4]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                    <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {/* Filters */}
            <div className={`${isFilterOpen ? "block" : "hidden"} md:block space-y-6 rounded-lg border border-[#E6DDD4] bg-white p-4`}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#2a201c]">Filters</h2>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-[#C8815F] md:hidden" onClick={() => setIsFilterOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium text-[#2a201c]">Price Range</h3>
                <div className="space-y-4">
                  <Slider
                    defaultValue={[0, 1000]}
                    max={1000}
                    step={50}
                    value={priceRange}
                    onValueChange={handlePriceChange}
                    className="[&>[role=slider]]:bg-[#C8815F] [&>.bg-primary]:bg-[#C8815F]"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Rs.</span>
                      <Input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number.parseInt(e.target.value), priceRange[1]])}
                        className="h-8 w-20 border-[#E6DDD4]"
                      />
                    </div>
                    <span className="text-sm">to</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Rs.</span>
                      <Input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                        className="h-8 w-20 border-[#E6DDD4]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Accordion type="multiple" className="w-full">
                <AccordionItem value="categories" className="border-b border-[#E6DDD4]">
                  <AccordionTrigger className="text-sm font-medium text-[#2a201c]">Categories</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={() => toggleCategory(category.id)}
                            className="border-[#C8815F] [&[data-state=checked]]:bg-[#C8815F]"
                          />
                          <label
                            htmlFor={`category-${category.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="types" className="border-b border-[#E6DDD4]">
                  <AccordionTrigger className="text-sm font-medium text-[#2a201c]">Types</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {types.map((type) => (
                        <div key={type.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`type-${type.id}`}
                            checked={selectedTypes.includes(type.id)}
                            onCheckedChange={() => toggleType(type.id)}
                            className="border-[#C8815F] [&[data-state=checked]]:bg-[#C8815F]"
                          />
                          <label
                            htmlFor={`type-${type.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {type.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="availability" className="border-b border-[#E6DDD4]">
                  <AccordionTrigger className="text-sm font-medium text-[#2a201c]">Availability</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="in-stock" className="border-[#C8815F] [&[data-state=checked]]:bg-[#C8815F]" />
                        <label
                          htmlFor="in-stock"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          In Stock
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="on-sale" className="border-[#C8815F] [&[data-state=checked]]:bg-[#C8815F]" />
                        <label
                          htmlFor="on-sale"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          On Sale
                        </label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Button
                className="w-full border-[#C8815F] text-[#C8815F] hover:bg-[#C8815F]/10"
                variant="outline"
                onClick={() => {
                  setSelectedCategories([])
                  setSelectedTypes([])
                  setPriceRange([0, 1000])
                }}
              >
                Reset Filters
              </Button>
            </div>

            {/* Products Grid */}
            <div className="md:col-span-3">
              {sortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden border-none">
                      <div className="relative h-48 w-full overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform hover:scale-105"
                        />
                        {product.isNew && (
                          <span className="absolute left-2 top-2 bg-green-500 px-2 py-1 text-xs font-bold text-white rounded-full">
                            New
                          </span>
                        )}
                        {product.isSale && (
                          <span className="absolute right-2 top-2 bg-red-500 px-2 py-1 text-xs font-bold text-white rounded-full">
                            Sale
                          </span>
                        )}
                      </div>
                      <CardContent className="p-5 bg-white">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-[#2a201c]">{product.name}</h3>
                          <span className="text-[#C8815F] font-semibold">
                            {product.originalPrice ? (
                              <>Rs. {product.price}</>
                            ) : (
                              <>Rs. {product.price}</>
                            )}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs px-2 py-1 bg-[#f8f5f2] text-[#C8815F] rounded-full">
                            {product.category}
                          </span>
                          <Button 
                            variant="ghost" 
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 rounded-md px-3 text-[#C8815F] hover:text-[#C8815F]/90 hover:bg-[#f8f5f2]"
                          >
                            <CirclePlus className="mr-1 h-4 w-4" /> Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-[#E6DDD4] p-8 text-center bg-white">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f8f5f2]">
                    <X className="h-10 w-10 text-[#C8815F]" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-[#2a201c]">No items found</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Try adjusting your filters to find what you're looking for.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 border-[#C8815F] text-[#C8815F] hover:bg-[#C8815F]/10"
                    onClick={() => {
                      setSelectedCategories([])
                      setSelectedTypes([])
                      setPriceRange([0, 1000])
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}