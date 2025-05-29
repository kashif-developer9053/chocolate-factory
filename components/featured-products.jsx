
// components/FeaturedProducts.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/products?featured=true&limit=8");
        console.log('Featured Products Response:', JSON.stringify(response.data, null, 2));
        if (response.data.success) {
          setProducts(response.data.data.products);
        } else {
          setError("Failed to load featured products");
        }
      } catch (error) {
        console.error("Error fetching featured products:", error.message, error.response?.data);
        setError(error.response?.data?.message || "An error occurred while fetching featured products");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const formatPrice = (price) => `Rs. ${price.toFixed(0)}`;
 const handleAddToCart = (product) => {
    addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (loading) {
    return (
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container">
          <div className="mb-8 flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Our Featured Menu</h2>
            <p className="mt-4 max-w-[700px] text-muted-foreground">
              Handcrafted with love and the finest ingredients - our most popular bakery items
            </p>
          </div>
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container">
          <div className="mb-8 flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Our Featured Menu</h2>
            <p className="mt-4 max-w-[700px] text-muted-foreground">
              Handcrafted with love and the finest ingredients - our most popular bakery items
            </p>
          </div>
          <div className="flex justify-center items-center min-h-[200px]">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container">
          <div className="mb-8 flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Our Featured Menu</h2>
            <p className="mt-4 max-w-[700px] text-muted-foreground">
              Handcrafted with love and the finest ingredients - our most popular bakery items
            </p>
          </div>
          <div className="flex justify-center items-center min-h-[200px]">
            <p className="text-muted-foreground">No featured products available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container">
        <div className="mb-8 flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Our Featured Menu</h2>
          <p className="mt-4 max-w-[700px] text-muted-foreground">
            Handcrafted with love and the finest ingredients - our most popular bakery items
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <Card key={product._id} className="overflow-hidden">
              <Link href={`/products/${product._id}`}>
                <div className="relative h-48 w-full overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-secondary flex items-center justify-center">
                      <span className="text-muted-foreground">{product.name}</span>
                    </div>
                  )}
                </div>
              </Link>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <Link href={`/products/${product._id}`} className="hover:underline">
                    <h3 className="font-bold text-lg">{product.name}</h3>
                  </Link>
                  <span className="text-primary font-semibold">{formatPrice(product.price)}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs px-2 py-1 bg-secondary text-primary rounded-full">
                    {product.category?.name || "Uncategorized"}
                  </span>
                  <Button
                    variant="ghost"
                    className="inline-flex items-center justify-center gap-2 text-sm font-medium text-primary hover:text-primary/90 hover:bg-secondary"
                    onClick={() => handleAddToCart(product)}
                  >
                    <CirclePlus className="mr-1 h-4 w-4" /> Add to Cart
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button asChild size="lg">
            <Link href="/products">View Full Menu</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
