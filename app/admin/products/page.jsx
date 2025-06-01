"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search, MoreHorizontal, Edit, Trash2, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"
import axios from "axios"

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [brandFilter, setBrandFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const itemsPerPage = 10

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [currentPage, categoryFilter, searchQuery, statusFilter, brandFilter, sortField, sortDirection])

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/products/categories')
      if (res.data.success) {
        setCategories(res.data.data)
        
        // Extract unique brands from products for the filter
        const uniqueBrands = [...new Set(products.map(product => product.brand))].filter(Boolean)
        setBrands(uniqueBrands)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      })
    }
  }

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      // Build query params
      const params = new URLSearchParams()
      params.append('page', currentPage)
      params.append('limit', itemsPerPage)
      params.append('sortBy', sortField)
      params.append('sortOrder', sortDirection)
      
      if (searchQuery) params.append('keyword', searchQuery)
      if (categoryFilter !== "all") params.append('category', categoryFilter)
      if (brandFilter !== "all") params.append('brand', brandFilter)
      
      // Handle stock status filter
      if (statusFilter === 'Out of Stock') {
        params.append('maxStock', 0)
      } else if (statusFilter === 'Low Stock') {
        params.append('maxStock', 10)
        params.append('minStock', 1)
      } else if (statusFilter === 'In Stock') {
        params.append('minStock', 11)
      }
      
      const res = await axios.get(`/api/products?${params.toString()}`)
      
      if (res.data.success) {
        setProducts(res.data.data.products)
        setTotalPages(res.data.data.pages)
        setTotalProducts(res.data.data.total)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
    setCurrentPage(1)
  }

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(products.map((product) => product._id))
    }
  }

  const toggleSelectProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId))
    } else {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  const deleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    
    try {
      const res = await axios.delete(`/api/products/${productId}`)
      
      if (res.data.success) {
        toast({
          title: "Product deleted",
          description: "The product has been deleted successfully",
        })
        fetchProducts()
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  const bulkDelete = async () => {
    if (selectedProducts.length === 0) return
    
    if (!confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) return
    
    try {
      // Loop through each product ID and delete
      for (const id of selectedProducts) {
        await axios.delete(`/api/products/${id}`)
      }
      
      toast({
        title: `${selectedProducts.length} products deleted`,
        description: "The selected products have been deleted successfully",
      })
      
      setSelectedProducts([])
      fetchProducts()
    } catch (error) {
      console.error("Error with bulk delete:", error)
      toast({
        title: "Error",
        description: "Failed to delete some products",
        variant: "destructive",
      })
    }
  }

  const getStockStatus = (stock) => {
    if (stock <= 0) return { label: "Out of Stock", variant: "destructive" }
    if (stock <= 10) return { label: "Low Stock", variant: "outline" }
    return { label: "In Stock", variant: "default" }
  }

  const resetFilters = () => {
    setSearchQuery("")
    setCategoryFilter("all")
    setBrandFilter("all")
    setStatusFilter("all")
    setSortField("name")
    setSortDirection("asc")
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory, prices, and details</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>
          
          <Select
            value={categoryFilter}
            onValueChange={(value) => {
              setCategoryFilter(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {brands.length > 0 && (
            <Select
              value={brandFilter}
              onValueChange={(value) => {
                setBrandFilter(value)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="In Stock">In Stock</SelectItem>
              <SelectItem value="Low Stock">Low Stock</SelectItem>
              <SelectItem value="Out of Stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
          
          {(searchQuery || categoryFilter !== "all" || brandFilter !== "all" || statusFilter !== "all") && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Clear Filters
            </Button>
          )}
        </div>
        
        {selectedProducts.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{selectedProducts.length} selected</span>
            <Button variant="outline" size="sm" onClick={bulkDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={products.length > 0 && selectedProducts.length === products.length}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("name")}>
                <div className="flex items-center gap-1">
                  Product
                  {sortField === "name" && (
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => toggleSort("price")}>
                <div className="flex items-center justify-end gap-1">
                  Price
                  {sortField === "price" && (
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => toggleSort("stock")}>
                <div className="flex items-center justify-end gap-1">
                  Stock
                  {sortField === "stock" && (
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Loading products...
                </TableCell>
              </TableRow>
            ) : products.length > 0 ? (
              products.map((product) => {
                const stockStatus = getStockStatus(product.stock)
                
                return (
                  <TableRow key={product._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product._id)}
                        onCheckedChange={() => toggleSelectProduct(product._id)}
                        aria-label={`Select ${product.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.images && product.images[0] ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                            No img
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">SKU: {product._id.substring(product._id.length - 8)}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.category?.name || '-'}</TableCell>
                    <TableCell className="text-right">
                      ${product.price.toFixed(2)}
                      {product.discountedPrice && (
                        <div className="text-sm text-muted-foreground line-through">
                          ${product.discountedPrice.toFixed(2)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{product.stock}</TableCell>
                    <TableCell>
                      <Badge variant={stockStatus.variant}>
                        {stockStatus.label}
                      </Badge>
                      {product.featured && (
                        <Badge variant="secondary" className="ml-2">
                          Featured
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/products/edit/${product._id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deleteProduct(product._id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} products
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show 5 page buttons centered around current page
              let pageNum = currentPage - 2 + i;
              if (pageNum < 1) pageNum += 5;
              if (pageNum > totalPages) pageNum -= 5;
              
              return (
                pageNum > 0 && pageNum <= totalPages && (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="icon"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              );
            })}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}