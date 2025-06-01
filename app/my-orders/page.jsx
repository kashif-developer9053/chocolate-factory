// /app/orders/page.js - Updated to use new user orders route
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Package, Clock, CheckCircle, Truck, AlertCircle, Eye, Calendar, MapPin, Phone, Mail, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import MainNav from "@/components/main-nav"
import Footer from "@/components/footer"
import { toast } from "@/hooks/use-toast"

export default function MyOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    try {
      const userData = localStorage.getItem('user')
      if (!userData) {
        toast({
          title: "Authentication required",
          description: "Please login to view your orders",
          variant: "destructive",
        })
        router.push("/login")
        return
      }
      
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      fetchUserOrders(parsedUser)
    } catch (error) {
      console.error('Error loading user data:', error)
      router.push("/login")
    }
  }, [router])

  const fetchUserOrders = async (userData) => {
    try {
      console.log('Fetching orders for user:', userData)
      
      const response = await fetch('/api/my-orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'user-email': userData.email || '',
          'user-id': userData._id || '',
        },
        credentials: 'include',
      })

      const data = await response.json()
      console.log('API Response:', data)

      if (data.success) {
        setOrders(data.data || [])
        console.log(`Successfully loaded ${data.count} orders`)
        
        if (data.count === 0) {
          toast({
            title: "No orders found",
            description: "You haven't placed any orders yet.",
          })
        }
      } else {
        console.error('API Error:', data.message)
        toast({
          title: "Error loading orders",
          description: data.message || "Failed to load orders",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Fetch error:', error)
      toast({
        title: "Network Error",
        description: "Failed to connect to server. Please check your connection.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    if (typeof price === 'object' && price.$numberDouble) {
      return `Rs. ${parseFloat(price.$numberDouble).toFixed(0)}`
    }
    return `Rs. ${(price || 0).toFixed(0)}`
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    
    // Handle MongoDB date format
    if (typeof dateString === 'object' && dateString.$date) {
      dateString = dateString.$date.$numberLong || dateString.$date
    }
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    const statusColors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'processing': 'bg-purple-100 text-purple-800',
      'shipped': 'bg-indigo-100 text-indigo-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'refunded': 'bg-gray-100 text-gray-800'
    }
    return statusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status) => {
    const statusIcons = {
      'pending': <Clock className="h-4 w-4" />,
      'confirmed': <CheckCircle className="h-4 w-4" />,
      'processing': <Package className="h-4 w-4" />,
      'shipped': <Truck className="h-4 w-4" />,
      'delivered': <CheckCircle className="h-4 w-4" />,
      'cancelled': <AlertCircle className="h-4 w-4" />,
      'refunded': <AlertCircle className="h-4 w-4" />
    }
    return statusIcons[status?.toLowerCase()] || <Package className="h-4 w-4" />
  }

  const getPaymentStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'paid': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800',
      'refunded': 'bg-gray-100 text-gray-800'
    }
    return colors[status?.toLowerCase()] || 'bg-yellow-100 text-yellow-800'
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 container py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                    <Skeleton className="h-6 w-24" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Orders</h1>
              <p className="text-muted-foreground">
                Track and manage your orders
              </p>
            </div>
            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>

          {/* User Info */}
          {user && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {user.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-900">{user.name}</p>
                    <p className="text-sm text-blue-700">{user.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Debug Info */}
          {process.env.NODE_ENV === 'development' && (
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-4">
                <p className="text-xs text-gray-600">
                  Debug: Loaded {orders.length} orders for user {user?.email}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Orders */}
          {orders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-6">
                  When you place orders, they'll appear here
                </p>
                <Button asChild>
                  <Link href="/products">Start Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {orders.length} order{orders.length !== 1 ? 's' : ''} found
                </p>
              </div>

              {orders.map((order) => (
                <Card key={order._id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            Order #{order.orderNumber || order._id?.slice(-6)?.toUpperCase()}
                          </h3>
                          <Badge className={getStatusColor(order.orderStatus)}>
                            {getStatusIcon(order.orderStatus)}
                            <span className="ml-1 capitalize">{order.orderStatus}</span>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(order.orderDate || order.createdAt)}</span>
                          </div>
                          {order.trackingNumber && (
                            <div className="flex items-center gap-1">
                              <Truck className="h-4 w-4" />
                              <span>Tracking: {order.trackingNumber}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="text-2xl font-bold">
                          {formatPrice(order.pricing?.total || order.total)}
                        </div>
                        <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                          Payment: {order.paymentStatus || 'Pending'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    {/* Order Items */}
                    <div className="space-y-3 mb-6">
                      <h4 className="font-medium">Items ({order.items?.length || 0})</h4>
                      <div className="space-y-2">
                        {order.items?.map((item, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="h-12 w-12 rounded border overflow-hidden">
                              <img
                                src={item.image || `https://via.placeholder.com/100?text=${encodeURIComponent(item.name)}`}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-sm">{item.name}</h5>
                              <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity} × {formatPrice(item.price)}
                              </p>
                            </div>
                            <span className="font-medium">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Order Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Shipping Address */}
                      <div className="space-y-3">
                        <h4 className="font-medium flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Shipping Address
                        </h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>{order.customer?.firstName} {order.customer?.lastName}</p>
                          <p>{order.address?.street}</p>
                          <p>{order.address?.city}, {order.address?.postalCode}</p>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-3">
                        <h4 className="font-medium">Contact Information</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{order.customer?.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{order.customer?.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>{formatPrice(order.pricing?.subtotal || order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping:</span>
                          <span>
                            {(order.pricing?.shipping || order.shipping) === 0 ? 
                              "Free" : 
                              formatPrice(order.pricing?.shipping || order.shipping)
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax:</span>
                          <span>{formatPrice(order.pricing?.tax || order.tax)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold">
                          <span>Total:</span>
                          <span>{formatPrice(order.pricing?.total || order.total)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Notes */}
                    {order.notes && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-sm mb-2">Delivery Notes:</h4>
                        <p className="text-sm text-muted-foreground">{order.notes}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 mt-6">
                      <Button variant="outline" asChild>
                        <Link href={`/track-order?tracking=${order.trackingNumber || order._id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Track Order
                        </Link>
                      </Button>
                      
                      {order.orderStatus === 'delivered' && (
                        <Button variant="outline">
                          <Package className="h-4 w-4 mr-2" />
                          Reorder Items
                        </Button>
                      )}
                      
                      {['pending', 'confirmed'].includes(order.orderStatus?.toLowerCase()) && (
                        <Button variant="outline" className="text-red-600 hover:text-red-700">
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Additional Info */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Need help with your order? Contact our customer support team or visit our help center.
            </AlertDescription>
          </Alert>
        </div>
      </main>
      <Footer />
    </div>
  )
}