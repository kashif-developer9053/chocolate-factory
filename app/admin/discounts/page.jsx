"use client"

import { useState } from "react"
import {
  Search,
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Tag,
  Percent,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"

export default function DiscountsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("createdAt")
  const [sortDirection, setSortDirection] = useState("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentDiscount, setCurrentDiscount] = useState(null)
  const itemsPerPage = 10

  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    value: "",
    minPurchase: "",
    maxUses: "",
    startDate: "",
    endDate: "",
    status: "active",
    products: "all",
  })

  // Mock discounts data
  const allDiscounts = [
    {
      id: 1,
      code: "SUMMER20",
      type: "percentage",
      value: 20,
      minPurchase: 50,
      maxUses: 100,
      usedCount: 45,
      startDate: "2023-06-01",
      endDate: "2023-08-31",
      status: "active",
      products: "all",
      createdAt: "2023-05-15",
    },
    {
      id: 2,
      code: "WELCOME10",
      type: "percentage",
      value: 10,
      minPurchase: 0,
      maxUses: 1000,
      usedCount: 358,
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      status: "active",
      products: "all",
      createdAt: "2023-01-01",
    },
    {
      id: 3,
      code: "FREESHIP",
      type: "fixed",
      value: 10,
      minPurchase: 75,
      maxUses: 500,
      usedCount: 123,
      startDate: "2023-04-01",
      endDate: "2023-06-30",
      status: "active",
      products: "all",
      createdAt: "2023-03-15",
    },
    {
      id: 4,
      code: "FLASH25",
      type: "percentage",
      value: 25,
      minPurchase: 100,
      maxUses: 200,
      usedCount: 200,
      startDate: "2023-04-15",
      endDate: "2023-04-16",
      status: "expired",
      products: "all",
      createdAt: "2023-04-10",
    },
    {
      id: 5,
      code: "TECH15",
      type: "percentage",
      value: 15,
      minPurchase: 0,
      maxUses: 300,
      usedCount: 87,
      startDate: "2023-05-01",
      endDate: "2023-07-31",
      status: "active",
      products: "category",
      createdAt: "2023-04-25",
    },
    {
      id: 6,
      code: "SAVE50",
      type: "fixed",
      value: 50,
      minPurchase: 200,
      maxUses: 100,
      usedCount: 32,
      startDate: "2023-05-10",
      endDate: "2023-05-20",
      status: "expired",
      products: "all",
      createdAt: "2023-05-05",
    },
    {
      id: 7,
      code: "NEWUSER",
      type: "percentage",
      value: 15,
      minPurchase: 0,
      maxUses: 0,
      usedCount: 421,
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      status: "active",
      products: "all",
      createdAt: "2023-01-01",
    },
    {
      id: 8,
      code: "HOLIDAY30",
      type: "percentage",
      value: 30,
      minPurchase: 150,
      maxUses: 500,
      usedCount: 0,
      startDate: "2023-12-01",
      endDate: "2023-12-25",
      status: "scheduled",
      products: "all",
      createdAt: "2023-05-15",
    },
  ]

  // Filter discounts
  const filteredDiscounts = allDiscounts.filter((discount) => {
    // Search filter
    if (searchQuery && !discount.code.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Type filter
    if (typeFilter !== "all" && discount.type !== typeFilter) {
      return false
    }

    // Status filter
    if (statusFilter !== "all" && discount.status !== statusFilter) {
      return false
    }

    return true
  })

  // Sort discounts
  const sortedDiscounts = [...filteredDiscounts].sort((a, b) => {
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
  const totalPages = Math.ceil(sortedDiscounts.length / itemsPerPage)
  const paginatedDiscounts = sortedDiscounts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleRadioChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate form
    if (!formData.code || !formData.value || !formData.startDate || !formData.endDate) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would call an API to save the discount
    setTimeout(() => {
      toast({
        title: isEditing ? "Discount updated" : "Discount created",
        description: `Discount code ${formData.code} has been ${isEditing ? "updated" : "created"} successfully`,
      })
      setIsDialogOpen(false)
      // Reset form after submission
      setFormData({
        code: "",
        type: "percentage",
        value: "",
        minPurchase: "",
        maxUses: "",
        startDate: "",
        endDate: "",
        status: "active",
        products: "all",
      })
      setIsEditing(false)
    }, 500)
  }

  const editDiscount = (discount) => {
    setIsEditing(true)
    setCurrentDiscount(discount)
    setFormData({
      code: discount.code,
      type: discount.type,
      value: discount.value.toString(),
      minPurchase: discount.minPurchase.toString(),
      maxUses: discount.maxUses.toString(),
      startDate: discount.startDate,
      endDate: discount.endDate,
      status: discount.status,
      products: discount.products,
    })
    setIsDialogOpen(true)
  }

  const deleteDiscount = (id) => {
    // In a real app, you would call an API to delete the discount
    toast({
      title: "Discount deleted",
      description: "The discount has been deleted successfully",
    })
  }

  const types = ["percentage", "fixed"]
  const statuses = ["active", "expired", "scheduled"]

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "expired":
        return <Badge variant="outline">Expired</Badge>
      case "scheduled":
        return <Badge variant="secondary">Scheduled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Discounts & Promotions</h1>
          <p className="text-muted-foreground">Manage discount codes, coupons, and special offers</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setIsEditing(false)
                setFormData({
                  code: "",
                  type: "percentage",
                  value: "",
                  minPurchase: "",
                  maxUses: "",
                  startDate: "",
                  endDate: "",
                  status: "active",
                  products: "all",
                })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Discount
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Discount" : "Create New Discount"}</DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Update the discount details below."
                  : "Fill in the details to create a new discount code."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="code" className="text-right">
                    Code
                  </Label>
                  <Input
                    id="code"
                    name="code"
                    placeholder="SUMMER20"
                    className="col-span-3"
                    value={formData.code}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Type</Label>
                  <RadioGroup
                    className="col-span-3 flex gap-4"
                    value={formData.type}
                    onValueChange={(value) => handleRadioChange("type", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="percentage" id="percentage" />
                      <Label htmlFor="percentage" className="font-normal">
                        Percentage
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fixed" id="fixed" />
                      <Label htmlFor="fixed" className="font-normal">
                        Fixed Amount
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="value" className="text-right">
                    {formData.type === "percentage" ? "Percentage" : "Amount"}
                  </Label>
                  <div className="col-span-3 relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">
                      {formData.type === "percentage" ? "%" : "$"}
                    </span>
                    <Input
                      id="value"
                      name="value"
                      type="number"
                      min="0"
                      step={formData.type === "percentage" ? "1" : "0.01"}
                      max={formData.type === "percentage" ? "100" : undefined}
                      placeholder={formData.type === "percentage" ? "20" : "10.00"}
                      className="pl-7"
                      value={formData.value}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="minPurchase" className="text-right">
                    Min. Purchase
                  </Label>
                  <div className="col-span-3 relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                    <Input
                      id="minPurchase"
                      name="minPurchase"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-7"
                      value={formData.minPurchase}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="maxUses" className="text-right">
                    Usage Limit
                  </Label>
                  <Input
                    id="maxUses"
                    name="maxUses"
                    type="number"
                    min="0"
                    placeholder="No limit"
                    className="col-span-3"
                    value={formData.maxUses}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startDate" className="text-right">
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    className="col-span-3"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endDate" className="text-right">
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    className="col-span-3"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Status</Label>
                  <RadioGroup
                    className="col-span-3 flex gap-4"
                    value={formData.status}
                    onValueChange={(value) => handleRadioChange("status", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="active" id="active" />
                      <Label htmlFor="active" className="font-normal">
                        Active
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="scheduled" id="scheduled" />
                      <Label htmlFor="scheduled" className="font-normal">
                        Scheduled
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Applies To</Label>
                  <RadioGroup
                    className="col-span-3 flex flex-col gap-2"
                    value={formData.products}
                    onValueChange={(value) => handleRadioChange("products", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all-products" />
                      <Label htmlFor="all-products" className="font-normal">
                        All Products
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="category" id="specific-category" />
                      <Label htmlFor="specific-category" className="font-normal">
                        Specific Categories
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="products" id="specific-products" />
                      <Label htmlFor="specific-products" className="font-normal">
                        Specific Products
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{isEditing ? "Update" : "Create"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search discounts..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>
          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === "percentage" ? "Percentage" : "Fixed Amount"}
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
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("code")}>
                <div className="flex items-center gap-1">
                  Code
                  {sortField === "code" && <ArrowUpDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("type")}>
                <div className="flex items-center gap-1">
                  Type
                  {sortField === "type" && <ArrowUpDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("value")}>
                <div className="flex items-center gap-1">
                  Value
                  {sortField === "value" && <ArrowUpDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("status")}>
                <div className="flex items-center gap-1">
                  Status
                  {sortField === "status" && <ArrowUpDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("usedCount")}>
                <div className="flex items-center gap-1">
                  Used
                  {sortField === "usedCount" && <ArrowUpDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("endDate")}>
                <div className="flex items-center gap-1">
                  Expires
                  {sortField === "endDate" && <ArrowUpDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedDiscounts.length > 0 ? (
              paginatedDiscounts.map((discount) => (
                <TableRow key={discount.id}>
                  <TableCell>
                    <div className="font-medium">{discount.code}</div>
                    <div className="text-xs text-muted-foreground">
                      Min. purchase: ${discount.minPurchase.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {discount.type === "percentage" ? (
                        <Percent className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Tag className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{discount.type === "percentage" ? "Percentage" : "Fixed Amount"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {discount.type === "percentage" ? `${discount.value}%` : `$${discount.value.toFixed(2)}`}
                  </TableCell>
                  <TableCell>{getStatusBadge(discount.status)}</TableCell>
                  <TableCell>
                    {discount.usedCount} / {discount.maxUses > 0 ? discount.maxUses : "∞"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{discount.endDate}</span>
                    </div>
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
                        <DropdownMenuItem onClick={() => editDiscount(discount)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteDiscount(discount.id)}
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
                  No discounts found.
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
            {Math.min(currentPage * itemsPerPage, filteredDiscounts.length)} of {filteredDiscounts.length} discounts
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
