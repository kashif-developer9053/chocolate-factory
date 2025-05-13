"use client"

import { useState } from "react"
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

export default function ProductsPage() {
  const [selectedProducts, setSelectedProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Mock products data
  const allProducts = [
    {
      id: 1,
      name: "Wireless Headphones",
      category: "Electronics",
      price: 129.99,
      stock: 45,
      status: "Active",
    },
    {
      id: 2,
      name: "Smart Watch",
      category: "Electronics",
      price: 199.99,
      stock: 12,
      status: "Low Stock",
    },
    {
      id: 3,
      name: "Leather Backpack",
      category: "Fashion",
      price: 79.99,
      stock: 28,
      status: "Active",
    },
    {
      id: 4,
      name: "Coffee Maker",
      category: "Home & Kitchen",
      price: 89.99,
      stock: 8,
      status: "Low Stock",
    },
    {
      id: 5,
      name: "Fitness Tracker",
      category: "Electronics",
      price: 49.99,
      stock: 32,
      status: "Active",
    },
    {
      id: 6,
      name: "Wireless Earbuds",
      category: "Electronics",
      price: 89.99,
      stock: 56,
      status: "Active",
    },
    {
      id: 7,
      name: "Portable Speaker",
      category: "Electronics",
      price: 59.99,
      stock: 18,
      status: "Active",
    },
    {
      id: 8,
      name: "Digital Camera",
      category: "Electronics",
      price: 399.99,
      stock: 5,
      status: "Low Stock",
    },
    {
      id: 9,
      name: "Yoga Mat",
      category: "Sports",
      price: 29.99,
      stock: 42,
      status: "Active",
    },
    {
      id: 10,
      name: "Desk Lamp",
      category: "Home & Kitchen",
      price: 39.99,
      stock: 24,
      status: "Active",
    },
    {
      id: 11,
      name: "Bluetooth Speaker",
      category: "Electronics",
      price: 79.99,
      stock: 0,
      status: "Out of Stock",
    },
    {
      id: 12,
      name: "Leather Wallet",
      category: "Fashion",
      price: 49.99,
      stock: 37,
      status: "Active",
    },
  ]

  // Filter products
  const filteredProducts = allProducts.filter((product) => {
    // Search filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Category filter
    if (categoryFilter !== "all" && product.category !== categoryFilter) {
      return false
    }

    // Status filter
    if (statusFilter !== "all" && product.status !== statusFilter) {
      return false
    }

    return true
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (aValue < bValue) {
      return sortDirection === "asc" ? -1 : 1
    }
    if (aValue > bValue) {
      return sortDirection === "asc" ? 1 : -1
    }
    return 0
  })

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const toggleSelectAll = () => {
    if (selectedProducts.length === paginatedProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(paginatedProducts.map((product) => product.id))
    }
  }

  const toggleSelectProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId))
    } else {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  const deleteProduct = (productId) => {
    // In a real app, you would call an API to delete the product
    toast({
      title: "Product deleted",
      description: "The product has been deleted successfully",
    })
  }

  const bulkDelete = () => {
    if (selectedProducts.length === 0) return

    // In a real app, you would call an API to delete the products
    toast({
      title: `${selectedProducts.length} products deleted`,
      description: "The selected products have been deleted successfully",
    })
    setSelectedProducts([])
  }

  const categories = ["Electronics", "Fashion", "Home & Kitchen", "Sports"]
  const statuses = ["Active", "Low Stock", "Out of Stock"]

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory, prices, and details</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
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
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectedProducts.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{selectedProducts.length} selected</span>
            <Button variant="outline" size="sm" onClick={bulkDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
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
                  checked={paginatedProducts.length > 0 && selectedProducts.length === paginatedProducts.length}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("name")}>
                <div className="flex items-center gap-1">
                  Product
                  {sortField === "name" && <ArrowUpDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("category")}>
                <div className="flex items-center gap-1">
                  Category
                  {sortField === "category" && <ArrowUpDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => toggleSort("price")}>
                <div className="flex items-center justify-end gap-1">
                  Price
                  {sortField === "price" && <ArrowUpDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => toggleSort("stock")}>
                <div className="flex items-center justify-end gap-1">
                  Stock
                  {sortField === "stock" && <ArrowUpDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("status")}>
                <div className="flex items-center gap-1">
                  Status
                  {sortField === "status" && <ArrowUpDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => toggleSelectProduct(product.id)}
                      aria-label={`Select ${product.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">ID: {product.id}</div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{product.stock}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.status === "Active"
                          ? "default"
                          : product.status === "Low Stock"
                            ? "outline"
                            : "destructive"
                      }
                    >
                      {product.status}
                    </Badge>
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
                          <Link href={`/admin/products/${product.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteProduct(product.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
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
            {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="icon"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
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
