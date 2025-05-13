"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Download, TrendingUp, DollarSign, ShoppingBag, Users, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("month")
  const [reportType, setReportType] = useState("sales")

  // Mock data for sales report
  const salesData = [
    { name: "Jan", total: 4500 },
    { name: "Feb", total: 3800 },
    { name: "Mar", total: 5200 },
    { name: "Apr", total: 4900 },
    { name: "May", total: 6500 },
    { name: "Jun", total: 5800 },
    { name: "Jul", total: 7200 },
    { name: "Aug", total: 8100 },
    { name: "Sep", total: 7400 },
    { name: "Oct", total: 8700 },
    { name: "Nov", total: 9600 },
    { name: "Dec", total: 11200 },
  ]

  // Mock data for product categories
  const categoryData = [
    { name: "Electronics", value: 35 },
    { name: "Fashion", value: 25 },
    { name: "Home & Kitchen", value: 20 },
    { name: "Beauty", value: 10 },
    { name: "Sports", value: 10 },
  ]

  // Mock data for top products
  const topProducts = [
    { name: "Wireless Headphones", sales: 124, revenue: 16119.76 },
    { name: "Smart Watch", sales: 98, revenue: 19599.02 },
    { name: "Wireless Earbuds", sales: 87, revenue: 7829.13 },
    { name: "Coffee Maker", sales: 65, revenue: 5849.35 },
    { name: "Digital Camera", sales: 42, revenue: 16799.58 },
  ]

  // Mock data for customer acquisition
  const customerData = [
    { name: "Jan", new: 120, returning: 80 },
    { name: "Feb", new: 110, returning: 85 },
    { name: "Mar", new: 130, returning: 90 },
    { name: "Apr", new: 140, returning: 95 },
    { name: "May", new: 150, returning: 100 },
    { name: "Jun", new: 160, returning: 110 },
    { name: "Jul", new: 170, returning: 120 },
    { name: "Aug", new: 180, returning: 130 },
    { name: "Sep", new: 190, returning: 140 },
    { name: "Oct", new: 200, returning: 150 },
    { name: "Nov", new: 210, returning: 160 },
    { name: "Dec", new: 220, returning: 170 },
  ]

  // Colors for pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  const downloadReport = () => {
    toast({
      title: "Downloading report",
      description: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report for the selected period is being downloaded`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">View detailed reports and analytics for your store</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">Sales Report</SelectItem>
              <SelectItem value="products">Product Report</SelectItem>
              <SelectItem value="customers">Customer Report</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={downloadReport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue={timeRange} onValueChange={setTimeRange} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="quarter">Quarter</TabsTrigger>
          <TabsTrigger value="year">Year</TabsTrigger>
        </TabsList>
      </Tabs>

      {reportType === "sales" && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$75,648.50</div>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center text-sm text-green-500">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    12.5%
                  </span>
                  <span className="text-xs text-muted-foreground">from last {timeRange}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,342</div>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center text-sm text-green-500">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    8.2%
                  </span>
                  <span className="text-xs text-muted-foreground">from last {timeRange}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3,721</div>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center text-sm text-green-500">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    5.3%
                  </span>
                  <span className="text-xs text-muted-foreground">from last {timeRange}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2%</div>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center text-sm text-red-500">
                    <ArrowDownRight className="mr-1 h-3 w-3" />
                    0.5%
                  </span>
                  <span className="text-xs text-muted-foreground">from last {timeRange}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
                <CardDescription>Monthly revenue for the current year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [`$${value}`, "Revenue"]}
                        labelFormatter={(label) => `Month: ${label}`}
                      />
                      <Legend />
                      <Bar dataKey="total" name="Revenue" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Distribution of sales across product categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Products with the highest sales volume and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-2 text-left font-medium">Product</th>
                      <th className="pb-2 text-right font-medium">Units Sold</th>
                      <th className="pb-2 text-right font-medium">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="py-3">{product.name}</td>
                        <td className="py-3 text-right">{product.sales}</td>
                        <td className="py-3 text-right">${product.revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {reportType === "products" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>Sales performance of top products over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="total" name="Sales" stroke="#3b82f6" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
              <CardDescription>Current inventory levels and stock alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-2 text-left font-medium">Product</th>
                      <th className="pb-2 text-right font-medium">In Stock</th>
                      <th className="pb-2 text-right font-medium">Threshold</th>
                      <th className="pb-2 text-right font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3">Wireless Headphones</td>
                      <td className="py-3 text-right">45</td>
                      <td className="py-3 text-right">20</td>
                      <td className="py-3 text-right text-green-500">Good</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">Smart Watch</td>
                      <td className="py-3 text-right">12</td>
                      <td className="py-3 text-right">15</td>
                      <td className="py-3 text-right text-yellow-500">Low</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">Digital Camera</td>
                      <td className="py-3 text-right">5</td>
                      <td className="py-3 text-right">10</td>
                      <td className="py-3 text-right text-red-500">Critical</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">Wireless Earbuds</td>
                      <td className="py-3 text-right">56</td>
                      <td className="py-3 text-right">25</td>
                      <td className="py-3 text-right text-green-500">Good</td>
                    </tr>
                    <tr>
                      <td className="py-3">Coffee Maker</td>
                      <td className="py-3 text-right">8</td>
                      <td className="py-3 text-right">12</td>
                      <td className="py-3 text-right text-yellow-500">Low</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Categories</CardTitle>
              <CardDescription>Distribution of products by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {reportType === "customers" && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3,721</div>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center text-sm text-green-500">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    5.3%
                  </span>
                  <span className="text-xs text-muted-foreground">from last {timeRange}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,245</div>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center text-sm text-green-500">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    8.2%
                  </span>
                  <span className="text-xs text-muted-foreground">from last {timeRange}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Returning Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,476</div>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center text-sm text-green-500">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    3.1%
                  </span>
                  <span className="text-xs text-muted-foreground">from last {timeRange}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$56.37</div>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center text-sm text-green-500">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    2.3%
                  </span>
                  <span className="text-xs text-muted-foreground">from last {timeRange}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customer Acquisition</CardTitle>
              <CardDescription>New vs. returning customers over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={customerData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="new" name="New Customers" fill="#3b82f6" />
                    <Bar dataKey="returning" name="Returning Customers" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Demographics</CardTitle>
                <CardDescription>Age distribution of customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "18-24", value: 15 },
                          { name: "25-34", value: 35 },
                          { name: "35-44", value: 25 },
                          { name: "45-54", value: 15 },
                          { name: "55+", value: 10 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>Top regions by customer count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="pb-2 text-left font-medium">Region</th>
                        <th className="pb-2 text-right font-medium">Customers</th>
                        <th className="pb-2 text-right font-medium">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3">California</td>
                        <td className="py-3 text-right">845</td>
                        <td className="py-3 text-right">22.7%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3">New York</td>
                        <td className="py-3 text-right">645</td>
                        <td className="py-3 text-right">17.3%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3">Texas</td>
                        <td className="py-3 text-right">520</td>
                        <td className="py-3 text-right">14.0%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3">Florida</td>
                        <td className="py-3 text-right">410</td>
                        <td className="py-3 text-right">11.0%</td>
                      </tr>
                      <tr>
                        <td className="py-3">Illinois</td>
                        <td className="py-3 text-right">325</td>
                        <td className="py-3 text-right">8.7%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
