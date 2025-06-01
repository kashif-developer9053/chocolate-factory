// /app/admin/analytics/page.jsx
"use client"

import { useState, useEffect } from "react"
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  BarChart3,
  PieChart,
  Target,
  Star
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"
import axios from "axios"

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30")
  const [analytics, setAnalytics] = useState({
    sales: {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      revenueGrowth: 0,
      ordersGrowth: 0
    },
    orders: {
      confirmed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      total: 0
    },
    products: {
      total: 0,
      inStock: 0,
      lowStock: 0,
      outOfStock: 0,
      topProducts: []
    },
    customers: {
      total: 0,
      newCustomers: 0,
      returningCustomers: 0
    },
    recentOrders: [],
    lowStockProducts: []
  })

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      // Fetch orders data
      const ordersResponse = await axios.get(`/api/orders?limit=1000`)
      
      // Fetch products data
      const productsResponse = await axios.get(`/api/products?limit=1000`)
      
      if (ordersResponse.data.success && productsResponse.data.success) {
        const orders = ordersResponse.data.data.orders || []
        const products = productsResponse.data.data.products || []
        
        // Calculate analytics
        const calculatedAnalytics = calculateAnalytics(orders, products, timeRange)
        setAnalytics(calculatedAnalytics)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateAnalytics = (orders, products, days) => {
    const now = new Date()
    const startDate = new Date(now.getTime() - (parseInt(days) * 24 * 60 * 60 * 1000))
    
    // Filter orders by date range
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.orderDate || order.createdAt)
      return orderDate >= startDate
    })

    // Sales Analytics
    const totalRevenue = filteredOrders
      .filter(order => order.orderStatus === 'delivered')
      .reduce((sum, order) => sum + (order.pricing?.total || order.total || 0), 0)
    
    const totalOrders = filteredOrders.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Order Status Analytics
    const ordersByStatus = filteredOrders.reduce((acc, order) => {
      acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1
      acc.total++
      return acc
    }, { confirmed: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0, total: 0 })

    // Product Analytics
    const inStock = products.filter(p => p.stock > 10).length
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length
    const outOfStock = products.filter(p => p.stock <= 0).length

    // Top selling products
    const productSales = {}
    filteredOrders.forEach(order => {
      order.items?.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            name: item.name,
            totalSold: 0,
            revenue: 0
          }
        }
        productSales[item.productId].totalSold += item.quantity
        productSales[item.productId].revenue += item.price * item.quantity
      })
    })

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5)

    // Low stock products
    const lowStockProducts = products
      .filter(p => p.stock <= 10)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 10)

    // Recent orders
    const recentOrders = orders
      .sort((a, b) => new Date(b.orderDate || b.createdAt) - new Date(a.orderDate || a.createdAt))
      .slice(0, 10)

    // Calculate growth (mock data for now)
    const revenueGrowth = Math.random() * 20 - 10 // -10% to +10%
    const ordersGrowth = Math.random() * 30 - 15 // -15% to +15%

    // Customer analytics (based on orders)
    const uniqueCustomers = new Set(orders.map(order => order.customer?.email)).size
    const newCustomersCount = Math.floor(uniqueCustomers * 0.3) // Mock calculation
    const returningCustomers = uniqueCustomers - newCustomersCount

    return {
      sales: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        revenueGrowth,
        ordersGrowth
      },
      orders: ordersByStatus,
      products: {
        total: products.length,
        inStock,
        lowStock,
        outOfStock,
        topProducts
      },
      customers: {
        total: uniqueCustomers,
        newCustomers: newCustomersCount,
        returningCustomers
      },
      recentOrders,
      lowStockProducts
    }
  }

  const formatPrice = (price) => `Rs. ${price?.toFixed(0) || 0}`
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      confirmed: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const getStockStatus = (stock) => {
    if (stock <= 0) return { label: "Out of Stock", color: "text-red-600", bg: "bg-red-50" }
    if (stock <= 5) return { label: "Critical", color: "text-red-600", bg: "bg-red-50" }
    if (stock <= 10) return { label: "Low Stock", color: "text-yellow-600", bg: "bg-yellow-50" }
    return { label: "In Stock", color: "text-green-600", bg: "bg-green-50" }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Overview of your store performance and key metrics</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(analytics.sales.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              <span className={analytics.sales.revenueGrowth >= 0 ? "text-green-600" : "text-red-600"}>
                {analytics.sales.revenueGrowth >= 0 ? "+" : ""}{analytics.sales.revenueGrowth.toFixed(1)}%
              </span>{" "}
              from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.sales.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              <span className={analytics.sales.ordersGrowth >= 0 ? "text-green-600" : "text-red-600"}>
                {analytics.sales.ordersGrowth >= 0 ? "+" : ""}{analytics.sales.ordersGrowth.toFixed(1)}%
              </span>{" "}
              from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(analytics.sales.averageOrderValue)}</div>
            <p className="text-xs text-muted-foreground">
              Per order average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.customers.total}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.customers.newCustomers} new this period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Order Status Distribution
            </CardTitle>
            <CardDescription>Breakdown of orders by status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm">Confirmed</span>
                </div>
                <span className="font-semibold">{analytics.orders.confirmed}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Processing</span>
                </div>
                <span className="font-semibold">{analytics.orders.processing}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm">Shipped</span>
                </div>
                <span className="font-semibold">{analytics.orders.shipped}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Delivered</span>
                </div>
                <span className="font-semibold">{analytics.orders.delivered}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm">Cancelled</span>
                </div>
                <span className="font-semibold">{analytics.orders.cancelled}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Inventory Overview
            </CardTitle>
            <CardDescription>Stock status across all products</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{analytics.products.inStock}</div>
                <div className="text-sm text-green-700">In Stock</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{analytics.products.lowStock}</div>
                <div className="text-sm text-yellow-700">Low Stock</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{analytics.products.outOfStock}</div>
                <div className="text-sm text-red-700">Out of Stock</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{analytics.products.total}</div>
                <div className="text-sm text-blue-700">Total Products</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products and Low Stock Alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Top Selling Products
            </CardTitle>
            <CardDescription>Best performing products in selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.products.topProducts.length > 0 ? (
                analytics.products.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {product.totalSold} sold • {formatPrice(product.revenue)}
                      </div>
                    </div>
                    <Badge variant="secondary">#{index + 1}</Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No sales data for selected period
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alerts
            </CardTitle>
            <CardDescription>Products that need immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.lowStockProducts.length > 0 ? (
                analytics.lowStockProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock)
                  return (
                    <div key={product._id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          SKU: {product._id.substring(product._id.length - 8)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{product.stock}</div>
                        <Badge variant="outline" className={stockStatus.color}>
                          {stockStatus.label}
                        </Badge>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  All products are well stocked
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Orders
          </CardTitle>
          <CardDescription>Latest orders and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.recentOrders.length > 0 ? (
              analytics.recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium">
                        #{order._id.slice(-6).toUpperCase()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.customer?.firstName} {order.customer?.lastName}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-medium">{formatPrice(order.pricing?.total || order.total)}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(order.orderDate || order.createdAt)}
                      </div>
                    </div>
                    <Badge className={getStatusColor(order.orderStatus)}>
                      {order.orderStatus}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No recent orders
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}