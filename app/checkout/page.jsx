// app/checkout/page.jsx
"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, Truck, CreditCard, MapPin, User, Phone, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart, cartCount } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [orderTrackingNumber, setOrderTrackingNumber] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Redirect if cart is empty
  if (cartCount === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-4">Add some items to your cart before checkout</p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 100;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  const formatPrice = (price) => `Rs. ${price.toFixed(0)}`;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city'];
    const missing = required.filter(field => !formData[field].trim());
    
    if (missing.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in: ${missing.join(', ')}`,
        variant: "destructive"
      });
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return false;
    }

    // Phone validation (Pakistan format)
    const phoneRegex = /^(\+92|0)?[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid Pakistani phone number",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Prepare order data
      const orderData = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          username: "unregistered user" // As requested, since no auth system
        },
        address: {
          street: formData.address,
          city: formData.city,
          postalCode: formData.postalCode || "N/A"
        },
        items: cartItems.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.images?.[0] || null
        })),
        pricing: {
          subtotal: subtotal,
          shipping: shipping,
          tax: tax,
          total: total
        },
        paymentMethod: paymentMethod,
        paymentStatus: "pending",
        orderStatus: "confirmed",
        notes: formData.notes || "",
        orderDate: new Date().toISOString()
      };

      console.log("Placing order:", orderData);

      // Make API call to create order
      const response = await axios.post("/api/orders", orderData);

      if (response.data.success) {
        setOrderId(response.data.data._id);
        setOrderTrackingNumber(response.data.data.trackingNumber);
        setOrderPlaced(true);
        clearCart();
        
        toast({
          title: "Order Placed Successfully!",
          description: `Your order #${response.data.data._id.slice(-6)} has been confirmed.`
        });
      } else {
        throw new Error(response.data.message || "Failed to place order");
      }

    } catch (error) {
      console.error("Order placement error:", error);
      toast({
        title: "Order Failed",
        description: error.response?.data?.message || "Failed to place order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Order success page
  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center max-w-lg mx-auto p-8">
          <CheckCircle className="h-20 w-20 mx-auto text-green-500 mb-6" />
          <h1 className="text-4xl font-bold text-green-800 mb-4">Order Confirmed!</h1>
          <p className="text-green-700 mb-6 text-lg">
            Thank you for your order! Your order has been confirmed and we'll start processing it soon.
          </p>
          
          {/* Large Order ID and Tracking Number for easy copying */}
          <div className="bg-white rounded-lg p-6 mb-6 border-2 border-green-200">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Order ID</p>
                <div className="bg-gray-100 p-3 rounded-md border">
                  <p className="text-2xl font-mono font-bold text-gray-800 select-all">
                    #{orderId?.slice(-6).toUpperCase()}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
                <div className="bg-gray-100 p-3 rounded-md border">
                  <p className="text-xl font-mono font-bold text-blue-800 select-all">
                    {orderTrackingNumber || 'Generating...'}
                  </p>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                📋 Tap to select and copy these numbers for tracking your order
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold mb-3 text-center">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-semibold">Cash on Delivery</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Delivery:</span>
                <span className="font-semibold">2-3 business days</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full" size="lg">
              <Link href="/track-order">Track Your Order</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/products">Continue Shopping</Link>
            </Button>
            <Button variant="ghost" asChild className="w-full">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 mt-4">
            You can track your order using either your Order ID or Tracking Number along with your email address.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/cart">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter first name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="03XX-XXXXXXX"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter complete address"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Enter city"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="Optional"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Delivery Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Special instructions for delivery (optional)"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer">
                      <Truck className="h-4 w-4" />
                      Cash on Delivery
                    </Label>
                  </div>
                </RadioGroup>
                <p className="text-sm text-muted-foreground mt-2">
                  Pay when your order is delivered to your doorstep.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded border overflow-hidden">
                        <img
                          src={item.images?.[0] || `https://via.placeholder.com/200?text=${encodeURIComponent(item.name)}`}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
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

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (7%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Place Order"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By placing this order, you agree to our terms and conditions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}