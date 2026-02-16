"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, Truck, CreditCard, MapPin, User, Phone, Mail, CheckCircle, Check, X } from "lucide-react";
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
  const [currentUser, setCurrentUser] = useState(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  // Coupon state
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);

  const [formErrors, setFormErrors] = useState({});

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

  // Check if user is logged in on component mount
  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        
        // Pre-fill form with user data if available
        setFormData(prev => ({
          ...prev,
          firstName: user.name?.split(' ')[0] || '',
          lastName: user.name?.split(' ').slice(1).join(' ') || '',
          email: user.email || '',
          phone: user.phone || '',
        }));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsUserLoaded(true);
    }
  }, []);

  // Coupon functions
  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;

    setIsApplyingPromo(true);
    
    try {
      const response = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          couponCode: promoCode.toUpperCase(),
          cartTotal: subtotal,
          customerGroup: currentUser?.role || 'all',
          hasOnSaleItems: false
        }),
      });

      const data = await response.json();
      
      if (data.success && data.valid) {
        setAppliedCoupon(data.coupon);
        setDiscount(data.discount);
        toast({
          title: "Coupon Applied!",
          description: `${data.coupon.code} - Save ${data.coupon.type === 'percentage' ? `${data.coupon.value}%` : `Rs. ${data.coupon.value}`}`,
        });
      } else {
        toast({
          title: "Invalid Coupon",
          description: data.error || "The coupon code is invalid or expired",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Coupon validation error:', error);
      toast({
        title: "Error",
        description: "Failed to validate coupon. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsApplyingPromo(false);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setPromoCode("");
    toast({
      title: "Coupon Removed",
      description: "Coupon has been removed from your order",
    });
  };

  // Apply coupon usage when order is placed
  const applyCouponUsage = async (couponId) => {
    try {
      await fetch(`/api/admin/coupons?id=${couponId}&action=use`, {
        method: 'PATCH',
      });
    } catch (error) {
      console.error('Error applying coupon usage:', error);
    }
  };

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
  const tax = (subtotal - discount) * 0.07;
  const total = subtotal + shipping + tax - discount;

  const formatPrice = (price) => `Rs. ${price.toFixed(0)}`;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city'];
    const errors = {};
    
    // Check required fields
    required.forEach(field => {
      if (!formData[field].trim()) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Phone validation (Pakistan format)
    const phoneRegex = /^(\+92|0)?[0-9]{10}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
      errors.phone = "Please enter a valid Pakistani phone number";
    }

    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      toast({
        title: "Please fix the errors below",
        description: "Check the highlighted fields and try again",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    // Check minimum order amount
    if (total < 1000) {
      toast({
        title: "Minimum Order Required",
        description: "Your order total must be at least Rs. 1000 to proceed.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const customerData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      };

      if (currentUser) {
        customerData.userId = currentUser._id;
        customerData.username = currentUser.name;
        customerData.userRole = currentUser.role;
      } else {
        customerData.username = "unregistered user";
        customerData.userId = null;
      }

      const orderData = {
        customer: customerData,
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
          discount: discount,
          total: total
        },
        coupon: appliedCoupon ? {
          id: appliedCoupon.id,
          code: appliedCoupon.code,
          type: appliedCoupon.type,
          value: appliedCoupon.value,
          discountAmount: discount
        } : null,
        paymentMethod: paymentMethod,
        paymentStatus: "pending",
        orderStatus: "confirmed",
        notes: formData.notes || "",
        orderDate: new Date().toISOString(),
        isRegisteredUser: !!currentUser
      };

      console.log("Placing order:", orderData);

      const response = await axios.post("/api/orders", orderData, {
        withCredentials: true
      });

      if (response.data.success) {
        // Apply coupon usage if coupon was used
        if (appliedCoupon) {
          await applyCouponUsage(appliedCoupon.id);
        }

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
          
          {currentUser ? (
            <div className="bg-blue-100 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                Hi {currentUser.name}! Your order has been linked to your account. 
                You can track it in your profile under "My Orders".
              </p>
            </div>
          ) : (
            <div className="bg-yellow-100 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                Your order was placed as a guest. Create an account to track your orders easily!
              </p>
            </div>
          )}
          
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
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold mb-3 text-center">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span className="font-semibold">
                  {currentUser ? currentUser.name : `${formData.firstName} ${formData.lastName}`}
                </span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span className="text-gray-600">Coupon Applied:</span>
                  <span className="font-semibold">{appliedCoupon.code}</span>
                </div>
              )}
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
            {currentUser && (
              <Button variant="outline" asChild className="w-full">
                <Link href="/profile">View in My Orders</Link>
              </Button>
            )}
            <Button variant="outline" asChild className="w-full">
              <Link href="/products">Continue Shopping</Link>
            </Button>
            {!currentUser && (
              <Button variant="ghost" asChild className="w-full">
                <Link href="/register">Create Account</Link>
              </Button>
            )}
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

  // Show loading while checking user status
  if (!isUserLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
          <p>Loading checkout...</p>
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
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Checkout</h1>
            {currentUser ? (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <User className="h-4 w-4" />
                <span>Logged in as {currentUser.name}</span>
              </div>
            ) : (
              <div className="text-sm text-gray-600">
                <Link href="/login" className="text-blue-600 hover:underline">
                  Login
                </Link> to save this order to your account
              </div>
            )}
          </div>
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
                  {currentUser && (
                    <span className="text-sm font-normal text-green-600">(From your account)</span>
                  )}
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
                      className={formErrors.firstName ? "border-red-500" : ""}
                    />
                    {formErrors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>
                    )}
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
                      className={formErrors.lastName ? "border-red-500" : ""}
                    />
                    {formErrors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>
                    )}
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
                    readOnly={!!currentUser}
                    className={`${formErrors.email ? "border-red-500" : ""} ${currentUser ? "bg-gray-50" : ""}`}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                  )}
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
                    className={formErrors.phone ? "border-red-500" : ""}
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                  )}
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
                    className={formErrors.address ? "border-red-500" : ""}
                  />
                  {formErrors.address && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
                  )}
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
                      className={formErrors.city ? "border-red-500" : ""}
                    />
                    {formErrors.city && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
                    )}
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

                {/* Coupon Section */}
                <div className="space-y-3">
                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        onKeyPress={(e) => e.key === 'Enter' && applyPromoCode()}
                      />
                      <Button 
                        variant="outline" 
                        onClick={applyPromoCode} 
                        disabled={isApplyingPromo || !promoCode.trim()}
                        size="sm"
                      >
                        {isApplyingPromo ? "..." : "Apply"}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-green-800 font-medium">{appliedCoupon.code}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeCoupon}
                        className="h-6 w-6 p-0 text-green-600 hover:text-green-800"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
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

                {/* Minimum Order Warning */}
                {total < 1000 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-yellow-600" />
                      <span className="text-yellow-800 font-medium">
                        Minimum order: Rs. 1000 (Need Rs. {formatPrice(1000 - total)} more)
                      </span>
                    </div>
                  </div>
                )}

                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || total < 1000}
                >
                  {isProcessing ? "Processing..." : total < 1000 ? "Minimum Rs. 1000 Required" : "Place Order"}
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