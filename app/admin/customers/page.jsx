"use client"

import { useState, useEffect } from "react"
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
  Trash2,
  RefreshCw,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Fetch customers from API
  const fetchCustomers = async (page = 1, search = "") => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search })
      })
      
      const response = await fetch(`/api/admin/users?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setCustomers(data.data.users)
        setCurrentPage(data.data.page)
        setTotalPages(data.data.pages)
        setTotal(data.data.total)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch customers",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching customers:", error)
      toast({
        title: "Error",
        description: "Failed to fetch customers",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Delete customer
  const deleteCustomer = async (customerId) => {
    try {
      setDeleteLoading(true)
      const response = await fetch(`/api/admin/users/${customerId}`, {
        method: "DELETE",
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Customer deleted successfully",
        })
        // Refresh the list
        fetchCustomers(currentPage, searchTerm)
        // Clear selected customer if it was deleted
        if (selectedCustomer?._id === customerId) {
          setSelectedCustomer(null)
        }
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete customer",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting customer:", error)
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  // Bulk delete customers
  const bulkDeleteCustomers = async (customerIds) => {
    try {
      setDeleteLoading(true)
      const response = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userIds: customerIds }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Success",
          description: `${data.deletedCount} customer(s) deleted successfully`,
        })
        fetchCustomers(currentPage, searchTerm)
        setSelectedCustomer(null)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete customers",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting customers:", error)
      toast({
        title: "Error",
        description: "Failed to delete customers",
        variant: "destructive",
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  // Search with debouncing
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchCustomers(1, searchTerm)
      setCurrentPage(1)
    }, 500)

    return () => clearTimeout(delayedSearch)
  }, [searchTerm])

  // Initial load
  useEffect(() => {
    fetchCustomers()
  }, [])

  // Sort customers
  const sortedCustomers = [...customers].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.createdAt) - new Date(a.createdAt)
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt)
      case "name-asc":
        return a.name.localeCompare(b.name)
      case "name-desc":
        return b.name.localeCompare(a.name)
      case "email-asc":
        return a.email.localeCompare(b.email)
      case "email-desc":
        return b.email.localeCompare(a.email)
      default:
        return 0
    }
  })

  const handleExportCustomers = () => {
    // Create CSV content
    const csvContent = [
      ["Name", "Email", "Role", "Created At"].join(","),
      ...customers.map(customer => [
        customer.name,
        customer.email,
        customer.role,
        new Date(customer.createdAt).toLocaleDateString()
      ].join(","))
    ].join("\n")

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "customers.csv"
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export completed",
      description: "Customer data exported to CSV",
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

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1
      setCurrentPage(newPage)
      fetchCustomers(newPage, searchTerm)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1
      setCurrentPage(newPage)
      fetchCustomers(newPage, searchTerm)
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
          <Button variant="outline" onClick={() => fetchCustomers(currentPage, searchTerm)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExportCustomers}>
            <Download className="mr-2 h-4 w-4" />
            Export
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
                    placeholder="Search customers by name or email..."
                    className="w-full pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-8 w-[140px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                      <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                      <SelectItem value="email-asc">Email (A-Z)</SelectItem>
                      <SelectItem value="email-desc">Email (Z-A)</SelectItem>
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
                          <th className="h-10 px-4 text-left font-medium">Role</th>
                          <th className="h-10 px-4 text-left font-medium">Created At</th>
                          <th className="h-10 px-4 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="4" className="p-4 text-center text-muted-foreground">
                              <RefreshCw className="mx-auto h-4 w-4 animate-spin" />
                              Loading customers...
                            </td>
                          </tr>
                        ) : sortedCustomers.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="p-4 text-center text-muted-foreground">
                              No customers found matching your criteria
                            </td>
                          </tr>
                        ) : (
                          sortedCustomers.map((customer) => (
                            <tr
                              key={customer._id}
                              className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                              onClick={() => handleCustomerSelect(customer)}
                            >
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarFallback>
                                      {customer.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("").toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{customer.name}</div>
                                    <div className="text-sm text-muted-foreground">{customer.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <Badge variant="outline" className="capitalize">
                                  {customer.role}
                                </Badge>
                              </td>
                              <td className="p-4">
                                {new Date(customer.createdAt).toLocaleDateString()}
                              </td>
                              <td className="p-4">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Actions</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation()
                                      handleSendEmail(customer._id)
                                    }}>
                                      <Mail className="mr-2 h-4 w-4" />
                                      Send Email
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation()
                                      handleCustomerSelect(customer)
                                    }}>
                                      <Star className="mr-2 h-4 w-4" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <DropdownMenuItem 
                                          className="text-red-600" 
                                          onClick={(e) => e.stopPropagation()}
                                          onSelect={(e) => e.preventDefault()}
                                        >
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          Delete Customer
                                        </DropdownMenuItem>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to delete {customer.name}? This action cannot be undone.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => deleteCustomer(customer._id)}
                                            className="bg-red-600 hover:bg-red-700"
                                            disabled={deleteLoading}
                                          >
                                            {deleteLoading ? "Deleting..." : "Delete"}
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
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
                    Showing <strong>{customers.length}</strong> of <strong>{total}</strong> customers
                    {totalPages > 1 && (
                      <span> (Page {currentPage} of {totalPages})</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handlePreviousPage}
                      disabled={currentPage <= 1 || loading}
                    >
                      Previous
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleNextPage}
                      disabled={currentPage >= totalPages || loading}
                    >
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
                      <DropdownMenuItem onClick={() => handleSendEmail(selectedCustomer._id)}>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Customer
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {selectedCustomer.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteCustomer(selectedCustomer._id)}
                              className="bg-red-600 hover:bg-red-700"
                              disabled={deleteLoading}
                            >
                              {deleteLoading ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription>ID: {selectedCustomer._id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-lg">
                      {selectedCustomer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="text-xl font-bold">{selectedCustomer.name}</h3>
                    <Badge variant="outline" className="capitalize">
                      {selectedCustomer.role}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedCustomer.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Joined: {new Date(selectedCustomer.createdAt).toLocaleDateString()}</span>
                  </div>
                  {selectedCustomer.updatedAt && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Updated: {new Date(selectedCustomer.updatedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <Tabs defaultValue="info" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="info">Info</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                  </TabsList>
                  <TabsContent value="info" className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Customer Information</h4>
                      <div className="text-sm space-y-1">
                        <div><strong>Name:</strong> {selectedCustomer.name}</div>
                        <div><strong>Email:</strong> {selectedCustomer.email}</div>
                        <div><strong>Role:</strong> {selectedCustomer.role}</div>
                        <div><strong>ID:</strong> {selectedCustomer._id}</div>
                      </div>
                    </div>
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