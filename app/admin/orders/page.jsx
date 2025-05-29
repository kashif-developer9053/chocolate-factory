// app/admin/orders/page.jsx
"use client";

import { useState, useEffect } from "react";
import { Eye, Search, Filter, Download, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import axios from "axios";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/orders?limit=50");
      if (response.data.success) {
        const ordersData = response.data.data.orders;
        setOrders(ordersData);
        
        // Calculate stats
        const stats = ordersData.reduce((acc, order) => {
          acc.total++;
          acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
          return acc;
        }, { total: 0, confirmed: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 });
        
        setStats(stats);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    const icons = {
      confirmed: <Package className="h-3 w-3" />,
      processing: <Package className="h-3 w-3" />,
      shipped: <Truck className="h-3 w-3" />,
      delivered: <CheckCircle className="h-3 w-3" />,
      cancelled: <XCircle className="h-3 w-3" />
    };
    return icons[status] || <Package className="h-3 w-3" />;
  };

  const formatPrice = (price) => `Rs. ${price.toFixed(0)}`;
  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.orderStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.patch(`/api/orders/${orderId}`, {
        orderStatus: newStatus
      });
      
      if (response.data.success) {
        // Update local state
        setOrders(orders.map(order => 
          order._id === orderId 
            ? { ...order, orderStatus: newStatus }
            : order
        ));
        
        // Update selected order if it's the same
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
        }
        
        // Refresh stats
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Order Management</h1>
        <p className="text-muted-foreground">Manage and track all customer orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.confirmed}</p>
              <p className="text-sm text-muted-foreground">Confirmed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
              <p className="text-sm text-muted-foreground">Processing</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.shipped}</p>
              <p className="text-sm text-muted-foreground">Shipped</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
              <p className="text-sm text-muted-foreground">Delivered</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              <p className="text-sm text-muted-foreground">Cancelled</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer name, email, or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Order ID</th>
                  <th className="text-left p-2">Customer</th>
                  <th className="text-left p-2">Items</th>
                  <th className="text-left p-2">Total</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        #{order._id.slice(-6)}
                      </code>
                    </td>
                    <td className="p-2">
                      <div>
                        <p className="font-medium">
                          {order.customer.firstName} {order.customer.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                      </div>
                    </td>
                    <td className="p-2">
                      <span className="text-sm">
                        {order.items.reduce((total, item) => total + item.quantity, 0)} items
                      </span>
                    </td>
                    <td className="p-2">
                      <span className="font-medium">{formatPrice(order.pricing.total)}</span>
                    </td>
                    <td className="p-2">
                      <Badge className={getStatusColor(order.orderStatus)}>
                        {getStatusIcon(order.orderStatus)}
                        <span className="ml-1 capitalize">{order.orderStatus}</span>
                      </Badge>
                    </td>
                    <td className="p-2">
                      <span className="text-sm">{formatDate(order.orderDate)}</span>
                    </td>
                    <td className="p-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Order Details #{order._id.slice(-6)}</DialogTitle>
                          </DialogHeader>
                          {selectedOrder && (
                            <div className="space-y-6">
                              {/* Customer & Address */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <h3 className="font-semibold mb-2">Customer Information</h3>
                                  <div className="space-y-1 text-sm">
                                    <p><strong>Name:</strong> {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                                    <p><strong>Email:</strong> {selectedOrder.customer.email}</p>
                                    <p><strong>Phone:</strong> {selectedOrder.customer.phone}</p>
                                    <p><strong>Username:</strong> {selectedOrder.customer.username}</p>
                                  </div>
                                </div>
                                <div>
                                  <h3 className="font-semibold mb-2">Delivery Address</h3>
                                  <div className="space-y-1 text-sm">
                                    <p>{selectedOrder.address.street}</p>
                                    <p>{selectedOrder.address.city}</p>
                                    {selectedOrder.address.postalCode && (
                                      <p>Postal Code: {selectedOrder.address.postalCode}</p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <Separator />

                              {/* Order Items */}
                              <div>
                                <h3 className="font-semibold mb-3">Order Items</h3>
                                <div className="space-y-2">
                                  {selectedOrder.items.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 border rounded">
                                      <img
                                        src={item.image || `https://via.placeholder.com/60?text=${encodeURIComponent(item.name)}`}
                                        alt={item.name}
                                        className="h-12 w-12 object-cover rounded"
                                      />
                                      <div className="flex-1">
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                          {formatPrice(item.price)} × {item.quantity}
                                        </p>
                                      </div>
                                      <div className="font-medium">
                                        {formatPrice(item.price * item.quantity)}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <Separator />

                              {/* Pricing */}
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span>Subtotal:</span>
                                  <span>{formatPrice(selectedOrder.pricing.subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Shipping:</span>
                                  <span>{selectedOrder.pricing.shipping === 0 ? "Free" : formatPrice(selectedOrder.pricing.shipping)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Tax:</span>
                                  <span>{formatPrice(selectedOrder.pricing.tax)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                  <span>Total:</span>
                                  <span>{formatPrice(selectedOrder.pricing.total)}</span>
                                </div>
                              </div>

                              {/* Order Status Update */}
                              <div>
                                <h3 className="font-semibold mb-2">Update Order Status</h3>
                                <div className="flex gap-2">
                                  {['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                                    <Button
                                      key={status}
                                      variant={selectedOrder.orderStatus === status ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => updateOrderStatus(selectedOrder._id, status)}
                                      className="capitalize"
                                    >
                                      {status}
                                    </Button>
                                  ))}
                                </div>
                              </div>

                              {/* Notes */}
                              {selectedOrder.notes && (
                                <div>
                                  <h3 className="font-semibold mb-2">Customer Notes</h3>
                                  <p className="text-sm bg-gray-50 p-3 rounded">{selectedOrder.notes}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}