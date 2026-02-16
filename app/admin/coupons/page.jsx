"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Filter, Calendar, Percent, DollarSign, X } from "lucide-react";

export default function CouponManagement() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);
  
  // Pagination and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Form data
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    value: "",
    minPurchase: "",
    maxUses: "",
    usesPerCustomer: "1",
    startDate: "",
    endDate: "",
    status: "scheduled",
    excludeSaleItems: false,
    individualUse: true,
    description: "",
    customerGroups: "all",
  });

  // Toast notification function
  const toast = useCallback((message) => {
    console.log(message.title + ": " + message.description);
    alert(message.title + ": " + message.description);
  }, []);

  // Fetch coupons
  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        keyword: searchQuery,
        type: typeFilter,
        status: statusFilter,
      });

      const response = await fetch(`/api/admin/coupons?${params}`, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCoupons(data.data.coupons || []);
          setTotalPages(data.data.pages || 1);
        } else {
          toast({
            title: "Error",
            description: data.message || "Failed to fetch coupons",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch coupons",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive"
      });
    }
    setLoading(false);
  }, [currentPage, searchQuery, typeFilter, statusFilter, toast]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  // Handle form changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleCheckboxChange = useCallback((name, checked) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  }, []);

  const handleRadioChange = useCallback((name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const generateRandomCode = useCallback(() => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setFormData(prev => ({ ...prev, code: result }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    // Validation
    if (!formData.code || !formData.value || !formData.startDate || !formData.endDate) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields (Code, Value, Start Date, End Date).",
        variant: "destructive",
      });
      return;
    }

    const value = parseFloat(formData.value);
    if (isNaN(value) || (formData.type === "percentage" && (value < 0 || value > 100))) {
      toast({
        title: "Invalid Discount Value",
        description: formData.type === "percentage"
          ? "Percentage must be between 0 and 100."
          : "Discount amount must be a valid number.",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        ...formData,
        value,
        minPurchase: parseFloat(formData.minPurchase) || 0,
        maxUses: parseInt(formData.maxUses) || 0,
        usesPerCustomer: parseInt(formData.usesPerCustomer) || 1,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      };

      const url = isEditing 
        ? `/api/admin/coupons?id=${currentCoupon._id}`
        : "/api/admin/coupons";
      
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: isEditing ? "Coupon Updated" : "Coupon Created",
          description: `Coupon code ${formData.code} has been ${isEditing ? "updated" : "created"} successfully`,
        });
        setIsDialogOpen(false);
        resetForm();
        fetchCoupons();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to save coupon.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving coupon:", error);
      toast({
        title: "Error",
        description: "Error saving coupon.",
        variant: "destructive",
      });
    }
  }, [formData, isEditing, currentCoupon, toast, fetchCoupons]);

  // Handle delete
  const handleDelete = useCallback(async (couponId) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;

    try {
      const response = await fetch(`/api/admin/coupons?id=${couponId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Coupon Deleted",
          description: "Coupon has been deleted successfully",
        });
        fetchCoupons();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete coupon.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error deleting coupon.",
        variant: "destructive",
      });
    }
  }, [toast, fetchCoupons]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      code: "",
      type: "percentage",
      value: "",
      minPurchase: "",
      maxUses: "",
      usesPerCustomer: "1",
      startDate: "",
      endDate: "",
      status: "scheduled",
      excludeSaleItems: false,
      individualUse: true,
      description: "",
      customerGroups: "all",
    });
    setCurrentCoupon(null);
    setIsEditing(false);
  }, []);

  // Open edit dialog
  const openEditDialog = useCallback((coupon) => {
    setFormData({
      ...coupon,
      startDate: coupon.startDate?.split('T')[0] || '',
      endDate: coupon.endDate?.split('T')[0] || '',
      minPurchase: coupon.minPurchase?.toString() || '',
      maxUses: coupon.maxUses?.toString() || '',
      usesPerCustomer: coupon.usesPerCustomer?.toString() || '1',
      value: coupon.value?.toString() || '',
    });
    setCurrentCoupon(coupon);
    setIsEditing(true);
    setIsDialogOpen(true);
  }, []);

  // Open add dialog
  const openAddDialog = useCallback(() => {
    resetForm();
    setIsDialogOpen(true);
  }, [resetForm]);

  // Close dialog
  const closeDialog = useCallback(() => {
    setIsDialogOpen(false);
    resetForm();
  }, [resetForm]);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      scheduled: "bg-blue-100 text-blue-800",
      expired: "bg-red-100 text-red-800",
    };
    return (
      <Badge className={colors[status] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Coupon Management</h1>
          <p className="text-muted-foreground">Manage discount codes that apply to all products in your store</p>
        </div>
        <Button onClick={openAddDialog} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Coupon
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search coupons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button onClick={fetchCoupons} variant="outline" className="w-full">
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coupons List */}
      <Card>
        <CardHeader>
          <CardTitle>Coupons ({coupons.length})</CardTitle>
          <CardDescription>Manage discount codes that apply to all products in your store</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading coupons...</div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No coupons found. Create your first coupon to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {coupons.map((coupon) => (
                <div key={coupon._id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{coupon.code}</h3>
                        <StatusBadge status={coupon.status} />
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          {coupon.type === "percentage" ? (
                            <>
                              <Percent className="h-4 w-4" />
                              {coupon.value}% off
                            </>
                          ) : (
                            <>
                              <DollarSign className="h-4 w-4" />
                              ${coupon.value} off
                            </>
                          )}
                        </div>
                      </div>
                      {coupon.description && (
                        <p className="text-sm text-muted-foreground">{coupon.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(coupon.startDate).toLocaleDateString()} - {new Date(coupon.endDate).toLocaleDateString()}
                        </div>
                        <div>
                          Used: {coupon.usedCount || 0}{coupon.maxUses ? ` / ${coupon.maxUses}` : ''}
                        </div>
                        <div>Applies to: All Products</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(coupon)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(coupon._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Modal Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50" 
            onClick={closeDialog}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-lg font-semibold">
                  {isEditing ? "Edit Coupon" : "Add New Coupon"}
                </h2>
                <p className="text-sm text-gray-600">
                  {isEditing ? "Update the coupon details below." : "Fill in the details to create a new coupon code."}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={closeDialog}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="limits">Limits & Options</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Applies To</Label>
                    <div className="col-span-3 p-3 bg-blue-50 rounded-md border">
                      <p className="text-sm text-blue-800">
                        ✓ This coupon will apply to <strong>all products</strong> in your store
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="code" className="text-right">Code</Label>
                    <div className="col-span-3 flex gap-2">
                      <Input
                        id="code"
                        name="code"
                        placeholder="SUMMER20"
                        className="flex-1"
                        value={formData.code}
                        onChange={handleChange}
                        required
                      />
                      <Button type="button" variant="outline" onClick={generateRandomCode}>
                        Generate
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Coupon description for internal use"
                      className="col-span-3"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Discount Type</Label>
                    <RadioGroup
                      className="col-span-3 flex gap-4"
                      value={formData.type}
                      onValueChange={(value) => handleRadioChange("type", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="percentage" id="percentage" />
                        <Label htmlFor="percentage">Percentage</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fixed" id="fixed" />
                        <Label htmlFor="fixed">Fixed Amount</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="value" className="text-right">
                      {formData.type === "percentage" ? "Percentage" : "Amount"}
                    </Label>
                    <div className="col-span-3 relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">
                        {formData.type === "percentage" ? "%" : "$"}
                      </span>
                      <Input
                        id="value"
                        name="value"
                        type="number"
                        min="0"
                        step={formData.type === "percentage" ? "1" : "0.01"}
                        max={formData.type === "percentage" ? "100" : undefined}
                        placeholder={formData.type === "percentage" ? "20" : "10.00"}
                        className="pl-7"
                        value={formData.value}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startDate" className="text-right">Start Date</Label>
                    <Input
                      type="date"
                      id="startDate"
                      name="startDate"
                      className="col-span-3"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endDate" className="text-right">End Date</Label>
                    <Input
                      type="date"
                      id="endDate"
                      name="endDate"
                      className="col-span-3"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Status</Label>
                    <RadioGroup
                      className="col-span-3 flex gap-4"
                      value={formData.status}
                      onValueChange={(value) => handleRadioChange("status", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="active" id="active" />
                        <Label htmlFor="active">Active</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="scheduled" id="scheduled" />
                        <Label htmlFor="scheduled">Scheduled</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </TabsContent>

                <TabsContent value="limits" className="space-y-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Customer Groups</Label>
                    <Select
                      value={formData.customerGroups}
                      onValueChange={(value) => handleRadioChange("customerGroups", value)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Customers</SelectItem>
                        <SelectItem value="new">New Customers</SelectItem>
                        <SelectItem value="returning">Returning Customers</SelectItem>
                        <SelectItem value="vip">VIP Customers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Exclude Sale Items</Label>
                    <div className="col-span-3 flex items-center space-x-2">
                      <Switch
                        id="excludeSaleItems"
                        checked={formData.excludeSaleItems}
                        onCheckedChange={(checked) => handleCheckboxChange("excludeSaleItems", checked)}
                      />
                      <Label htmlFor="excludeSaleItems">
                        Don't apply to products on sale
                      </Label>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Individual Use</Label>
                    <div className="col-span-3 flex items-center space-x-2">
                      <Switch
                        id="individualUse"
                        checked={formData.individualUse}
                        onCheckedChange={(checked) => handleCheckboxChange("individualUse", checked)}
                      />
                      <Label htmlFor="individualUse">
                        Cannot be combined with other coupons
                      </Label>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="minPurchase" className="text-right">Minimum Purchase</Label>
                    <div className="col-span-3 relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                      <Input
                        id="minPurchase"
                        name="minPurchase"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-7"
                        value={formData.minPurchase}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="maxUses" className="text-right">Usage Limit</Label>
                    <Input
                      id="maxUses"
                      name="maxUses"
                      type="number"
                      min="0"
                      placeholder="No limit"
                      className="col-span-3"
                      value={formData.maxUses}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="usesPerCustomer" className="text-right">Limit Per Customer</Label>
                    <Input
                      id="usesPerCustomer"
                      name="usesPerCustomer"
                      type="number"
                      min="0"
                      placeholder="1"
                      className="col-span-3"
                      value={formData.usesPerCustomer}
                      onChange={handleChange}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 p-6 border-t">
              <Button variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {isEditing ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}