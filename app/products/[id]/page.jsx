"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Star, Minus, Plus, Heart, Share2, Truck, RotateCcw, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import MainNav from "@/components/main-nav"
import Footer from "@/components/footer"

export default function ProductPage() {
  const { id } = useParams()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  // Mock product data
  const product = {
    id: Number.parseInt(id),
    name: "Premium Wireless Headphones",
    price: 129.99,
    originalPrice: 159.99,
    rating: 4.5,
    reviewCount: 127,
    description:
      "Experience superior sound quality with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design for extended listening sessions.",
    features: [
      "Active Noise Cancellation",
      "30-hour battery life",
      "Bluetooth 5.0 connectivity",
      "Built-in microphone for calls",
      "Foldable design for easy storage",
      "Premium comfort with memory foam ear cushions",
    ],
    specifications: {
      "Driver Size": "40mm",
      "Frequency Response": "20Hz - 20kHz",
      Impedance: "32 Ohm",
      "Battery Life": "30 hours",
      "Charging Time": "2 hours",
      Weight: "250g",
      Connectivity: "Bluetooth 5.0, 3.5mm jack",
      Microphone: "Built-in with noise reduction",
      Controls: "Touch controls on ear cup",
    },
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=600&auto=format&fit=crop",
    ],
    colors: ["Black", "White", "Blue"],
    stock: 15,
    category: "Electronics",
    brand: "SoundMax",
    isNew: true,
    isSale: true,
    relatedProducts: [
      {
        id: 6,
        name: "Wireless Earbuds",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=300&auto=format&fit=crop",
      },
      {
        id: 7,
        name: "Portable Speaker",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=300&auto=format&fit=crop",
      },
      {
        id: 8,
        name: "Digital Camera",
        price: 399.99,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=300&auto=format&fit=crop",
      },
      {
        id: 2,
        name: "Smart Watch",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300&auto=format&fit=crop",
      },
    ],
    reviews: [
      {
        id: 1,
        user: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=50&auto=format&fit=crop",
        rating: 5,
        date: "2023-05-15",
        title: "Excellent sound quality!",
        content:
          "I'm extremely impressed with these headphones. The sound quality is exceptional, and the noise cancellation works perfectly. Battery life is as advertised, and they're very comfortable to wear for long periods.",
      },
      {
        id: 2,
        user: "Michael Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=50&auto=format&fit=crop",
        rating: 4,
        date: "2023-04-28",
        title: "Great headphones, minor comfort issues",
        content:
          "The sound quality and noise cancellation are fantastic. My only complaint is that they get a bit uncomfortable after wearing them for more than 3 hours. Otherwise, they're perfect!",
      },
      {
        id: 3,
        user: "Emily Rodriguez",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&auto=format&fit=crop",
        rating: 5,
        date: "2023-04-10",
        title: "Worth every penny",
        content:
          "These headphones have exceeded my expectations. The sound is crisp and clear, and the noise cancellation is a game-changer for my daily commute. Highly recommend!",
      },
    ],
  }

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const addToCart = () => {
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} added to your cart`,
    })
  }

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: isWishlisted
        ? `${product.name} has been removed from your wishlist`
        : `${product.name} has been added to your wishlist`,
    })
  }

  const shareProduct = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied",
      description: "Product link has been copied to clipboard",
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-4 flex items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-primary">
              Products
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/categories/${product.category.toLowerCase()}`} className="hover:text-primary">
              {product.category}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg border">
                <img
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                {product.isNew && <Badge className="absolute left-2 top-2 bg-green-500 hover:bg-green-600">New</Badge>}
                {product.isSale && (
                  <Badge variant="destructive" className="absolute right-2 top-2">
                    Sale
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`aspect-square overflow-hidden rounded-md border ${
                      selectedImage === index ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} view ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-center">
                  <Badge variant="outline" className="mr-2">
                    {product.brand}
                  </Badge>
                  <span className="text-sm text-muted-foreground">SKU: {product.id.toString().padStart(6, "0")}</span>
                </div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : i < product.rating
                              ? "fill-yellow-400 text-yellow-400 [clip-path:inset(0_50%_0_0)]"
                              : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium">{product.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{product.reviewCount} reviews</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {product.originalPrice ? (
                    <>
                      <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
                      <span className="text-lg text-muted-foreground line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                      <Badge variant="destructive">Save ${(product.originalPrice - product.price).toFixed(2)}</Badge>
                    </>
                  ) : (
                    <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Price includes taxes. Shipping calculated at checkout.</p>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 font-medium">Color</h3>
                  <div className="flex gap-2">
                    {product.colors.map((color) => (
                      <button key={color} className="rounded-md border px-3 py-1 text-sm hover:border-primary">
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-medium">Quantity</h3>
                  <div className="flex items-center">
                    <Button variant="outline" size="icon" onClick={decrementQuantity} disabled={quantity <= 1}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <span className="ml-4 text-sm text-muted-foreground">{product.stock} available</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button className="flex-1" size="lg" onClick={addToCart}>
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="icon" className="h-11 w-11" onClick={toggleWishlist}>
                    <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                    <span className="sr-only">Add to wishlist</span>
                  </Button>
                  <Button variant="outline" size="icon" className="h-11 w-11" onClick={shareProduct}>
                    <Share2 className="h-5 w-5" />
                    <span className="sr-only">Share product</span>
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">Free shipping on orders over $100</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">30-day easy returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">2-year warranty included</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <Tabs defaultValue="description">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({product.reviews.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4">
                <div className="prose max-w-none dark:prose-invert">
                  <p>{product.description}</p>
                </div>
              </TabsContent>
              <TabsContent value="features" className="mt-4">
                <ul className="grid gap-2 sm:grid-cols-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="rounded-full bg-primary/10 p-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-primary"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>
              <TabsContent value="specifications" className="mt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b pb-2">
                      <span className="font-medium">{key}</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="mt-4">
                <div className="space-y-6">
                  {product.reviews.map((review) => (
                    <div key={review.id} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={review.avatar || "/placeholder.svg"}
                            alt={review.user}
                            className="h-10 w-10 rounded-full"
                          />
                          <div>
                            <h4 className="font-medium">{review.user}</h4>
                            <div className="flex items-center">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="ml-2 text-xs text-muted-foreground">
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <h5 className="mt-2 font-medium">{review.title}</h5>
                      <p className="mt-1 text-sm text-muted-foreground">{review.content}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold">Related Products</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {product.relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`}>
                  <div className="group rounded-lg border p-2 transition-all hover:shadow-md">
                    <div className="aspect-square overflow-hidden rounded-md">
                      <img
                        src={relatedProduct.image || "/placeholder.svg"}
                        alt={relatedProduct.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-2">
                      <h3 className="line-clamp-1 font-medium group-hover:text-primary">{relatedProduct.name}</h3>
                      <p className="mt-1 font-medium">${relatedProduct.price.toFixed(2)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
