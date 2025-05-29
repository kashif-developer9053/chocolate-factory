// app/products/category/[categoryId]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import MainNav from "@/components/main-nav";
import Footer from "@/components/footer";
import axios from "axios";

export default function CategoryProductsPage() {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("Category");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatPrice = (price) => `Rs. ${price.toFixed(0)}`;

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products?category=${categoryId}`);
        console.log('Category Products Response:', JSON.stringify(response.data, null, 2));
        if (response.data.success) {
          setProducts(response.data.data.products);
          if (response.data.data.products.length > 0) {
            setCategoryName(response.data.data.products[0].category?.name || "Category");
          }
        } else {
          setError("Failed to load products");
        }
      } catch (error) {
        console.error("Error fetching category products:", error.message, error.response?.data);
        setError(error.response?.data?.message || "An error occurred while fetching products");
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategoryProducts();
    } else {
      setError("Invalid category ID");
      setLoading(false);
    }
  }, [categoryId]);

  if (loading) {
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
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-[#2a201c]">
                Loading...
              </h1>
            </div>
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C8815F]"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
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
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-[#2a201c]">
                Error
              </h1>
            </div>
            <div className="flex justify-center items-center min-h-[200px]">
              <p className="text-red-500">{error}</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f5f2]">
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-center sm:text-5xl text-[#2a201c]">
              {categoryName} Products
            </h1>
            <p className="mt-4 text-lg text-center text-gray-600">
              Explore our handcrafted selection in this category
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <Card key={product._id} className="overflow-hidden">
                  <Link href={`/products/${product._id}`}>
                    <div className="relative h-48 w-full overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform hover:scale-75"
                        />
                      ) : (
                        <div className="h-full w-full bg-[#f8f5f2] flex items-center justify-center">
                          <span className="text-gray-600">{product.name}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <Link href={`/products/${product._id}`} className="hover:underline">
                        <h3 className="font-bold text-lg">{product.name}</h3>
                      </Link>
                      <span className="text-[#C8915F] font-semibold">{formatPrice(product.price)}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs px-2 py-1 bg-[#f8f5f2] text-[#8B5F2B] rounded-full">
                        {product.category?.name || "Uncategorized"}
                      </span>
                      <Button
                        variant="ghost"
                        className="inline-flex items-center justify-center gap-2 text-sm font-medium text-[#C8915F] hover:text-[#C8915F]/90 hover:bg-[#f8f5f2]"
                        onClick={(e) => {
                          e.preventDefault();
                          console.log("Adding to cart:", product);
                        }}
                      >
                        <CirclePlus className="mr-1 h-4 w-4" /> Add to Cart
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600">No products available in this category.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}