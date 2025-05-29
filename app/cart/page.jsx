// app/cart/page.jsx
"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import MainNav from "@/components/main-nav";
import Footer from "@/components/footer";

export default function CartPage() {
  const { cartItems, updateQuantity, removeItem, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const applyPromoCode = () => {
    if (!promoCode) return;

    setIsApplyingPromo(true);
    setTimeout(() => {
      setIsApplyingPromo(false);
      toast({
        title: "Invalid promo code",
        description: "The promo code you entered is invalid or expired",
        variant: "destructive",
      });
    }, 1000);
  };

  // REMOVED the handleCheckout function that was clearing the cart

  const formatPrice = (price) => `Rs. ${price.toFixed(0)}`;

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 100;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
          <h1 className="mb-6 text-3xl font-bold">Your Cart</h1>

          {cartItems.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <div className="rounded-lg border">
                  <div className="p-6">
                    <div className="hidden border-b pb-4 md:grid md:grid-cols-6">
                      <div className="col-span-3 font-medium">Product</div>
                      <div className="font-medium">Price</div>
                      <div className="font-medium">Quantity</div>
                      <div className="text-right font-medium">Total</div>
                    </div>
                    <div className="divide-y">
                      {cartItems.map((item) => (
                        <div key={item._id} className="py-4">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-6">
                            <div className="col-span-3 flex items-center gap-4">
                              <div className="h-20 w-20 overflow-hidden rounded-md border">
                                <img
                                  src={item.images?.[0] || `https://via.placeholder.com/200?text=${encodeURIComponent(item.name)}`}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <h3 className="font-medium">
                                  <Link href={`/products/${item._id}`} className="hover:underline">
                                    {item.name}
                                  </Link>
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground md:hidden">
                                  {formatPrice(item.price)}
                                </p>
                              </div>
                            </div>
                            <div className="hidden items-center md:flex">{formatPrice(item.price)}</div>
                            <div className="flex items-center">
                              <div className="flex items-center">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 rounded-r-none"
                                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                  <span className="sr-only">Decrease quantity</span>
                                </Button>
                                <div className="flex h-8 w-12 items-center justify-center border-y">
                                  {item.quantity}
                                </div>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 rounded-l-none"
                                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                  <span className="sr-only">Increase quantity</span>
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="ml-2 h-8 w-8 text-muted-foreground"
                                onClick={() => {
                                  removeItem(item._id);
                                  toast({
                                    title: "Item Removed",
                                    description: `${item.name} has been removed from your cart.`,
                                  });
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove item</span>
                              </Button>
                            </div>
                            <div className="flex items-center justify-between md:justify-end">
                              <span className="font-medium md:hidden">Total:</span>
                              <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-1 items-center gap-2">
                    <Input
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="max-w-[200px]"
                    />
                    <Button variant="outline" onClick={applyPromoCode} disabled={isApplyingPromo || !promoCode}>
                      {isApplyingPromo ? "Applying..." : "Apply"}
                    </Button>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href="/products">Continue Shopping</Link>
                  </Button>
                </div>
              </div>

              <div>
                <div className="rounded-lg border">
                  <div className="p-6">
                    <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>{formatPrice(tax)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                      </div>
                    </div>
                    {/* Fixed: Using Link component properly for navigation */}
                    <Link href="/checkout" className="block mt-6">
                      <Button className="w-full" size="lg">
                        Proceed to Checkout
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <div className="mt-4 text-center text-xs text-muted-foreground">
                      Taxes and shipping calculated at checkout
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-lg border p-6">
                  <h3 className="font-medium">We Accept</h3>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                      Cash on Delivery
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Pay when your order is delivered to your doorstep
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <div className="rounded-full bg-muted p-6">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="mt-4 text-xl font-semibold">Your cart is empty</h2>
              <p className="mt-2 text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
              <Button className="mt-6" asChild>
                <Link href="/products">Start Shopping</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}