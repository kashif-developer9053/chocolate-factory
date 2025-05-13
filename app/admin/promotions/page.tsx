"use client"

import { useState } from "react"
import {
  Search,
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Tag,
  Copy,
  ShoppingBag,
  Percent,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"

export default function PromotionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("startDate")
  const [sortDirection, setSortDirection] = useState("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentPromotion, setCurrentPromotion] = useState(null)
  const [activeTab, setActiveTab] = useState("active")
  const itemsPerPage = 10

  const [formData, setFormData] = useState({
    name: "",
    type: "percentage",
    discount: "",
    startDate: "",
    endDate: "",
    status: "active",
    products: "all",
    categories: [],
    minPurchase: "",
    description: "",
    customerGroups: "all",
    featured: false,
    showOnHomepage: false,
  })

  // Mock promotions data
  const allPromotions = [
    {
      id: 1,
      name: "Summer Chocolate Festival",
      status: "active",
      startDate: "2023-06-01",
      endDate: "2023-08-31",
      type: "percentage",
      discount: "20%",
      discountValue: 20,
      products: 24,
      revenue: 4250.75,
      orders: 87,
      description: "Summer chocolate festival with special discounts on seasonal flavors",
      createdAt: "2023-05-15",
      featured: true,
      showOnHomepage: true,
    },
    {
      id: 2,
      name: "Buy 2 Get 1 Free Truffles",
      status: "active",
      startDate: "2023-07-01",
      endDate: "2023-07-31",
      type: "bogo",
      discount: "Buy 2 Get 1",
      discountValue: 33,
      products: 12,
      revenue: 2180.5,
      orders: 45,
      description: "Buy two boxes of truffles and get one free",
      createdAt: "2023-06-15",
      featured: true,
      showOnHomepage: false,
    },
    {
      id: 3,
      name: "Valentine's Day Special",
      status: "scheduled",
      startDate: "2024-02-01",
      endDate: "2024-02-14",
      type: "percentage",
      discount: "15%",
      discountValue: 15,
      products: 18,
      revenue: 0,
      orders: 0,
      description: "Special discounts on Valentine's Day chocolate collections",
      createdAt: "2023-06-20",
      featured: false,
      showOnHomepage: false,
    },
    {
      id: 4,
      name: "Chocolate Gift Box Bundle",
      status: "active",
      startDate: "2023-06-15",
      endDate: "2023-09-15",
      type: "bundle",
      discount: "25%",
      discountValue: 25,
      products: 5,
      revenue: 3750.25,
      orders: 62,
      description: "Bundle discount on gift boxes with assorted chocolates",
      createdAt: "2023-06-10",
      featured: true,
      showOnHomepage: true,
    },
    {
      id: 5,
      name: "Flash Sale: Dark Chocolate",
      status: "expired",
      startDate: "2023-05-01",
      endDate: "2023-05-03",
      type: "percentage",
      discount: "40%",
      discountValue: 40,
      products: 8,
      revenue: 1850.75,
      orders: 32,
      description: "48-hour flash sale on all dark chocolate products",
      createdAt: "2023-04-25",
      featured: false,
      showOnHomepage: true,
    },
    {
      id: 6,
      name: "Holiday Gift Sets",
      status: "scheduled",
      startDate: "2023-11-15",
      endDate: "2023-12-31",
      type: "percentage",
      discount: "15%",
      discountValue: 15,
      products: 15,
      revenue: 0,
      orders: 0,
      description: "Special holiday gift sets with premium chocolates",
      createdAt: "2023-06-25",
      featured: false,
      showOnHomepage: false,
    },
    {
      id: 7,
      name: "Chocolate of the Month Club",
      status: "active",
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      type: "subscription",
      discount: "10%",
      discountValue: 10,
      products: 30,
      revenue: 8750.5,
      orders: 125,
      description: "Subscribe to our monthly chocolate box and save 10%",
      createdAt: "2023-01-01",
      featured: true,
      showOnHomepage: true,
    },
    {
      id: 8,
      name: "Back to School Treats",
      status: "scheduled",
      startDate: "2023-08-15",
      endDate: "2023-09-15",
      type: "percentage",
      discount: "15%",
      discountValue: 15,
      products: 12,
      revenue: 0,
      orders: 0,
      description: "Special treats for back to school season",
      createdAt: "2023-06-30",
      featured: false,
      showOnHomepage: false,
    },
  ]

  // Filter promotions
  const filteredPromotions = allPromotions.filter((promotion) => {
    // Search filter
    if (searchQuery && !promotion.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Type filter
    if (typeFilter !== "all" && promotion.type !== typeFilter) {
      return false
    }

    // Status filter
    if (statusFilter !== "all" && promotion.status !== statusFilter) {
      return false
    }

    // Tab filter
    if (activeTab === "active" && promotion.status !== "active") {
      return false
    }
    if (activeTab === "scheduled" && promotion.status !== "scheduled") {
      return false
    }
    if (activeTab === "expired" && promotion.status !== "expired") {
      return false
    }

    return true
  })

  // Sort promotions
  const sortedPromotions = [...filteredPromotions].sort((a, b) => {
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
  const totalPages = Math.ceil(sortedPromotions.length / itemsPerPage)
  const paginatedPromotions = sortedPromotions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

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
    if (!formData.name || !formData.discount || !formData.startDate || !formData.endDate) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would call an API to save the promotion
    setTimeout(() => {
      toast({
        title: isEditing ? "Promotion updated" : "Promotion created",
        description: `Promotion "${formData.name}" has been ${isEditing ? "updated" : "created"} successfully`,
      })
      setIsDialogOpen(false)
      // Reset form after submission
      setFormData({
        name: "",
        type: "percentage",
        discount: "",
        startDate: "",
        endDate: "",
        status: "active",
        products: "all",
        categories: [],
        minPurchase: "",
        description: "",
        customerGroups: "all",
        featured: false,
        showOnHomepage: false,
      })
      setIsEditing(false)
    }, 500)
  }

  const editPromotion = (promotion) => {
    setIsEditing(true)
    setCurrentPromotion(promotion)
    setFormData({
      name: promotion.name,
      type: promotion.type,
      discount: promotion.discountValue.toString(),
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      status: promotion.status,
      products: "all",
      categories: [],
      minPurchase: "",
      description: promotion.description,
      customerGroups: "all",
      featured: promotion.featured,
      showOnHomepage: promotion.showOnHomepage,
    })
    setIsDialogOpen(true)
  }

  const deletePromotion = (id) => {
    // In a real app, you would call an API to delete the promotion
    toast({
      title: "Promotion deleted",
      description: "The promotion has been deleted successfully",
    })
  }

  const duplicatePromotion = (promotion) => {
    setFormData({
      name: `Copy of ${promotion.name}`,
      type: promotion.type,
      discount: promotion.discountValue.toString(),
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      status: "scheduled",
      products: "all",
      categories: [],
      minPurchase: "",
      description: promotion.description,
      customerGroups: "all",
      featured: promotion.featured,
      showOnHomepage: promotion.showOnHomepage,
    })
    setIsDialogOpen(true)
  }

  const types = ["percentage", "fixed", "bogo", "bundle", "subscription", "flash"]
  const statuses = ["active", "scheduled", "expired"]
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

  const getPromotionTypeBadge = (type) => {
    switch (type) {
      case "percentage":
        return <Badge className="bg-blue-500">Percentage</Badge>
      case "fixed":
        return <Badge className="bg-indigo-500">Fixed Amount</Badge>
      case "bogo":
        return <Badge className="bg-purple-500">BOGO</Badge>
      case "bundle":
        return <Badge className="bg-amber-500">Bundle</Badge>
      case "subscription":
        return <Badge className="bg-teal-500">Subscription</Badge>
      case "flash":
        return <Badge className="bg-rose-500">Flash Sale</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  // Calculate promotion stats
  const activePromotions = allPromotions.filter((p) => p.status === "active").length
  const scheduledPromotions = allPromotions.filter((p) => p.status === "scheduled").length
  const expiredPromotions = allPromotions.filter((p) => p.status === "expired").length
  const totalRevenue = allPromotions.reduce((sum, p) => sum + p.revenue, 0)
  const totalOrders = allPromotions.reduce((sum, p) => sum + p.orders, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Promotions</h1>
          <p className="text-muted-foreground">Manage sales, discounts, and promotional campaigns</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Promotions</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePromotions}</div>
            <p className="text-xs text-muted-foreground">
              {activePromotions > 0
                ? `${((activePromotions / allPromotions.length) * 100).toFixed(0)}% of all promotions`
                : "No active promotions"}
            </p>
            <Progress className="mt-2" value={(activePromotions / allPromotions.length) * 100} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Promotions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledPromotions}</div>
            <p className="text-xs text-muted-foreground">
              {scheduledPromotions > 0
                ? `${((scheduledPromotions / allPromotions.length) * 100).toFixed(0)}% of all promotions`
                : "No scheduled promotions"}
            </p>
            <Progress className="mt-2" value={(scheduledPromotions / allPromotions.length) * 100} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promotion Revenue</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From {totalOrders} orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalOrders > 0 ? `${totalOrders} orders with promotions` : "No orders with promotions"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active ({activePromotions})</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled ({scheduledPromotions})</TabsTrigger>
          <TabsTrigger value="expired">Expired ({expiredPromotions})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search promotions..."
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
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                  <SelectItem value="bogo">BOGO</SelectItem>
                  <SelectItem value="bundle">Bundle</SelectItem>
                  <SelectItem value="subscription">Subscription</SelectItem>
                  <SelectItem value="flash">Flash Sale</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setIsEditing(false)
                    setFormData({
                      name: "",
                      type: "percentage",
                      discount: "",
                      startDate: "",
                      endDate: "",
                      status: "active",
                      products: "all",
                      categories: [],
                      minPurchase: "",
                      description: "",
                      customerGroups: "all",
                      featured: false,
                      showOnHomepage: false,
                    })
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Promotion
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[650px]">
                <DialogHeader>
                  <DialogTitle>{isEditing ? "Edit Promotion" : "Create New Promotion"}</DialogTitle>
                  <DialogDescription>
                    {isEditing
                      ? "Update the promotion details below."
                      : "Fill in the details to create a new promotion."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="general">General</TabsTrigger>
                      <TabsTrigger value="restrictions">Restrictions</TabsTrigger>
                      <TabsTrigger value="display">Display</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Summer Sale"
                          className="col-span-3"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Promotion description"
                          className="col-span-3"
                          value={formData.description}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Promotion Type</Label>
                        <Select value={formData.type} onValueChange={(value) => handleRadioChange("type", value)}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select promotion type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">Percentage Discount</SelectItem>
                            <SelectItem value="fixed">Fixed Amount</SelectItem>
                            <SelectItem value="bogo">Buy One Get One</SelectItem>
                            <SelectItem value="bundle">Bundle Discount</SelectItem>
                            <SelectItem value="subscription">Subscription</SelectItem>
                            <SelectItem value="flash">Flash Sale</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="discount" className="text-right">
                          {formData.type === "percentage"
                            ? "Percentage"
                            : formData.type === "fixed"
                              ? "Amount"
                              : "Discount Value"}
                        </Label>
                        <div className="col-span-3 relative">
                          <span className="absolute left-3 top-2.5 text-muted-foreground">
                            {formData.type === "percentage" ? "%" : formData.type === "fixed" ? "$" : ""}
                          </span>
                          <Input
                            id="discount"
                            name="discount"
                            type="number"
                            min="0"
                            step={formData.type === "percentage" ? "1" : "0.01"}
                            max={formData.type === "percentage" ? "100" : undefined}
                            placeholder={formData.type === "percentage" ? "20" : "10.00"}
                            className={formData.type === "percentage" || formData.type === "fixed" ? "pl-7" : ""}
                            value={formData.discount}
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
                            <RadioGroupItem value="active" id="active-status" />
                            <Label htmlFor="active-status" className="font-normal">
                              Active
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="scheduled" id="scheduled-status" />
                            <Label htmlFor="scheduled-status" className="font-normal">
                              Scheduled
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </TabsContent>

                    <TabsContent value="restrictions" className="space-y-4 py-4">
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
                    </TabsContent>

                    <TabsContent value="display" className="space-y-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Featured Promotion</Label>
                        <div className="col-span-3 flex items-center space-x-2">
                          <Switch
                            id="featured"
                            checked={formData.featured}
                            onCheckedChange={(checked) => handleCheckboxChange("featured", checked)}
                          />
                          <Label htmlFor="featured" className="font-normal">
                            Mark as featured promotion
                          </Label>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Homepage Display</Label>
                        <div className="col-span-3 flex items-center space-x-2">
                          <Switch
                            id="showOnHomepage"
                            checked={formData.showOnHomepage}
                            onCheckedChange={(checked) => handleCheckboxChange("showOnHomepage", checked)}
                          />
                          <Label htmlFor="showOnHomepage" className="font-normal">
                            Show on homepage banner
                          </Label>
                        </div>
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
                  <TableHead className="cursor-pointer" onClick={() => toggleSort("name")}>
                    <div className="flex items-center gap-1">
                      Name
                      {sortField === "name" && <ArrowUpDown className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => toggleSort("type")}>
                    <div className="flex items-center gap-1">
                      Type
                      {sortField === "type" && <ArrowUpDown className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => toggleSort("discountValue")}>
                    <div className="flex items-center gap-1">
                      Discount
                      {sortField === "discountValue" && <ArrowUpDown className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => toggleSort("startDate")}>
                    <div className="flex items-center gap-1">
                      Period
                      {sortField === "startDate" && <ArrowUpDown className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => toggleSort("revenue")}>
                    <div className="flex items-center gap-1">
                      Revenue
                      {sortField === "revenue" && <ArrowUpDown className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPromotions.length > 0 ? (
                  paginatedPromotions.map((promotion) => (
                    <TableRow key={promotion.id}>
                      <TableCell>
                        <div className="font-medium">{promotion.name}</div>
                        <div className="text-xs text-muted-foreground">{promotion.description}</div>
                      </TableCell>
                      <TableCell>{getPromotionTypeBadge(promotion.type)}</TableCell>
                      <TableCell>{promotion.discount}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs">
                            {promotion.startDate} - {promotion.endDate}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">${promotion.revenue.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">{promotion.orders} orders</div>
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
                            <DropdownMenuItem onClick={() => editPromotion(promotion)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => duplicatePromotion(promotion)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => deletePromotion(promotion.id)}
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
                    <TableCell colSpan={6} className="h-24 text-center">
                      No promotions found.
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
                {Math.min(currentPage * itemsPerPage, filteredPromotions.length)} of {filteredPromotions.length}{" "}
                promotions
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
      </Tabs>
    </div>
  )
}
