"use client"

import { useState } from "react"
import { Save, Upload, AlertTriangle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  // Mock settings data
  const [settings, setSettings] = useState({
    general: {
      storeName: "The Chocolate Factory",
      storeEmail: "info@chocolatefactory.com",
      storePhone: "+1 (555) 123-4567",
      storeAddress: "123 Cocoa Lane, Sweet City, CA 90210",
      storeCurrency: "USD",
      storeLanguage: "en",
      storeDescription: "Premium handcrafted chocolates and confections for every occasion.",
      enableMaintenanceMode: false,
    },
    appearance: {
      primaryColor: "#8B4513",
      secondaryColor: "#D2691E",
      accentColor: "#CD853F",
      logoUrl: "/images/logo.png",
      faviconUrl: "/favicon.ico",
      enableDarkMode: true,
      showFeaturedProducts: true,
      productsPerPage: 12,
    },
    shipping: {
      enableFreeShipping: true,
      freeShippingThreshold: 50,
      flatRateShipping: 5.99,
      enableLocalPickup: true,
      enableInternationalShipping: false,
      internationalShippingRate: 25.99,
      shippingOriginZip: "90210",
    },
    payment: {
      enableCreditCards: true,
      enablePayPal: true,
      enableApplePay: false,
      enableGooglePay: false,
      enableCashOnDelivery: false,
      testMode: true,
    },
    notifications: {
      orderConfirmation: true,
      orderShipped: true,
      orderDelivered: true,
      lowStockAlert: true,
      lowStockThreshold: 10,
      newsletterSignup: true,
      marketingEmails: false,
    },
    taxes: {
      enableAutomaticTax: true,
      taxRate: 8.25,
      includeTaxInPrice: false,
      enableTaxExemption: true,
    },
  })

  const handleSaveSettings = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Settings saved",
        description: "Your store settings have been updated successfully.",
      })
    }, 1500)
  }

  const handleInputChange = (section, field, value) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value,
      },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Store Settings</h1>
        <p className="text-muted-foreground">Manage your store settings and preferences</p>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="taxes">Taxes</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Basic information about your chocolate store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={settings.general.storeName}
                    onChange={(e) => handleInputChange("general", "storeName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Store Email</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={settings.general.storeEmail}
                    onChange={(e) => handleInputChange("general", "storeEmail", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Store Phone</Label>
                  <Input
                    id="storePhone"
                    value={settings.general.storePhone}
                    onChange={(e) => handleInputChange("general", "storePhone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeCurrency">Currency</Label>
                  <Select
                    value={settings.general.storeCurrency}
                    onValueChange={(value) => handleInputChange("general", "storeCurrency", value)}
                  >
                    <SelectTrigger id="storeCurrency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD (C$)</SelectItem>
                      <SelectItem value="AUD">AUD (A$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeLanguage">Language</Label>
                  <Select
                    value={settings.general.storeLanguage}
                    onValueChange={(value) => handleInputChange("general", "storeLanguage", value)}
                  >
                    <SelectTrigger id="storeLanguage">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="it">Italian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1 space-y-2 md:col-span-2">
                  <Label htmlFor="storeAddress">Store Address</Label>
                  <Textarea
                    id="storeAddress"
                    value={settings.general.storeAddress}
                    onChange={(e) => handleInputChange("general", "storeAddress", e.target.value)}
                  />
                </div>
                <div className="col-span-1 space-y-2 md:col-span-2">
                  <Label htmlFor="storeDescription">Store Description</Label>
                  <Textarea
                    id="storeDescription"
                    value={settings.general.storeDescription}
                    onChange={(e) => handleInputChange("general", "storeDescription", e.target.value)}
                  />
                </div>
                <div className="col-span-1 flex items-center space-x-2 md:col-span-2">
                  <Switch
                    id="enableMaintenanceMode"
                    checked={settings.general.enableMaintenanceMode}
                    onCheckedChange={(checked) => handleInputChange("general", "enableMaintenanceMode", checked)}
                  />
                  <Label htmlFor="enableMaintenanceMode">Enable Maintenance Mode</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset</Button>
              <Button onClick={handleSaveSettings} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin">...</span>
                    Saving
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Store Appearance</CardTitle>
              <CardDescription>Customize how your chocolate store looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      className="h-10 w-20"
                      value={settings.appearance.primaryColor}
                      onChange={(e) => handleInputChange("appearance", "primaryColor", e.target.value)}
                    />
                    <Input
                      value={settings.appearance.primaryColor}
                      className="flex-1"
                      onChange={(e) => handleInputChange("appearance", "primaryColor", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      className="h-10 w-20"
                      value={settings.appearance.secondaryColor}
                      onChange={(e) => handleInputChange("appearance", "secondaryColor", e.target.value)}
                    />
                    <Input
                      value={settings.appearance.secondaryColor}
                      className="flex-1"
                      onChange={(e) => handleInputChange("appearance", "secondaryColor", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      className="h-10 w-20"
                      value={settings.appearance.accentColor}
                      onChange={(e) => handleInputChange("appearance", "accentColor", e.target.value)}
                    />
                    <Input
                      value={settings.appearance.accentColor}
                      className="flex-1"
                      onChange={(e) => handleInputChange("appearance", "accentColor", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productsPerPage">Products Per Page</Label>
                  <Input
                    id="productsPerPage"
                    type="number"
                    min="4"
                    max="48"
                    value={settings.appearance.productsPerPage}
                    onChange={(e) =>
                      handleInputChange("appearance", "productsPerPage", Number.parseInt(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logoUpload">Store Logo</Label>
                  <div className="flex items-center gap-4">
                    <img
                      src={settings.appearance.logoUrl || "/placeholder.svg"}
                      alt="Store Logo"
                      className="h-12 w-auto rounded-md border"
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload New Logo
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faviconUpload">Favicon</Label>
                  <div className="flex items-center gap-4">
                    <img
                      src={settings.appearance.faviconUrl || "/placeholder.svg"}
                      alt="Favicon"
                      className="h-8 w-8 rounded-md border"
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload New Favicon
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableDarkMode"
                    checked={settings.appearance.enableDarkMode}
                    onCheckedChange={(checked) => handleInputChange("appearance", "enableDarkMode", checked)}
                  />
                  <Label htmlFor="enableDarkMode">Enable Dark Mode Toggle</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showFeaturedProducts"
                    checked={settings.appearance.showFeaturedProducts}
                    onCheckedChange={(checked) => handleInputChange("appearance", "showFeaturedProducts", checked)}
                  />
                  <Label htmlFor="showFeaturedProducts">Show Featured Products</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset</Button>
              <Button onClick={handleSaveSettings} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin">...</span>
                    Saving
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Options</CardTitle>
              <CardDescription>Configure shipping methods and rates for your chocolate products</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableFreeShipping"
                    checked={settings.shipping.enableFreeShipping}
                    onCheckedChange={(checked) => handleInputChange("shipping", "enableFreeShipping", checked)}
                  />
                  <Label htmlFor="enableFreeShipping">Enable Free Shipping</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="freeShippingThreshold">Free Shipping Threshold ($)</Label>
                  <Input
                    id="freeShippingThreshold"
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.shipping.freeShippingThreshold}
                    onChange={(e) =>
                      handleInputChange("shipping", "freeShippingThreshold", Number.parseFloat(e.target.value))
                    }
                    disabled={!settings.shipping.enableFreeShipping}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flatRateShipping">Flat Rate Shipping ($)</Label>
                  <Input
                    id="flatRateShipping"
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.shipping.flatRateShipping}
                    onChange={(e) =>
                      handleInputChange("shipping", "flatRateShipping", Number.parseFloat(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingOriginZip">Shipping Origin ZIP Code</Label>
                  <Input
                    id="shippingOriginZip"
                    value={settings.shipping.shippingOriginZip}
                    onChange={(e) => handleInputChange("shipping", "shippingOriginZip", e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableLocalPickup"
                    checked={settings.shipping.enableLocalPickup}
                    onCheckedChange={(checked) => handleInputChange("shipping", "enableLocalPickup", checked)}
                  />
                  <Label htmlFor="enableLocalPickup">Enable Local Pickup</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableInternationalShipping"
                    checked={settings.shipping.enableInternationalShipping}
                    onCheckedChange={(checked) => handleInputChange("shipping", "enableInternationalShipping", checked)}
                  />
                  <Label htmlFor="enableInternationalShipping">Enable International Shipping</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="internationalShippingRate">International Shipping Rate ($)</Label>
                  <Input
                    id="internationalShippingRate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.shipping.internationalShippingRate}
                    onChange={(e) =>
                      handleInputChange("shipping", "internationalShippingRate", Number.parseFloat(e.target.value))
                    }
                    disabled={!settings.shipping.enableInternationalShipping}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset</Button>
              <Button onClick={handleSaveSettings} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin">...</span>
                    Saving
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Configure payment options for your chocolate store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableCreditCards"
                    checked={settings.payment.enableCreditCards}
                    onCheckedChange={(checked) => handleInputChange("payment", "enableCreditCards", checked)}
                  />
                  <Label htmlFor="enableCreditCards">Accept Credit Cards</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enablePayPal"
                    checked={settings.payment.enablePayPal}
                    onCheckedChange={(checked) => handleInputChange("payment", "enablePayPal", checked)}
                  />
                  <Label htmlFor="enablePayPal">Accept PayPal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableApplePay"
                    checked={settings.payment.enableApplePay}
                    onCheckedChange={(checked) => handleInputChange("payment", "enableApplePay", checked)}
                  />
                  <Label htmlFor="enableApplePay">Accept Apple Pay</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableGooglePay"
                    checked={settings.payment.enableGooglePay}
                    onCheckedChange={(checked) => handleInputChange("payment", "enableGooglePay", checked)}
                  />
                  <Label htmlFor="enableGooglePay">Accept Google Pay</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableCashOnDelivery"
                    checked={settings.payment.enableCashOnDelivery}
                    onCheckedChange={(checked) => handleInputChange("payment", "enableCashOnDelivery", checked)}
                  />
                  <Label htmlFor="enableCashOnDelivery">Accept Cash on Delivery</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="testMode"
                    checked={settings.payment.testMode}
                    onCheckedChange={(checked) => handleInputChange("payment", "testMode", checked)}
                  />
                  <Label htmlFor="testMode">Payment Gateway Test Mode</Label>
                </div>
              </div>

              <div className="mt-6 rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/20">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Payment Gateway Notice</h3>
                    <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                      <p>
                        Payment gateway credentials should be configured in the environment settings for security
                        reasons. Contact your administrator to update payment gateway API keys.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset</Button>
              <Button onClick={handleSaveSettings} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin">...</span>
                    Saving
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure email and system notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="orderConfirmation"
                    checked={settings.notifications.orderConfirmation}
                    onCheckedChange={(checked) => handleInputChange("notifications", "orderConfirmation", checked)}
                  />
                  <Label htmlFor="orderConfirmation">Send Order Confirmation Emails</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="orderShipped"
                    checked={settings.notifications.orderShipped}
                    onCheckedChange={(checked) => handleInputChange("notifications", "orderShipped", checked)}
                  />
                  <Label htmlFor="orderShipped">Send Order Shipped Emails</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="orderDelivered"
                    checked={settings.notifications.orderDelivered}
                    onCheckedChange={(checked) => handleInputChange("notifications", "orderDelivered", checked)}
                  />
                  <Label htmlFor="orderDelivered">Send Order Delivered Emails</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="lowStockAlert"
                    checked={settings.notifications.lowStockAlert}
                    onCheckedChange={(checked) => handleInputChange("notifications", "lowStockAlert", checked)}
                  />
                  <Label htmlFor="lowStockAlert">Send Low Stock Alerts</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    min="1"
                    value={settings.notifications.lowStockThreshold}
                    onChange={(e) =>
                      handleInputChange("notifications", "lowStockThreshold", Number.parseInt(e.target.value))
                    }
                    disabled={!settings.notifications.lowStockAlert}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="newsletterSignup"
                    checked={settings.notifications.newsletterSignup}
                    onCheckedChange={(checked) => handleInputChange("notifications", "newsletterSignup", checked)}
                  />
                  <Label htmlFor="newsletterSignup">Send Newsletter Welcome Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="marketingEmails"
                    checked={settings.notifications.marketingEmails}
                    onCheckedChange={(checked) => handleInputChange("notifications", "marketingEmails", checked)}
                  />
                  <Label htmlFor="marketingEmails">Send Marketing Emails</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset</Button>
              <Button onClick={handleSaveSettings} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin">...</span>
                    Saving
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Taxes Settings */}
        <TabsContent value="taxes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tax Settings</CardTitle>
              <CardDescription>Configure tax rates and settings for your chocolate store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableAutomaticTax"
                    checked={settings.taxes.enableAutomaticTax}
                    onCheckedChange={(checked) => handleInputChange("taxes", "enableAutomaticTax", checked)}
                  />
                  <Label htmlFor="enableAutomaticTax">Enable Automatic Tax Calculation</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    min="0"
                    step="0.01"
                    max="100"
                    value={settings.taxes.taxRate}
                    onChange={(e) => handleInputChange("taxes", "taxRate", Number.parseFloat(e.target.value))}
                    disabled={settings.taxes.enableAutomaticTax}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="includeTaxInPrice"
                    checked={settings.taxes.includeTaxInPrice}
                    onCheckedChange={(checked) => handleInputChange("taxes", "includeTaxInPrice", checked)}
                  />
                  <Label htmlFor="includeTaxInPrice">Include Tax in Product Prices</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableTaxExemption"
                    checked={settings.taxes.enableTaxExemption}
                    onCheckedChange={(checked) => handleInputChange("taxes", "enableTaxExemption", checked)}
                  />
                  <Label htmlFor="enableTaxExemption">Enable Tax Exemption for Eligible Customers</Label>
                </div>
              </div>

              <div className="mt-6 rounded-md bg-green-50 p-4 dark:bg-green-900/20">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Tax Compliance</h3>
                    <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                      <p>
                        Your store is currently configured to collect and report taxes in accordance with local
                        regulations. Always consult with a tax professional to ensure full compliance with tax laws in
                        your jurisdiction.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset</Button>
              <Button onClick={handleSaveSettings} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin">...</span>
                    Saving
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
