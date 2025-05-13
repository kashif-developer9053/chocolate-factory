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
  Calendar,
  Copy,
  CheckCircle,
  Layers,
  Percent,
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
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export default function CouponsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("createdAt")
  const [sortDirection, setSortDirection] = useState("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentCoupon, setCurrentCoupon] = useState(null)
  const [activeTab, setActiveTab] = useState("coupons")
  const [copiedCode, setCopiedCode] = useState("")
  const itemsPerPage = 10

  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    value: "",
    minPurchase: "",
    maxUses: "",
    usesPerCustomer: "1",
    startDate: "",
    endDate: "",
    status: "active",
    products: "all",
    categories: [],
    excludeSaleItems: false,
    individualUse: true,
    description: "",
    emailRestrictions: "",
    customerGroups: "all",
  })

  // Mock coupon data
  const allCoupons = [
    {
      id: 1,
      code: "CHOCO25",
      type: "percentage",
      value: 25,
      minPurchase: 50,
      maxUses: 100,
      usesPerCustomer: 1,
      usedCount: 45,
      startDate: "2023-06-01",
      endDate: "2023-08-31",
      status: "active",
      products: "all",
      excludeSaleItems: true,
      individualUse: true,
      description: "25% off all chocolate products",
      createdAt: "2023-05-15",
    },
    {
      id: 2,
      code: "TRUFFLE10",
      type: "percentage",
      value: 10,
      minPurchase: 0,
      maxUses: 1000,
      usesPerCustomer: 1,
      usedCount: 358,
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      status: "active",
      products: "category",
      excludeSaleItems: false,
      individualUse: false,
      description: "10% off all truffle products",
      createdAt: "2023-01-01",
    },
    {
      id: 3,
      code: "FREESHIP",
      type: "fixed",
      value: 10,
      minPurchase: 75,
      maxUses: 500,
      usesPerCustomer: 0,
      usedCount: 123,
      startDate: "2023-04-01",
      endDate: "2023-06-30",
      status: "active",
      products: "all",
      excludeSaleItems: false,
      individualUse: true,
      description: "Free shipping on orders over $75",
      createdAt: "2023-03-15",
    },
    {
      id: 4,
      code: "DARKCHOC",
      type: "percentage",
      value: 15,
      minPurchase: 30,
      maxUses: 200,
      usesPerCustomer: 1,
      usedCount: 200,
      startDate: "2023-04-15",
      endDate: "2023-04-16",
      status: "expired",
      products: "category",
      excludeSaleItems: true,
      individualUse: true,
      description: "15% off dark chocolate products",
      createdAt: "2023-04-10",
    },
    {
      id: 5,
      code: "GIFT15",
      type: "percentage",
      value: 15,
      minPurchase: 0,
      maxUses: 300,
      usesPerCustomer: 1,
      usedCount: 87,
      startDate: "2023-05-01",
      endDate: "2023-07-31",
      status: "active",
      products: "category",
      excludeSaleItems: false,
      individualUse: false,
      description: "15% off gift boxes",
      createdAt: "2023-04-25",
    },
    {
      id: 6,
      code: "SAVE20",
      type: "fixed",
      value: 20,
      minPurchase: 100,
      maxUses: 100,
      usesPerCustomer: 1,
      usedCount: 32,
      startDate: "2023-05-10",
      endDate: "2023-05-20",
      status: "expired",
      products: "all",
      excludeSaleItems: true,
      individualUse: true,
      description: "$20 off orders over $100",
      createdAt: "2023-05-05",
    },
    {
      id: 7,
      code: "WELCOME15",
      type: "percentage",
      value: 15,
      minPurchase: 0,
      maxUses: 0,
      usesPerCustomer: 1,
      usedCount: 421,
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      status: "active",
      products: "all",
      excludeSaleItems: false,
      individualUse: true,
      description: "15% off for new customers",
      createdAt: "2023-01-01",
    },
    {
      id: 8,
      code: "HOLIDAY30",
      type: "percentage",
      value: 30,
      minPurchase: 150,
      maxUses: 500,
      usesPerCustomer: 1,
      usedCount: 0,
      startDate: "2023-12-01",
      endDate: "2023-12-25",
      status: "scheduled",
      products: "all",
      excludeSaleItems: false,
      individualUse: true,
      description: "30% off holiday chocolate collections",
      createdAt: "2023-05-15",
    },
  ]

  // Mock promotional campaigns
  const promotionalCampaigns = [
    {
      id: 1,
      name: "Summer Chocolate Festival",
      status: "active",
      startDate: "2023-06-01",
      endDate: "2023-08-31",
      type: "sale",
      discount: "20%",
      products: 24,
      description: "Summer chocolate festival with special discounts on seasonal flavors",
      createdAt: "2023-05-15",
    },
    {
      id: 2,
      name: "Buy 2 Get 1 Free Truffles",
      status: "active",
      startDate: "2023-07-01",
      endDate: "2023-07-31",
      type: "bogo",
      discount: "Buy 2 Get 1",
      products: 12,
      description: "Buy two boxes of truffles and get one free",
      createdAt: "2023-06-15",
    },
    {
      id: 3,
      name: "Valentine's Day Special",
      status: "scheduled",
      startDate: "2024-02-01",
      endDate: "2024-02-14",
      type: "sale",
      discount: "15%",
      products: 18,
      description: "Special discounts on Valentine's Day chocolate collections",
      createdAt: "2023-06-20",
    },
    {
      id: 4,
      name: "Chocolate Gift Box Bundle",
      status: "active",
      startDate: "2023-06-15",
      endDate: "2023-09-15",
      type: "bundle",
      discount: "25%",
      products: 5,
      description: "Bundle discount on gift boxes with assorted chocolates",
      createdAt: "2023-06-10",
    },
    {
      id: 5,
      name: "Flash Sale: Dark Chocolate",
      status: "expired",
      startDate: "2023-05-01",
      endDate: "2023-05-03",
      type: "flash",
      discount: "40%",
      products: 8,
      description: "48-hour flash sale on all dark chocolate products",
      createdAt: "2023-04-25",
    },
  ]

  // Filter coupons
  const filteredCoupons = allCoupons.filter((coupon) => {
    // Search filter
    if (searchQuery && !coupon.code.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Type filter
    if (typeFilter !== "all" && coupon.type !== typeFilter) {
      return false
    }

    // Status filter
    if (statusFilter !== "all" && coupon.status !== statusFilter) {
      return false
    }

    return true
  })

  // Sort coupons
  const sortedCoupons = [...filteredCoupons].sort((a, b) => {
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
  const totalPages = Math.ceil(sortedCoupons.length / itemsPerPage)
  const paginatedCoupons = sortedCoupons.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

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

  const handleCheckboxChange = (name, checked) => {
    setFormData({
      ...formData,
      [name]: checked,
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

    // In a real app, you would call an API to save the coupon
    setTimeout(() => {
      toast({
        title: isEditing ? "Coupon updated" : "Coupon created",
        description: `Coupon code ${formData.code} has been ${isEditing ? "updated" : "created"} successfully`,
      })
      setIsDialogOpen(false)
      // Reset form after submission
      setFormData({
        code: "",
        type: "percentage",
        value: "",
        minPurchase: "",
        maxUses: "",
        usesPerCustomer: "1",
        startDate: "",
        endDate: "",
        status: "active",
        products: "all",
        categories: [],
        excludeSaleItems: false,
        individualUse: true,
        description: "",
        emailRestrictions: "",
        customerGroups: "all",
      })
      setIsEditing(false)
    }, 500)
  }

  const editCoupon = (coupon) => {
    setIsEditing(true)
    setCurrentCoupon(coupon)
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value.toString(),
      minPurchase: coupon.minPurchase.toString(),
      maxUses: coupon.maxUses.toString(),
      usesPerCustomer: coupon.usesPerCustomer.toString(),
      startDate: coupon.startDate,
      endDate: coupon.endDate,
      status: coupon.status,
      products: coupon.products,
      excludeSaleItems: coupon.excludeSaleItems,
      individualUse: coupon.individualUse,
      description: coupon.description,
      emailRestrictions: "",
      customerGroups: "all",
    })
    setIsDialogOpen(true)
  }

  const deleteCoupon = (id) => {
    // In a real app, you would call an API to delete the coupon
    toast({
      title: "Coupon deleted",
      description: "The coupon has been deleted successfully",
    })
  }

  const copyCouponCode = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast({
      title: "Copied to clipboard",
      description: `Coupon code ${code} has been copied to clipboard`,
    })
    setTimeout(() => setCopiedCode(""), 2000)
  }

  const generateRandomCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    setFormData({
      ...formData,
      code: result,
    })
  }

  const types = ["percentage", "fixed"]
  const statuses = ["active", "expired", "scheduled"]
  const categories = [
    { id: "dark-chocolate", name: "Dark Chocolate" },
    { id: "milk-chocolate", name: "Milk Chocolate" },
    { id: "white-chocolate", name: "White Chocolate" },
    { id: "truffles", name: "Truffles" },
    { id: "gift-boxes", name: "Gift Boxes" },
    { id: "seasonal", name: "Seasonal" },
    { id: "vegan", name: "Vegan" },
    { id: "sugar-free", name: "Sugar Free" },
  ]
  const customerGroups = [
    { id: "all", name: "All Customers" },
    { id: "new", name: "New Customers" },
    { id: "returning", name: "Returning Customers" },
    { id: "vip", name: "VIP Customers" },
  ]

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

  const getCampaignTypeBadge = (type) => {
    switch (type) {
      case "sale":
        return <Badge className="bg-blue-500">Sale</Badge>
      case "bogo":
        return <Badge className="bg-purple-500">BOGO</Badge>
      case "bundle":
        return <Badge className="bg-amber-500">Bundle</Badge>
      case "flash":
        return <Badge className="bg-rose-500">Flash Sale</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coupons & Promotions</h1>
          <p className="text-muted-foreground">Manage coupon codes, discounts, and promotional campaigns</p>
        </div>
      </div>

      <Tabs defaultValue="coupons" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="coupons">Coupon Codes</TabsTrigger>
          <TabsTrigger value="promotions">Promotional Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="coupons" className="space-y-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search coupons..."
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
                      usesPerCustomer: "1",
                      startDate: "",
                      endDate: "",
                      status: "active",
                      products: "all",
                      categories: [],
                      excludeSaleItems: false,
                      individualUse: true,
                      description: "",
                      emailRestrictions: "",
                      customerGroups: "all",
                    })
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Coupon
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[650px]">
                <DialogHeader>
                  <DialogTitle>{isEditing ? "Edit Coupon" : "Create New Coupon"}</DialogTitle>
                  <DialogDescription>
                    {isEditing
                      ? "Update the coupon details below."
                      : "Fill in the details to create a new coupon code."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="general">General</TabsTrigger>
                      <TabsTrigger value="usage">Usage Restrictions</TabsTrigger>
                      <TabsTrigger value="limits">Limits</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="code" className="text-right">
                          Code
                        </Label>
                        <div className="col-span-3 flex gap-2">
                          <Input
                            id="code"
                            name="code"
                            placeholder="SUMMER20"
                            className="flex-1"
                            value={formData.code}
                            onChange={handleChange}
                            required
                          />
                          <Button type="button" variant="outline" onClick={generateRandomCode}>
                            Generate
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Coupon description for internal use"
                          className="col-span-3"
                          value={formData.description}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Discount Type</Label>
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
                    </TabsContent>

                    <TabsContent value="usage" className="space-y-4 py-4">
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

                      {formData.products === "category" && (
                        <div className="grid grid-cols-4 items-start gap-4">
                          <Label className="text-right pt-2">Categories</Label>
                          <div className="col-span-3 grid grid-cols-2 gap-2">
                            {categories.map((category) => (
                              <div key={category.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`category-${category.id}`}
                                  checked={formData.categories.includes(category.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setFormData({
                                        ...formData,
                                        categories: [...formData.categories, category.id],
                                      })
                                    } else {
                                      setFormData({
                                        ...formData,
                                        categories: formData.categories.filter((id) => id !== category.id),
                                      })
                                    }
                                  }}
                                />
                                <Label htmlFor={`category-${category.id}`} className="font-normal">
                                  {category.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Customer Groups</Label>
                        <Select
                          value={formData.customerGroups}
                          onValueChange={(value) => handleRadioChange("customerGroups", value)}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select customer group" />
                          </SelectTrigger>
                          <SelectContent>
                            {customerGroups.map((group) => (
                              <SelectItem key={group.id} value={group.id}>
                                {group.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="emailRestrictions" className="text-right">
                          Email Restrictions
                        </Label>
                        <Textarea
                          id="emailRestrictions"
                          name="emailRestrictions"
                          placeholder="Enter email domains or addresses (one per line)"
                          className="col-span-3"
                          value={formData.emailRestrictions}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Exclude Sale Items</Label>
                        <div className="col-span-3 flex items-center space-x-2">
                          <Switch
                            id="excludeSaleItems"
                            checked={formData.excludeSaleItems}
                            onCheckedChange={(checked) => handleCheckboxChange("excludeSaleItems", checked)}
                          />
                          <Label htmlFor="excludeSaleItems" className="font-normal">
                            Don't apply this coupon to products on sale
                          </Label>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Individual Use</Label>
                        <div className="col-span-3 flex items-center space-x-2">
                          <Switch
                            id="individualUse"
                            checked={formData.individualUse}
                            onCheckedChange={(checked) => handleCheckboxChange("individualUse", checked)}
                          />
                          <Label htmlFor="individualUse" className="font-normal">
                            Cannot be used with other coupons
                          </Label>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="limits" className="space-y-4 py-4">
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
                        <Label htmlFor="usesPerCustomer" className="text-right">
                          Limit Per Customer
                        </Label>
                        <Input
                          id="usesPerCustomer"
                          name="usesPerCustomer"
                          type="number"
                          min="0"
                          placeholder="1"
                          className="col-span-3"
                          value={formData.usesPerCustomer}
                          onChange={handleChange}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>

                  <DialogFooter className="mt-6">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">{isEditing ? "Update" : "Create"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
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
                {paginatedCoupons.length > 0 ? (
                  paginatedCoupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="font-medium">{coupon.code}</div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyCouponCode(coupon.code)}
                          >
                            {copiedCode === coupon.code ? (
                              <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                            ) : (
                              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                            )}
                            <span className="sr-only">Copy code</span>
                          </Button>
                        </div>
                        <div className="text-xs text-muted-foreground">{coupon.description}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {coupon.type === "percentage" ? (
                            <Percent className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Tag className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span>{coupon.type === "percentage" ? "Percentage" : "Fixed Amount"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {coupon.type === "percentage" ? `${coupon.value}%` : `$${coupon.value.toFixed(2)}`}
                      </TableCell>
                      <TableCell>{getStatusBadge(coupon.status)}</TableCell>
                      <TableCell>
                        {coupon.usedCount} / {coupon.maxUses > 0 ? coupon.maxUses : "∞"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{coupon.endDate}</span>
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
                            <DropdownMenuItem onClick={() => copyCouponCode(coupon.code)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy Code
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => editCoupon(coupon)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => deleteCoupon(coupon.id)}
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
                      No coupons found.
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
                {Math.min(currentPage * itemsPerPage, filteredCoupons.length)} of {filteredCoupons.length} coupons
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
        </TabsContent>

        <TabsContent value="promotions" className="space-y-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search promotions..." className="pl-8" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="bogo">BOGO</SelectItem>
                  <SelectItem value="bundle">Bundle</SelectItem>
                  <SelectItem value="flash">Flash Sale</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Promotion
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {promotionalCampaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
                      <CardDescription className="mt-1">{campaign.description}</CardDescription>
                    </div>
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
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {campaign.startDate} - {campaign.endDate}
                        </span>
                      </div>
                      {getStatusBadge(campaign.status)}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{campaign.discount} discount</span>
                      </div>
                      {getCampaignTypeBadge(campaign.type)}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{campaign.products} products</span>
                      </div>
                      <Button variant="outline" size="sm">
                        View Products
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
