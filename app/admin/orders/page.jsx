"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  MoreHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Truck,
  XCircle,
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
import { toast } from "@/hooks/use-toast"

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Mock orders data
  const allOrders = [
    {
      id: "ORD-7352",
      customer: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      date: "2023-05-15 14:30",
      total: 129.99,
      status: "Delivered",
      paymentStatus: "Paid",
      items: 3,
    },
    {
      id: "ORD-7351",
      customer: "Michael Chen",
      email: "michael.chen@example.com",
      date: "2023-05-15 13:45",
      total: 259.98,
      status: "Processing",
      paymentStatus: "Paid",
      items: 2,
    },
    {
      id: "ORD-7350",
      customer: "Emily Rodriguez",
      email: "emily.rodriguez@example.com",
      date: "2023-05-15 11:20",
      total: 89.99,
      status: "Shipped",
      paymentStatus: "Paid",
      items: 1,
    },
    {
      id: "ORD-7349",
      customer: "David Kim",
      email: "david.kim@example.com",
      date: "2023-05-15 10:15",
      total: 199.99,
      status: "Pending",
      paymentStatus: "Pending",
      items: 4,
    },
    {
      id: "ORD-7348",
      customer: "Jessica Taylor",
      email: "jessica.taylor@example.com",
      date: "2023-05-15 09:30",
      total: 149.99,
      status: "Delivered",
      paymentStatus: "Paid",
      items: 2,
    },
    {
      id: "ORD-7347",
      customer: "Robert Johnson",
      email: "robert.johnson@example.com",
      date: "2023-05-14 16:45",
      total: 79.99,
      status: "Cancelled",
      paymentStatus: "Refunded",
      items: 1,
    },
    {
      id: "ORD-7346",
      customer: "Amanda Lee",
      email: "amanda.lee@example.com",
      date: "2023-05-14 14:20",
      total: 349.97,
      status: "Delivered",
      paymentStatus: "Paid",
      items: 3,
    },
    {
      id: "ORD-7345",
      customer: "Thomas Wilson",
      email: "thomas.wilson@example.com",
      date: "2023-05-14 11:30",
      total: 59.99,
      status: "Processing",
      paymentStatus: "Paid",
      items: 1,
    },
    {
      id: "ORD-7344",
      customer: "Olivia Martinez",
      email: "olivia.martinez@example.com",
      date: "2023-05-14 10:15",
      total: 129.99,
      status: "Shipped",
      paymentStatus: "Paid",
      items: 2,
    },
    {
      id: "ORD-7343",
      customer: "William Brown",
      email: "william.brown@example.com",
      date: "2023-05-14 09:45",
      total: 89.99,
      status: "Pending",
      paymentStatus: "Pending",
      items: 1,
    },
    {
      id: "ORD-7342",
      customer: "Sophia Garcia",
      email: "sophia.garcia@example.com",
      date: "2023-05-13 15:30",
      total: 199.98,
      status: "Delivered",
      paymentStatus: "Paid",
      items: 2,
    },
    {
      id: "ORD-7341",
      customer: "James Miller",
      email: "james.miller@example.com",
      date: "2023-05-13 13:20",
      total: 299.99,
      status: "Returned",
      paymentStatus: "Refunded",
      items: 1,
    },
  ]

  // Filter orders
  const filteredOrders = allOrders.filter((order) => {
    // Search filter
    if (
      searchQuery &&
      !order.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !order.customer.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !order.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Status filter
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false
    }

    return true
  })

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]

    if (sortField === "date") {
      aValue = new Date(aValue)
      bValue = new Date(bValue)
    } else if (typeof aValue === "string") {
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
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage)
  const paginatedOrders = sortedOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const updateOrderStatus = (orderId, newStatus) => {
    // In a real app, you would call an API to update the order status
    toast({
      title: "Order status updated",
      description: `Order ${orderId} has been marked as ${newStatus}`,
    })
  }

  const printInvoice = (orderId) => {
    // In a real app, you would generate and print an invoice
    toast({
      title: "Generating invoice",
      description: `Preparing invoice for order ${orderId}`,
    })
  }

  const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"]

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500"
      case "Shipped":
        return "bg-blue-500"
      case "Processing":
        return "bg-yellow-500"
      case "Pending":
        return "bg-orange-500"
      case "Cancelled":
        return "bg-red-500"
      case "Returned":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders and fulfillment</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search orders..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>
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
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("id")}>
                <div className="flex items-center gap-1">
                  Order
                  {sortField === "id" && <ArrowUpDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("date")}>
                <div className="flex items-center gap-1">
                  Date
                  {sortField === "date" && <ArrowUpDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("customer")}>
                <div className="flex items-center gap-1">
                  Customer
                  {sortField === "customer" && <ArrowUpDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("status")}>
                <div className="flex items-center gap-1">
                  Status
                  {sortField === "status" && <ArrowUpDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("paymentStatus")}>
                <div className="flex items-center gap-1">
                  Payment
                  {sortField === "paymentStatus" && <ArrowUpDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => toggleSort("total")}>
                <div className="flex items-center justify-end gap-1">
                  Total
                  {sortField === "total" && <ArrowUpDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="font-medium">{order.id}</div>
                    <div className="text-sm text-muted-foreground">{order.items} items</div>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <div>{order.customer}</div>
                    <div className="text-sm text-muted-foreground">{order.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${getStatusColor(order.status)}`}></div>
                      <span>{order.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.paymentStatus === "Paid"
                          ? "default"
                          : order.paymentStatus === "Pending"
                            ? "outline"
                            : "destructive"
                      }
                    >
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">${order.total.toFixed(2)}</TableCell>
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
                          <Link href={`/admin/orders/${order.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => printInvoice(order.id)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Print Invoice
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {order.status !== "Delivered" && order.status !== "Cancelled" && (
                          <>
                            {order.status === "Pending" && (
                              <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "Processing")}>
                                <Truck className="mr-2 h-4 w-4" />
                                Mark as Processing
                              </DropdownMenuItem>
                            )}
                            {order.status === "Processing" && (
                              <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "Shipped")}>
                                <Truck className="mr-2 h-4 w-4" />
                                Mark as Shipped
                              </DropdownMenuItem>
                            )}
                            {order.status === "Shipped" && (
                              <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "Delivered")}>
                                <Truck className="mr-2 h-4 w-4" />
                                Mark as Delivered
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "Cancelled")}>
                              <XCircle className="mr-2 h-4 w-4" />
                              Cancel Order
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No orders found.
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
            {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
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
