"use client"

import { useState } from "react"
import {
  Search,
  Download,
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingBag,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

// Mock customer data
const customers = [
  {
    id: "CUST-001",
    name: "Emma Johnson",
    email: "emma.johnson@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Maple Street, Portland, OR 97201",
    status: "active",
    totalSpent: 1245.67,
    orders: 12,
    lastOrder: "2023-05-15",
    joinDate: "2022-11-03",
    avatar: "/placeholder.svg?height=40&width=40",
    tags: ["loyal", "newsletter"],
  },
  {
    id: "CUST-002",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    phone: "+1 (555) 987-6543",
    address: "456 Oak Avenue, Seattle, WA 98101",
    status: "active",
    totalSpent: 879.25,
    orders: 8,
    lastOrder: "2023-05-02",
    joinDate: "2023-01-15",
    avatar: "/placeholder.svg?height=40&width=40",
    tags: ["new"],
  },
  {
    id: "CUST-003",
    name: "Sophia Rodriguez",
    email: "sophia.r@example.com",
    phone: "+1 (555) 234-5678",
    address: "789 Pine Lane, San Francisco, CA 94102",
    status: "inactive",
    totalSpent: 2567.89,
    orders: 21,
    lastOrder: "2023-03-20",
    joinDate: "2022-06-12",
    avatar: "/placeholder.svg?height=40&width=40",
    tags: ["loyal", "wholesale"],
  },
  {
    id: "CUST-004",
    name: "James Wilson",
    email: "james.wilson@example.com",
    phone: "+1 (555) 876-5432",
    address: "101 Cedar Road, Austin, TX 78701",
    status: "active",
    totalSpent: 456.78,
    orders: 5,
    lastOrder: "2023-05-10",
    joinDate: "2023-02-28",
    avatar: "/placeholder.svg?height=40&width=40",
    tags: ["new", "newsletter"],
  },
  {
    id: "CUST-005",
    name: "Olivia Kim",
    email: "olivia.kim@example.com",
    phone: "+1 (555) 345-6789",
    address: "202 Birch Blvd, Chicago, IL 60601",
    status: "active",
    totalSpent: 3421.56,
    orders: 28,
    lastOrder: "2023-05-18",
    joinDate: "2022-04-05",
    avatar: "/placeholder.svg?height=40&width=40",
    tags: ["loyal", "wholesale", "newsletter"],
  },
  {
    id: "CUST-006",
    name: "William Davis",
    email: "william.d@example.com",
    phone: "+1 (555) 765-4321",
    address: "303 Spruce Street, Denver, CO 80201",
    status: "inactive",
    totalSpent: 125.45,
    orders: 2,
    lastOrder: "2023-01-05",
    joinDate: "2022-12-20",
    avatar: "/placeholder.svg?height=40&width=40",
    tags: [],
  },
  {
    id: "CUST-007",
    name: "Ava Martinez",
    email: "ava.martinez@example.com",
    phone: "+1 (555) 456-7890",
    address: "404 Redwood Court, Miami, FL 33101",
    status: "active",
    totalSpent: 1876.23,
    orders: 15,
    lastOrder: "2023-05-12",
    joinDate: "2022-08-17",
    avatar: "/placeholder.svg?height=40&width=40",
    tags: ["loyal", "newsletter"],
  },
  {
    id: "CUST-008",
    name: "Ethan Thompson",
    email: "ethan.t@example.com",
    phone: "+1 (555) 654-3210",
    address: "505 Walnut Drive, Boston, MA 02201",
    status: "active",
    totalSpent: 934.12,
    orders: 9,
    lastOrder: "2023-04-28",
    joinDate: "2022-10-09",
    avatar: "/placeholder.svg?height=40&width=40",
    tags: ["newsletter"],
  },
]

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [tagFilter, setTagFilter] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  // Filter customers based on search term, status, and tag
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || customer.status === statusFilter

    const matchesTag =
      tagFilter === "all" || (tagFilter === "none" && customer.tags.length === 0) || customer.tags.includes(tagFilter)

    return matchesSearch && matchesStatus && matchesTag
  })

  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.joinDate) - new Date(a.joinDate)
      case "oldest":
        return new Date(a.joinDate) - new Date(b.joinDate)
      case "name-asc":
        return a.name.localeCompare(b.name)
      case "name-desc":
        return b.name.localeCompare(a.name)
      case "spent-high":
        return b.totalSpent - a.totalSpent
      case "spent-low":
        return a.totalSpent - b.totalSpent
      case "orders-high":
        return b.orders - a.orders
      case "orders-low":
        return a.orders - b.orders
      default:
        return 0
    }
  })

  const handleExportCustomers = () => {
    toast({
      title: "Exporting customers",
      description: "Customer data is being exported to CSV",
    })
  }

  const handleAddCustomer = () => {
    toast({
      title: "Add customer",
      description: "This would open a form to add a new customer",
    })
  }

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer)
  }

  const handleSendEmail = (customerId) => {
    toast({
      title: "Send email",
      description: `Preparing to send email to customer ${customerId}`,
    })
  }

  const handleDeleteCustomer = (customerId) => {
    toast({
      title: "Delete customer",
      description: `This would delete customer ${customerId}`,
      variant: "destructive",
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "inactive":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const getTagColor = (tag) => {
    switch (tag) {
      case "loyal":
        return "bg-purple-500"
      case "new":
        return "bg-blue-500"
      case "wholesale":
        return "bg-amber-500"
      case "newsletter":
        return "bg-emerald-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">Manage and view your customer information</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button variant="outline" onClick={handleExportCustomers}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleAddCustomer}>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-full md:w-2/3">
          <Card>
            <CardHeader className="space-y-0 pb-2">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search customers..."
                    className="w-full pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-8 w-[110px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={tagFilter} onValueChange={setTagFilter}>
                    <SelectTrigger className="h-8 w-[110px]">
                      <SelectValue placeholder="Tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tags</SelectItem>
                      <SelectItem value="loyal">Loyal</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="wholesale">Wholesale</SelectItem>
                      <SelectItem value="newsletter">Newsletter</SelectItem>
                      <SelectItem value="none">No Tags</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-8 w-[140px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                      <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                      <SelectItem value="spent-high">Highest Spent</SelectItem>
                      <SelectItem value="spent-low">Lowest Spent</SelectItem>
                      <SelectItem value="orders-high">Most Orders</SelectItem>
                      <SelectItem value="orders-low">Fewest Orders</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50 transition-colors">
                          <th className="h-10 px-4 text-left font-medium">Customer</th>
                          <th className="h-10 px-4 text-left font-medium">Status</th>
                          <th className="h-10 px-4 text-left font-medium">Total Spent</th>
                          <th className="h-10 px-4 text-left font-medium">Orders</th>
                          <th className="h-10 px-4 text-left font-medium">Tags</th>
                          <th className="h-10 px-4 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedCustomers.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="p-4 text-center text-muted-foreground">
                              No customers found matching your criteria
                            </td>
                          </tr>
                        ) : (
                          sortedCustomers.map((customer) => (
                            <tr
                              key={customer.id}
                              className="border-b transition-colors hover:bg-muted/50"
                              onClick={() => handleCustomerSelect(customer)}
                            >
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarImage src={customer.avatar || "/placeholder.svg"} alt={customer.name} />
                                    <AvatarFallback>
                                      {customer.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{customer.name}</div>
                                    <div className="text-sm text-muted-foreground">{customer.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <div className={`h-2 w-2 rounded-full ${getStatusColor(customer.status)}`} />
                                  <span className="capitalize">{customer.status}</span>
                                </div>
                              </td>
                              <td className="p-4">${customer.totalSpent.toFixed(2)}</td>
                              <td className="p-4">{customer.orders}</td>
                              <td className="p-4">
                                <div className="flex flex-wrap gap-1">
                                  {customer.tags.length === 0 ? (
                                    <span className="text-sm text-muted-foreground">None</span>
                                  ) : (
                                    customer.tags.map((tag) => (
                                      <Badge key={tag} variant="outline" className="capitalize">
                                        {tag}
                                      </Badge>
                                    ))
                                  )}
                                </div>
                              </td>
                              <td className="p-4">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Actions</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => handleSendEmail(customer.id)}>
                                      <Mail className="mr-2 h-4 w-4" />
                                      Send Email
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <ShoppingBag className="mr-2 h-4 w-4" />
                                      View Orders
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Star className="mr-2 h-4 w-4" />
                                      Add Tag
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() => handleDeleteCustomer(customer.id)}
                                    >
                                      Delete Customer
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing <strong>{sortedCustomers.length}</strong> of <strong>{customers.length}</strong> customers
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-1/3">
          {selectedCustomer ? (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Customer Details</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleSendEmail(selectedCustomer.id)}>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        View Orders
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteCustomer(selectedCustomer.id)}
                      >
                        Delete Customer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription>ID: {selectedCustomer.id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={selectedCustomer.avatar || "/placeholder.svg"} alt={selectedCustomer.name} />
                    <AvatarFallback className="text-lg">
                      {selectedCustomer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="text-xl font-bold">{selectedCustomer.name}</h3>
                    <div className="flex items-center justify-center space-x-1">
                      <div className={`h-2 w-2 rounded-full ${getStatusColor(selectedCustomer.status)}`} />
                      <span className="text-sm capitalize">{selectedCustomer.status}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedCustomer.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedCustomer.phone}</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedCustomer.address}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Customer Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedCustomer.tags.length === 0 ? (
                      <span className="text-sm text-muted-foreground">No tags assigned</span>
                    ) : (
                      selectedCustomer.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="capitalize">
                          {tag}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 rounded-lg border p-3">
                    <div className="text-xs text-muted-foreground">Total Spent</div>
                    <div className="flex items-center text-lg font-bold">
                      <DollarSign className="mr-1 h-4 w-4" />
                      {selectedCustomer.totalSpent.toFixed(2)}
                    </div>
                  </div>
                  <div className="space-y-1 rounded-lg border p-3">
                    <div className="text-xs text-muted-foreground">Orders</div>
                    <div className="flex items-center text-lg font-bold">
                      <ShoppingBag className="mr-1 h-4 w-4" />
                      {selectedCustomer.orders}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Last Order:</span>
                    </div>
                    <span className="text-sm font-medium">
                      {new Date(selectedCustomer.lastOrder).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Customer Since:</span>
                    </div>
                    <span className="text-sm font-medium">
                      {new Date(selectedCustomer.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Tabs defaultValue="orders" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                  </TabsList>
                  <TabsContent value="orders" className="space-y-4">
                    <div className="text-center text-sm text-muted-foreground">
                      {selectedCustomer.orders > 0 ? (
                        <p>Click "View Orders" to see detailed order history</p>
                      ) : (
                        <p>This customer has no orders yet</p>
                      )}
                    </div>
                    <Button className="w-full" variant="outline">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      View All Orders
                    </Button>
                  </TabsContent>
                  <TabsContent value="notes" className="space-y-4">
                    <div className="text-center text-sm text-muted-foreground">
                      <p>No customer notes available</p>
                    </div>
                    <Button className="w-full" variant="outline">
                      Add Note
                    </Button>
                  </TabsContent>
                  <TabsContent value="activity" className="space-y-4">
                    <div className="text-center text-sm text-muted-foreground">
                      <p>No recent activity to display</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Customer Details</CardTitle>
                <CardDescription>Select a customer to view details</CardDescription>
              </CardHeader>
              <CardContent className="flex h-[400px] items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p>No customer selected</p>
                  <p className="text-sm">Click on a customer from the list to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
