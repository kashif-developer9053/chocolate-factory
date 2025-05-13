"use client"

import { useState } from "react"
import Link from "next/link"
import { Star, Filter, ChevronDown, ChevronUp, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  const [selectedBrands, setSelectedBrands] = useState([])
  const [sortOption, setSortOption] = useState("featured")

  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 129.99,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop",
      category: "Electronics",
      brand: "SoundMax",
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
      brand: "TechGear",
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
      brand: "UrbanStyle",
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
      brand: "HomeEssentials",
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
      brand: "FitLife",
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
      brand: "SoundMax",
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
      brand: "SoundMax",
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
      brand: "TechGear",
      isNew: false,
      isSale: false,
    },
    {
      id: 9,
      name: "Yoga Mat",
      price: 29.99,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?q=80&w=400&auto=format&fit=crop",
      category: "Sports",
      brand: "FitLife",
      isNew: false,
      isSale: false,
    },
    {
      id: 10,
      name: "Desk Lamp",
      price: 39.99,
      rating: 4.2,
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=400&auto=format&fit=crop",
      category: "Home & Kitchen",
      brand: "HomeEssentials",
      isNew: false,
      isSale: false,
    },
    {
      id: 11,
      name: "Bluetooth Speaker",
      price: 79.99,
      originalPrice: 99.99,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?q=80&w=400&auto=format&fit=crop",
      category: "Electronics",
      brand: "SoundMax",
      isNew: false,
      isSale: true,
    },
    {
      id: 12,
      name: "Leather Wallet",
      price: 49.99,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=400&auto=format&fit=crop",
      category: "Fashion",
      brand: "UrbanStyle",
      isNew: true,
      isSale: false,
    },
  ]

  const categories = [
    { id: "electronics", name: "Electronics" },
    { id: "fashion", name: "Fashion" },
    { id: "home-kitchen", name: "Home & Kitchen" },
    { id: "sports", name: "Sports" },
    { id: "beauty", name: "Beauty" },
    { id: "books", name: "Books" },
  ]

  const brands = [
    { id: "soundmax", name: "SoundMax" },
    { id: "techgear", name: "TechGear" },
    { id: "urbanstyle", name: "UrbanStyle" },
    { id: "homeessentials", name: "HomeEssentials" },
    { id: "fitlife", name: "FitLife" },
  ]

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const toggleBrand = (brandId) => {
    setSelectedBrands((prev) => (prev.includes(brandId) ? prev.filter((id) => id !== brandId) : [...prev, brandId]))
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

    // Filter by brand
    if (selectedBrands.length > 0) {
      const brandId = product.brand.toLowerCase().replace(/\s+/g, "")
      if (!selectedBrands.includes(brandId)) {
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
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
              <p className="text-muted-foreground">Showing {sortedProducts.length} products</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="flex items-center gap-2 md:hidden"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="h-4 w-4" />
                Filters
                {isFilterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Sort by:</span>
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-[180px]">
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
            <div className={`${isFilterOpen ? "block" : "hidden"} md:block space-y-6 rounded-lg border p-4`}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button variant="ghost" size="sm" className="h-8 px-2 md:hidden" onClick={() => setIsFilterOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium">Price Range</h3>
                <div className="space-y-4">
                  <Slider
                    defaultValue={[0, 1000]}
                    max={1000}
                    step={10}
                    value={priceRange}
                    onValueChange={handlePriceChange}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">$</span>
                      <Input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number.parseInt(e.target.value), priceRange[1]])}
                        className="h-8 w-20"
                      />
                    </div>
                    <span className="text-sm">to</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">$</span>
                      <Input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                        className="h-8 w-20"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Accordion type="multiple" className="w-full">
                <AccordionItem value="categories">
                  <AccordionTrigger className="text-sm font-medium">Categories</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={() => toggleCategory(category.id)}
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
                <AccordionItem value="brands">
                  <AccordionTrigger className="text-sm font-medium">Brands</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {brands.map((brand) => (
                        <div key={brand.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`brand-${brand.id}`}
                            checked={selectedBrands.includes(brand.id)}
                            onCheckedChange={() => toggleBrand(brand.id)}
                          />
                          <label
                            htmlFor={`brand-${brand.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {brand.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="availability">
                  <AccordionTrigger className="text-sm font-medium">Availability</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="in-stock" />
                        <label
                          htmlFor="in-stock"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          In Stock
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="on-sale" />
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
                className="w-full"
                variant="outline"
                onClick={() => {
                  setSelectedCategories([])
                  setSelectedBrands([])
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
              ) : (
                <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <X className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">No products found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try adjusting your filters to find what you're looking for.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSelectedCategories([])
                      setSelectedBrands([])
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
