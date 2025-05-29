// app/categories/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import MainNav from "@/components/main-nav";
import Footer from "@/components/footer";
import axios from "axios";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/products/categories");
        console.log('Categories Response:', JSON.stringify(response.data, null, 2));
        if (response.data.success) {
          setCategories(response.data.data);
        } else {
          setError("Failed to load categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error.message, error.response?.data);
        setError(error.response?.data?.message || "An error occurred while fetching categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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
                Our Delicious Categories
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Explore our handcrafted selection of freshly baked goods and cafe delights
              </p>
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
                Our Delicious Categories
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

  if (categories.length === 0) {
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
                Our Delicious Categories
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Explore our handcrafted selection of freshly baked goods and cafe delights
              </p>
            </div>
            <div className="flex justify-center items-center min-h-[200px]">
              <p className="text-gray-600">No categories available at the moment.</p>
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
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-[#2a201c]">
              Our Delicious Categories
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Explore our handcrafted selection of freshly baked goods and cafe delights
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <Link key={category._id} href={`/categories/${category._id}`} className="h-full">
                <Card className="overflow-hidden transition-all hover:shadow-lg border-none h-full flex flex-col">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="aspect-[4/3] overflow-hidden flex-shrink-0">
                      <img
                        src={category.image || `https://via.placeholder.com/600x450?text=${encodeURIComponent(category.name)}`}
                        alt={category.name}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <div className="p-6 bg-white flex flex-col flex-grow">
                      <h3 className="text-xl font-semibold text-[#2a201c]">{category.name}</h3>
                      <p className="mt-2 text-sm text-gray-600 flex-grow">{category.description || "No description available"}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs px-2 py-1 bg-[#f8f5f2] text-[#8B5A2B] rounded-full">
                          {category.productCount || 0} Items
                        </span>
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
  );
}