"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowDown,
  ArrowUp,
  ArrowRight,
  DollarSign,
  Users,
  ShoppingCart,
  Package,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("week")

  const stats = {
    revenue: {
      value: 24560,
      change: 12.5,
      increasing: true,
    },
    orders: {
      value: 342,
      change: 8.2,
      increasing: true,
    },
    customers: {
      value: 1253,
      change: 5.3,
      increasing: true,
    },
    inventory: {
      value: 864,
      change: 2.1,
      increasing: false,
    },
  }

  const recentOrders = [
    {
      id: "ORD-7352",
      customer: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      date: "2023-05-15 14:30",
      amount: 129.99,
      status: "Delivered",
      statusColor: "bg-green-500",
    },
    {
      id: "ORD-7351",
      customer: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      date: "2023-05-15 13:45",
      amount: 259.98,
      status: "Processing",
      statusColor: "bg-blue-500",
    },
    {
      id: "ORD-7350",
      customer: "Emily Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      date: "2023-05-15 11:20",
      amount: 89.99,
      status: "Shipped",
      statusColor: "bg-purple-500",
    },
    {
      id: "ORD-7349",
      customer: "David Kim",
      avatar: "/placeholder.svg?height=40&width=40",
      date: "2023-05-15 10:15",
      amount: 199.99,
      status: "Pending",
      statusColor: "bg-yellow-500",
    },
    {
      id: "ORD-7348",
      customer: "Jessica Taylor",
      avatar: "/placeholder.svg?height=40&width=40",
      date: "2023-05-15 09:30",
      amount: 149.99,
      status: "Delivered",
      statusColor: "bg-green-500",
    },
  ]

  const topProducts = [
    {
      id: 1,
      name: "Wireless Headphones",
      image: "/placeholder.svg?height=40&width=40",
      sold: 124,
      revenue: 16119.76,
      stock: 45,
    },
    {
      id: 2,
      name: "Smart Watch",
      image: "/placeholder.svg?height=40&width=40",
      sold: 98,
      revenue: 19599.02,
      stock: 32,
    },
    {
      id: 6,
      name: "Wireless Earbuds",
      image: "/placeholder.svg?height=40&width=40",
      sold: 87,
      revenue: 7829.13,
      stock: 56,
    },
    {
      id: 4,
      name: "Coffee Maker",
      image: "/placeholder.svg?height=40&width=40",
      sold: 65,
      revenue: 5849.35,
      stock: 28,
    },
    {
      id: 8,
      name: "Digital Camera",
      image: "/placeholder.svg?height=40&width=40",
      sold: 42,
      revenue: 16799.58,
      stock: 15,
    },
  ]

  const lowStockItems = [
    {
      id: 8,
      name: "Digital Camera",
      image: "/placeholder.svg?height=40&width=40",
      stock: 5,
      threshold: 10,
    },
    {
      id: 4,
      name: "Coffee Maker",
      image: "/placeholder.svg?height=40&width=40",
      stock: 8,
      threshold: 15,
    },
    {
      id: 2,
      name: "Smart Watch",
      image: "/placeholder.svg?height=40&width=40",
      stock: 12,
      threshold: 20,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Admin! Here's what's happening with your store today.</p>
        </div>
        <Tabs defaultValue={timeRange} onValueChange={setTimeRange} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue.value.toLocaleString()}</div>
            <div className="flex items-center space-x-2">
              {stats.revenue.increasing ? (
                <Badge className="bg-green-500">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  {stats.revenue.change}%
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <ArrowDown className="mr-1 h-3 w-3" />
                  {stats.revenue.change}%
                </Badge>
              )}
              <p className="text-xs text-muted-foreground">from last {timeRange}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orders.value}</div>
            <div className="flex items-center space-x-2">
              {stats.orders.increasing ? (
                <Badge className="bg-green-500">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  {stats.orders.change}%
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <ArrowDown className="mr-1 h-3 w-3" />
                  {stats.orders.change}%
                </Badge>
              )}
              <p className="text-xs text-muted-foreground">from last {timeRange}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customers.value}</div>
            <div className="flex items-center space-x-2">
              {stats.customers.increasing ? (
                <Badge className="bg-green-500">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  {stats.customers.change}%
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <ArrowDown className="mr-1 h-3 w-3" />
                  {stats.customers.change}%
                </Badge>
              )}
              <p className="text-xs text-muted-foreground">from last {timeRange}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inventory.value}</div>
            <div className="flex items-center space-x-2">
              {stats.inventory.increasing ? (
                <Badge className="bg-green-500">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  {stats.inventory.change}%
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <ArrowDown className="mr-1 h-3 w-3" />
                  {stats.inventory.change}%
                </Badge>
              )}
              <p className="text-xs text-muted-foreground">from last {timeRange}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>You have {recentOrders.length} orders today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={order.avatar || "/placeholder.svg"} alt={order.customer} />
                      <AvatarFallback>{order.customer.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{order.customer}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">{order.id}</p>
                        <div className={`h-1.5 w-1.5 rounded-full ${order.statusColor}`}></div>
                        <p className="text-xs text-muted-foreground">{order.status}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">${order.amount.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{order.date}</p>
                    </div>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/orders/${order.id}`}>
                        <ArrowRight className="h-4 w-4" />
                        <span className="sr-only">View order</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/admin/orders">View All Orders</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Your best performing products this {timeRange}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="h-10 w-10 rounded-md object-cover"
                  />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{product.name}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>{product.sold} sold</span>
                      <span className="mx-2">•</span>
                      <span>${product.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {product.stock < 20 ? (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    )}
                    <span className="text-sm">{product.stock}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/admin/products">View All Products</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
            <CardDescription>Products that need to be restocked soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                    <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
                      {item.stock}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{item.name}</p>
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        <p className="text-xs text-destructive">Low stock</p>
                      </div>
                    </div>
                    <div className="mt-1">
                      <Progress value={(item.stock / item.threshold) * 100} className="h-2" />
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{item.stock} in stock</span>
                      <span>Threshold: {item.threshold}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/admin/inventory">View Inventory</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions in your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-blue-500/20 p-2 text-blue-500">
                  <Package className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">New product added:</span> Wireless Earbuds
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <Clock className="mr-1 inline-block h-3 w-3" />
                    30 minutes ago
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-green-500/20 p-2 text-green-500">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">Order completed:</span> ORD-7348
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <Clock className="mr-1 inline-block h-3 w-3" />
                    45 minutes ago
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-yellow-500/20 p-2 text-yellow-500">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">Low stock alert:</span> Digital Camera
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <Clock className="mr-1 inline-block h-3 w-3" />1 hour ago
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-purple-500/20 p-2 text-purple-500">
                  <Users className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">New customer registered:</span> David Kim
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <Clock className="mr-1 inline-block h-3 w-3" />2 hours ago
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Activity
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
