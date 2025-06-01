// app/track-order/page.jsx
"use client";

import { useState } from "react";
import { Search, Package, Clock, Truck, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import axios from "axios";

export default function TrackOrderPage() {
  const [searchQuery, setSearchQuery] = useState(""); // Changed from orderId
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const trackOrder = async () => {
    // Check if at least one field is filled
    if (!searchQuery.trim() && !email.trim()) {
      setError("Please enter either Order ID/Tracking Number or Email Address (or both)");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      let response;
      
      // Case 1: Only email provided
      if (!searchQuery.trim() && email.trim()) {
        response = await axios.get(`/api/orders?email=${email}`);
        if (response.data.success && response.data.data.orders.length > 0) {
          // If multiple orders, get the most recent one
          const orders = response.data.data.orders;
          response.data.data = orders[0]; // Most recent order (sorted by date desc)
        }
      }
      // Case 2: Only Order ID/Tracking Number provided
      else if (searchQuery.trim() && !email.trim()) {
        // Try different search methods based on query format
        if (searchQuery.length === 24) {
          // Full MongoDB ObjectId
          response = await axios.get(`/api/orders/${searchQuery}`);
        } else if (searchQuery.length === 6) {
          // Short Order ID
          response = await axios.get(`/api/orders?search=${searchQuery}`);
          if (response.data.success && response.data.data.orders.length > 0) {
            response.data.data = response.data.data.orders[0];
          }
        } else {
          // Assume it's a tracking number
          response = await axios.get(`/api/orders?trackingNumber=${searchQuery}`);
          if (response.data.success && response.data.data.orders.length > 0) {
            response.data.data = response.data.data.orders[0];
          }
        }
      }
      // Case 3: Both provided (original logic for more specific search)
      else {
        if (searchQuery.length === 24 || searchQuery.length === 6) {
          try {
            if (searchQuery.length === 24) {
              response = await axios.get(`/api/orders/${searchQuery}`);
            } else {
              response = await axios.get(`/api/orders?search=${searchQuery}&email=${email}`);
              if (response.data.success && response.data.data.orders.length > 0) {
                response.data.data = response.data.data.orders[0];
              }
            }
          } catch (err) {
            // If order ID search fails, try tracking number
            response = await axios.get(`/api/orders?trackingNumber=${searchQuery}&email=${email}`);
            if (response.data.success && response.data.data.orders.length > 0) {
              response.data.data = response.data.data.orders[0];
            }
          }
        } else {
          // Search by tracking number with email verification
          response = await axios.get(`/api/orders?trackingNumber=${searchQuery}&email=${email}`);
          if (response.data.success && response.data.data.orders.length > 0) {
            response.data.data = response.data.data.orders[0];
          }
        }
      }
      
      if (response.data.success && response.data.data) {
        const orderData = response.data.data;
        
        // If email was provided, verify it matches (for security)
        if (email.trim() && orderData.customer.email.toLowerCase() !== email.toLowerCase()) {
          setError("Order not found or email doesn't match");
          return;
        }
        
        setOrder(orderData);
      } else {
        setError("Order not found. Please check your details and try again.");
      }
    } catch (error) {
      console.error("Error tracking order:", error);
      setError("Order not found. Please check your details and try again.");
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
      confirmed: <Clock className="h-4 w-4" />,
      processing: <Package className="h-4 w-4" />,
      shipped: <Truck className="h-4 w-4" />,
      delivered: <CheckCircle className="h-4 w-4" />,
      cancelled: <XCircle className="h-4 w-4" />
    };
    return icons[status] || <Package className="h-4 w-4" />;
  };

  const getStatusSteps = () => {
    const steps = [
      { key: 'confirmed', label: 'Order Confirmed', icon: <Clock className="h-4 w-4" /> },
      { key: 'processing', label: 'Processing', icon: <Package className="h-4 w-4" /> },
      { key: 'shipped', label: 'Shipped', icon: <Truck className="h-4 w-4" /> },
      { key: 'delivered', label: 'Delivered', icon: <CheckCircle className="h-4 w-4" /> }
    ];

    const currentStatusIndex = steps.findIndex(step => step.key === order?.orderStatus);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentStatusIndex && order?.orderStatus !== 'cancelled',
      active: index === currentStatusIndex,
      cancelled: order?.orderStatus === 'cancelled'
    }));
  };

  const formatPrice = (price) => `Rs. ${price.toFixed(0)}`;
  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
            <p className="text-muted-foreground">Enter your order details to track your package</p>
          </div>

          {/* Search Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Order Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Order ID or Tracking Number</label>
                  <Input
                    placeholder="Enter Order ID (e.g., ABC123) or Tracking Number (e.g., TCF12345)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Optional - You can search with just this field
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Optional - You can search with just this field
                  </p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-blue-800">
                  💡 <strong>Flexible Search:</strong> You can track your order using:
                </p>
                <ul className="text-xs text-blue-700 mt-1 ml-4 list-disc">
                  <li>Just your email address (shows your most recent order)</li>
                  <li>Just your Order ID or Tracking Number</li>
                  <li>Both for more specific results</li>
                </ul>
              </div>
              
              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <Button 
                onClick={trackOrder} 
                disabled={loading}
                className="w-full md:w-auto"
              >
                {loading ? "Tracking..." : "Track Order"}
              </Button>
            </CardContent>
          </Card>

          {/* Order Details */}
          {order && (
            <div className="space-y-6">
              {/* Order Status */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Order #{order._id.slice(-6).toUpperCase()}</CardTitle>
                      {order.trackingNumber && (
                        <p className="text-sm text-blue-600 font-mono mt-1">
                          Tracking: {order.trackingNumber}
                        </p>
                      )}
                    </div>
                    <Badge className={getStatusColor(order.orderStatus)}>
                      {getStatusIcon(order.orderStatus)}
                      <span className="ml-1 capitalize">{order.orderStatus}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Order placed on {formatDate(order.orderDate)}
                  </p>
                </CardHeader>
                <CardContent>
                  {/* Status Timeline */}
                  {order.orderStatus !== 'cancelled' ? (
                    <div className="flex items-center justify-between mb-6">
                      {getStatusSteps().map((step, index) => (
                        <div key={step.key} className="flex flex-col items-center flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step.completed ? 'bg-green-500 text-white' : 
                            step.active ? 'bg-blue-500 text-white' : 
                            'bg-gray-200 text-gray-500'
                          }`}>
                            {step.icon}
                          </div>
                          <p className={`text-xs mt-2 text-center ${
                            step.completed || step.active ? 'text-black font-medium' : 'text-gray-500'
                          }`}>
                            {step.label}
                          </p>
                          {index < getStatusSteps().length - 1 && (
                            <div className={`absolute h-0.5 w-full mt-5 ${
                              step.completed ? 'bg-green-500' : 'bg-gray-200'
                            }`} style={{ 
                              left: '50%', 
                              right: '-50%',
                              zIndex: -1
                            }} />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-red-800 mb-2">Order Cancelled</h3>
                      <p className="text-red-600">This order has been cancelled.</p>
                    </div>
                  )}

                  {/* Delivery Info */}
                  {order.orderStatus === 'shipped' && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Truck className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-800">Out for Delivery</span>
                      </div>
                      <p className="text-sm text-blue-700">
                        Your order is on its way and will be delivered within 1-2 business days.
                      </p>
                      {order.trackingNumber && (
                        <p className="text-sm text-blue-700 mt-1">
                          Tracking Number: <strong>{order.trackingNumber}</strong>
                        </p>
                      )}
                    </div>
                  )}

                  {order.orderStatus === 'delivered' && order.deliveryDate && (
                    <div className="bg-green-50 p-4 rounded-lg mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-800">Delivered</span>
                      </div>
                      <p className="text-sm text-green-700">
                        Delivered on {formatDate(order.deliveryDate)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                        <img
                          src={item.image || `https://via.placeholder.com/80?text=${encodeURIComponent(item.name)}`}
                          alt={item.name}
                          className="h-16 w-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                          <p className="text-sm font-medium">
                            {formatPrice(item.price)} each
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatPrice(order.pricing.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>{order.pricing.shipping === 0 ? "Free" : formatPrice(order.pricing.shipping)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>{formatPrice(order.pricing.tax)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>{formatPrice(order.pricing.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <p className="font-medium">{order.customer.firstName} {order.customer.lastName}</p>
                    <p>{order.address.street}</p>
                    <p>{order.address.city} {order.address.postalCode}</p>
                    <p className="mt-2 text-muted-foreground">Phone: {order.customer.phone}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Notes */}
              {order.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Special Instructions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{order.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}