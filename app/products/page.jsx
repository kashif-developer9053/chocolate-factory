"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { CirclePlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import Footer from "@/components/footer";

export default function FeaturedProducts() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("none");
  const [categories, setCategories] = useState([{ value: "all", label: "All Categories" }]);
  const { addToCart } = useCart();

  // Fetch all featured products on mount
  const fetchFeaturedProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ featured: "true" });
      const response = await fetch(`/api/products?${params.toString()}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", JSON.stringify(data, null, 2));
        
        if (data.success) {
          const products = data.data.products;
          setAllProducts(products);
          setFilteredProducts(products);

          // Extract unique categories
          const uniqueCategories = [
            ...new Set(
              products.map((p) =>
                typeof p.category === "object" && p.category?.name
                  ? p.category.name
                  : typeof p.category === "string"
                  ? p.category
                  : "Uncategorized"
              )
            ),
          ].map((name) => ({ value: name.toLowerCase(), label: name }));
          setCategories([{ value: "all", label: "All Categories" }, ...uniqueCategories]);
        } else {
          setError("Failed to load products");
        }
      } else {
        setError("Failed to load products");
      }
    } catch (error) {
      console.error("Error fetching products:", error.message, error.response?.data);
      setError(error.response?.data?.message || "An error occurred while fetching products");
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply frontend filters and sorting
  const applyFilters = useCallback(() => {
    let filtered = [...allProducts];

    // Filter by keyword
    if (keyword.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(keyword.trim().toLowerCase())
      );
    }

    // Filter by category
    if (category !== "all") {
      filtered = filtered.filter((product) => {
        const productCategory =
          typeof product.category === "object" && product.category?.name
            ? product.category.name.toLowerCase()
            : typeof product.category === "string"
            ? product.category.toLowerCase()
            : "uncategorized";
        return productCategory === category;
      });
    }

    // Sort by price
    if (sortOrder === "asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  }, [allProducts, keyword, category, sortOrder]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  useEffect(() => {
    applyFilters();
  }, [keyword, category, sortOrder, applyFilters]);

  const formatPrice = (price) => `Rs. ${price.toFixed(0)}`;

  const handleAddToCart = (product) => {
    addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  // Function to truncate text to 2 lines
  const truncateText = (text, maxLength = 80) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container">
          <div className="mb-8 flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl font-poppins">
              Our Menu
            </h2>
            <p className="mt-4 max-w-[700px] text-muted-foreground font-poppins">
              Handcrafted with love and the finest ingredients - our most popular bakery items
            </p>
          </div>
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D2691E]"></div>
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
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl font-poppins">
              Our Menu
            </h2>
          </div>
          <div className="flex justify-center items-center min-h-[200px]">
            <p className="text-destructive font-poppins">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div>
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-background to-[#D2691E]/10">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
          .font-poppins {
            font-family: 'Poppins', sans-serif;
          }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            line-height: 1.4;
            height: 2.8em;
          }
        `}</style>
        <div className="container">
          <div className="mb-8 flex flex-col items-center text-center">
            <motion.h2
              className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl font-poppins text-[#8B4513]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Our Menu
            </motion.h2>
            <motion.p
              className="mt-4 max-w-[700px] text-muted-foreground font-poppins"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Handcrafted with love and the finest ingredients - our most popular bakery items
            </motion.p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Sidebar */}
            <motion.div
              className="lg:w-1/4 bg-white rounded-xl shadow-lg p-6 sticky top-4 h-fit border border-[#D2691E]/20"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h3 className="text-xl font-bold text-[#8B4513] font-poppins mb-6">Refine Your Selection</h3>
              <div className="space-y-6">
                {/* Search Filter */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Label htmlFor="search" className="text-sm font-semibold text-[#8B4513] font-poppins">
                    Search Products
                  </Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#D2691E]" />
                    <Input
                      id="search"
                      type="text"
                      placeholder="Search by name..."
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="pl-10 bg-background/50 border-[#D2691E]/30 focus:border-[#D2691E] focus:ring-[#D2691E] rounded-lg font-poppins transition-all duration-300 hover:border-[#D2691E]/50"
                    />
                  </div>
                </motion.div>

                {/* Price Sort Filter */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Label htmlFor="price-sort" className="text-sm font-semibold text-[#8B4513] font-poppins">
                    Sort by Price
                  </Label>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger
                      id="price-sort"
                      className="mt-2 bg-background/50 border-[#D2691E]/30 focus:border-[#D2691E] focus:ring-[#D2691E] rounded-lg font-poppins transition-all duration-300 hover:border-[#D2691E]/50"
                    >
                      <SelectValue placeholder="Select sort order" />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-lg shadow-lg">
                      <SelectItem value="none">Default</SelectItem>
                      <SelectItem value="asc">Low to High</SelectItem>
                      <SelectItem value="desc">High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>

                {/* Category Filter */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <Label htmlFor="category-filter" className="text-sm font-semibold text-[#8B4513] font-poppins">
                    Category
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger
                      id="category-filter"
                      className="mt-2 bg-background/50 border-[#D2691E]/30 focus:border-[#D2691E] focus:ring-[#D2691E] rounded-lg font-poppins transition-all duration-300 hover:border-[#D2691E]/50"
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-lg shadow-lg">
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value} className="mx-4">
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              </div>
            </motion.div>

            {/* Products Grid */}
            <div className="lg:w-3/4">
              {filteredProducts.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                    >
                      <Card className="group overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 h-[420px] flex flex-col bg-white rounded-xl">
                        <Link href={`/products/${product._id}`}>
                          <div className="relative h-52 w-full overflow-hidden rounded-t-xl">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `https://via.placeholder.com/400x300?text=${encodeURIComponent(
                                    product.name
                                  )}`;
                                }}
                              />
                            ) : (
                              <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 font-poppins font-medium">{product.name}</span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                          </div>
                        </Link>
                        <CardContent className="p-5 flex flex-col flex-1 justify-between">
                          <div className="flex flex-col h-full">
                            <div className="flex justify-between items-start mb-3">
                              <Link href={`/products/${product._id}`} className="hover:underline flex-1 mr-2">
                                <h3 className="font-bold text-lg text-[#8B4513] font-poppins leading-tight hover:text-[#D2691E] transition-colors duration-200">
                                  {product.name}
                                </h3>
                              </Link>
                              <span className="text-[#D2691E] font-bold text-lg font-poppins whitespace-nowrap">
                                {formatPrice(product.price)}
                              </span>
                            </div>
                            
                            <div className="mb-4 flex-1">
                              <p className="text-gray-600 text-sm line-clamp-2 font-poppins leading-relaxed">
                                {product.description || "Delicious handcrafted item made with finest ingredients"}
                              </p>
                            </div>
                            
                            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                              <span className="text-xs px-3 py-1.5 bg-[#D2691E]/10 text-[#D2691E] rounded-full font-poppins font-medium">
                                {typeof product.category === "object" && product.category?.name
                                  ? product.category.name
                                  : typeof product.category === "string"
                                  ? product.category
                                  : "Uncategorized"}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="inline-flex items-center justify-center gap-2 text-sm font-medium text-[#D2691E] hover:text-white hover:bg-[#D2691E] font-poppins transition-all duration-300 rounded-lg px-3 py-2"
                                onClick={() => handleAddToCart(product)}
                              >
                                <CirclePlus className="h-4 w-4" />
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-20">
                  <div className="max-w-md mx-auto">
                    <div className="h-20 w-20 mx-auto mb-4 bg-[#D2691E]/10 rounded-full flex items-center justify-center">
                      <Search className="h-8 w-8 text-[#D2691E]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#8B4513] font-poppins mb-2">No products found</h3>
                    <p className="text-gray-600 font-poppins">Try adjusting your search criteria or browse all categories.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}