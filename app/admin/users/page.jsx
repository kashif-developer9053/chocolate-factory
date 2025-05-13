"use client"

import { useState } from "react"
import { Search, MoreHorizontal, UserCheck, UserX, Mail, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"
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

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Mock users data
  const allUsers = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      status: "Active",
      role: "Customer",
      orders: 12,
      lastActive: "2023-05-15 14:30",
      joined: "2022-03-10",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@example.com",
      status: "Active",
      role: "Customer",
      orders: 8,
      lastActive: "2023-05-14 09:45",
      joined: "2022-05-22",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@example.com",
      status: "Active",
      role: "Customer",
      orders: 5,
      lastActive: "2023-05-10 16:20",
      joined: "2022-07-15",
    },
    {
      id: 4,
      name: "David Kim",
      email: "david.kim@example.com",
      status: "Blocked",
      role: "Customer",
      orders: 0,
      lastActive: "2023-04-05 11:30",
      joined: "2022-08-03",
    },
    {
      id: 5,
      name: "Jessica Taylor",
      email: "jessica.taylor@example.com",
      status: "Active",
      role: "Customer",
      orders: 15,
      lastActive: "2023-05-15 10:15",
      joined: "2022-01-18",
    },
    {
      id: 6,
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      status: "Inactive",
      role: "Customer",
      orders: 3,
      lastActive: "2023-03-20 14:30",
      joined: "2022-04-12",
    },
    {
      id: 7,
      name: "Amanda Lee",
      email: "amanda.lee@example.com",
      status: "Active",
      role: "Customer",
      orders: 7,
      lastActive: "2023-05-12 09:45",
      joined: "2022-06-30",
    },
    {
      id: 8,
      name: "Thomas Wilson",
      email: "thomas.wilson@example.com",
      status: "Active",
      role: "Customer",
      orders: 9,
      lastActive: "2023-05-14 17:30",
      joined: "2022-02-15",
    },
    {
      id: 9,
      name: "Olivia Martinez",
      email: "olivia.martinez@example.com",
      status: "Active",
      role: "Customer",
      orders: 11,
      lastActive: "2023-05-13 13:20",
      joined: "2022-03-28",
    },
    {
      id: 10,
      name: "William Brown",
      email: "william.brown@example.com",
      status: "Inactive",
      role: "Customer",
      orders: 2,
      lastActive: "2023-04-10 10:45",
      joined: "2022-05-05",
    },
    {
      id: 11,
      name: "Sophia Garcia",
      email: "sophia.garcia@example.com",
      status: "Active",
      role: "Customer",
      orders: 6,
      lastActive: "2023-05-11 15:30",
      joined: "2022-07-22",
    },
    {
      id: 12,
      name: "James Miller",
      email: "james.miller@example.com",
      status: "Blocked",
      role: "Customer",
      orders: 0,
      lastActive: "2023-03-15 09:10",
      joined: "2022-09-10",
    },
  ]

  // Filter users
  const filteredUsers = allUsers.filter((user) => {
    // Search filter
    if (
      searchQuery &&
      !user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !user.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Status filter
    if (statusFilter !== "all" && user.status !== statusFilter) {
      return false
    }

    return true
  })

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
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
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage)
  const paginatedUsers = sortedUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const toggleUserStatus = (userId, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Blocked" : "Active"

    // In a real app, you would call an API to update the user status
    toast({
      title: `User ${newStatus.toLowerCase()}`,
      description: `User has been ${newStatus.toLowerCase()} successfully`,
    })
  }

  const sendEmail = (email) => {
    // In a real app, you would open an email composition interface or modal
    toast({
      title: "Email action",
      description: `Preparing to send email to ${email}`,
    })
  }

  const statuses = ["Active", "Inactive", "Blocked"]

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
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
              <TableHead className="cursor-pointer" onClick={() => toggleSort("name")}>
                <div className="flex items-center gap-1">
                  User
                  {sortField === "name" && <ArrowUpDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("status")}>
                <div className="flex items-center gap-1">
                  Status
                  {sortField === "status" && <ArrowUpDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => toggleSort("orders")}>
                <div className="flex items-center justify-end gap-1">
                  Orders
                  {sortField === "orders" && <ArrowUpDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("lastActive")}>
                <div className="flex items-center gap-1">
                  Last Active
                  {sortField === "lastActive" && <ArrowUpDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("joined")}>
                <div className="flex items-center gap-1">
                  Joined
                  {sortField === "joined" && <ArrowUpDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "Active" ? "default" : user.status === "Inactive" ? "outline" : "destructive"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{user.orders}</TableCell>
                  <TableCell>{user.lastActive}</TableCell>
                  <TableCell>{user.joined}</TableCell>
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
                        <DropdownMenuItem onClick={() => toggleUserStatus(user.id, user.status)}>
                          {user.status === "Active" ? (
                            <>
                              <UserX className="mr-2 h-4 w-4" />
                              Block User
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Activate User
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => sendEmail(user.email)}>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found.
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
            {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
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
