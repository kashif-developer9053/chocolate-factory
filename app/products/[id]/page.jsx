// /app/products/[id]/page.jsx
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ChevronLeft, 
  CirclePlus, 
  Minus, 
  Plus, 
  Star, 
  ShoppingCart,
  Info 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import axios from "axios"

export default function ProductDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id)
    }
  }, [params.id])

  const fetchProduct = async (id) => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/products/${id}`)
      
      if (response.data.success) {
        setProduct(response.data.data)
        // Fetch related products from the same category
        if (response.data.data.category) {
          fetchRelatedProducts(response.data.data.category._id, id)
        }
      } else {
        setError("Failed to load product details")
      }
    } catch (error) {
      console.error("Error fetching product:", error)
      setError("An error occurred while fetching product details")
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async (categoryId, currentProductId) => {
    try {
      const response = await axios.get(`/api/products?category=${categoryId}&limit=4`)
      
      if (response.data.success) {
        // Filter out the current product
        const filteredProducts = response.data.data.products.filter(
          prod => prod._id !== currentProductId
        )
        setRelatedProducts(filteredProducts.slice(0, 4))
      }
    } catch (error) {
      console.error("Error fetching related products:", error)
    }
  }

  // Function to format price
  const formatPrice = (price) => {
    return `Rs. ${price.toFixed(0)}`
  }

  // Handlers for quantity
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    // You might want to check against available stock
    if (product && product.stock > quantity) {
      setQuantity(quantity + 1)
    }
  }

  const addToCart = () => {
    // Add to cart functionality will go here
    console.log("Adding to cart:", product, "Quantity:", quantity)
    // You would typically dispatch to a cart context/redux action here
  }

  if (loading) {
    return (
      <div className="container py-12 min-h-screen">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container py-12 min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="text-4xl">😞</div>
          <h1 className="text-xl font-bold">Product Not Found</h1>
          <p className="text-muted-foreground">{error || "This product doesn't exist or has been removed."}</p>
          <Button asChild>
            <Link href="/products">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Menu
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/products">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Menu
        </Link>
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://via.placeholder.com/600x600?text=${encodeURIComponent(product.name)}`;
                }}
              />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center">
                <Info className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>
          
          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-2 overflow-auto pb-2">
              {product.images.map((image, index) => (
                <div 
                  key={index}
                  className={`h-20 w-20 flex-shrink-0 cursor-pointer rounded-md overflow-hidden border-2 ${
                    activeImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <img
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://via.placeholder.com/100x100?text=${encodeURIComponent('Image ' + (index + 1))}`;
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">{formatPrice(product.price)}</span>
              {product.discountedPrice && product.discountedPrice > 0 && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.discountedPrice)}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center text-yellow-400">
              {/* Generate stars based on rating */}
              {Array.from({ length: 5 }).map((_, index) => (
                <Star 
                  key={index}
                  className={`h-5 w-5 ${index < (product.rating || 0) ? "fill-current" : "text-muted"}`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({product.numReviews || 0} reviews)</span>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Category</h3>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-secondary text-xs font-medium">
                {product.category?.name || 'Uncategorized'}
              </span>
            </div>
          </div>
          
          {product.brand && (
            <div>
              <h3 className="font-medium mb-2">Brand</h3>
              <p className="text-muted-foreground">{product.brand}</p>
            </div>
          )}
          
          <div>
            <h3 className="font-medium mb-2">Quantity</h3>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={increaseQuantity}
                disabled={product.stock <= quantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="flex-1"
              onClick={addToCart}
              disabled={product.stock <= 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="flex-1"
              onClick={() => {
                addToCart();
                router.push('/cart');
              }}
              disabled={product.stock <= 0}
            >
              Buy Now
            </Button>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium">In Stock ({product.stock} available)</span>
              ) : (
                <span className="text-red-600 font-medium">Out of Stock</span>
              )}
            </p>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct._id} className="overflow-hidden">
                <Link href={`/products/${relatedProduct._id}`}>
                  <div className="relative h-48 w-full overflow-hidden">
                    {relatedProduct.images && relatedProduct.images.length > 0 ? (
                      <img
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://via.placeholder.com/400x300?text=${encodeURIComponent(relatedProduct.name)}`;
                        }}
                      />
                    ) : (
                      <div className="h-full w-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">{relatedProduct.name}</span>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/products/${relatedProduct._id}`} className="hover:underline">
                    <h3 className="font-bold">{relatedProduct.name}</h3>
                  </Link>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-primary font-semibold">{formatPrice(relatedProduct.price)}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        console.log("Adding to cart:", relatedProduct);
                      }}
                      disabled={relatedProduct.stock <= 0}
                    >
                      <CirclePlus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}