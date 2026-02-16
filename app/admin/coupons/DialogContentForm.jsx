"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@radix-ui/react-dialog";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

export default function DialogContentForm({
  formData,
  isEditing,
  categories,
  products,
  selectedCategoryId,
  setSelectedCategoryId,
  setFormData,
  setIsDialogOpen,
  setCoupons,
  setTotalPages,
  currentPage,
  searchQuery,
  typeFilter,
  statusFilter,
}) {
  const itemsPerPage = 10;

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    },
    [formData, setFormData]
  );

  const handleCheckboxChange = useCallback(
    (name, checked) => {
      setFormData({ ...formData, [name]: checked });
    },
    [formData, setFormData]
  );

  const handleRadioChange = useCallback(
    (name, value) => {
      setFormData({
        ...formData,
        [name]: value,
        categories: value === "category" ? formData.categories : [],
        products: value === "products" ? formData.products : [],
      });
    },
    [formData, setFormData]
  );

  const handleCategoryChange = useCallback(
    (categoryId, checked) => {
      if (checked) {
        setFormData({
          ...formData,
          categories: [...formData.categories, categoryId],
        });
        setSelectedCategoryId(categoryId);
      } else {
        setFormData({
          ...formData,
          categories: formData.categories.filter((id) => id !== categoryId),
          products: formData.products.filter((pid) => {
            const product = products.find((p) => p._id === pid);
            return product && product.category?._id !== categoryId;
          }),
        });
        if (selectedCategoryId === categoryId) {
          setSelectedCategoryId(null);
        }
      }
    },
    [formData, products, selectedCategoryId, setFormData, setSelectedCategoryId]
  );

  const handleProductChange = useCallback(
    (productId, checked) => {
      if (checked) {
        setFormData({
          ...formData,
          products: [...formData.products, productId],
        });
      } else {
        setFormData({
          ...formData,
          products: formData.products.filter((id) => id !== productId),
        });
      }
    },
    [formData, setFormData]
  );

  const generateRandomCode = useCallback(() => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setFormData({ ...formData, code: result });
  }, [formData, setFormData]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!formData.code || !formData.value || !formData.startDate || !formData.endDate) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      if (formData.appliesTo === "category" && !formData.categories.length) {
        toast({
          title: "Missing Categories",
          description: "Please select at least one category",
          variant: "destructive",
        });
        return;
      }

      if (formData.appliesTo === "products" && !formData.products.length) {
        toast({
          title: "Missing Products",
          description: "Please select at least one product",
          variant: "destructive",
        });
        return;
      }

      try {
        const payload = {
          ...formData,
          value: parseFloat(formData.value) || 0,
          minPurchase: parseFloat(formData.minPurchase) || 0,
          maxUses: parseInt(formData.maxUses) || 0,
          usesPerCustomer: parseInt(formData.usesPerCustomer) || 1,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
        };

        let response;
        if (isEditing) {
          response = await axios.put(`/api/admin/coupons?id=${formData._id}`, payload, {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`,
            },
          });
        } else {
          response = await axios.post("/api/admin/coupons", payload, {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`,
            },
          });
        }
        if (response.data.success) {
          toast({
            title: isEditing ? "Coupon Updated" : "Coupon Created",
            description: `Coupon code ${formData.code} has been ${isEditing ? "updated" : "created"} successfully`,
          });
          setIsDialogOpen(false);
          setFormData({
            code: "",
            type: "percentage",
            value: "",
            appliesTo: "all",
            categories: [],
            products: [],
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
          const fetchResponse = await axios.get("/api/admin/coupons", {
            params: { page: currentPage, limit: itemsPerPage, keyword: searchQuery, type: typeFilter, status: statusFilter },
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`,
            },
          });
          if (fetchResponse.data.success) {
            setCoupons(fetchResponse.data.data.coupons);
            setTotalPages(fetchResponse.data.data.pages);
          }
        } else {
          toast({
            title: "Error",
            description: response.data.message || "Failed to save coupon",
            variant: "destructive",
          });
        }
      } catch (err) {
        const message = err.response?.data?.message || "Error saving coupon";
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      }
    },
    [
      formData,
      isEditing,
      setFormData,
      setIsDialogOpen,
      currentPage,
      searchQuery,
      typeFilter,
      statusFilter,
      setCoupons,
      setTotalPages,
    ]
  );

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Coupon" : "Add Coupon"}</DialogTitle>
        <DialogDescription>
          {isEditing ? "Update the coupon details below." : "Fill in the details to create a new coupon code."}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="usage">Usage Restrictions</TabsTrigger>
            <TabsTrigger value="limits">Limits</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 py-4">
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
                  <Label htmlFor="percentage" className="font-normal">Percentage</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fixed" id="fixed" />
                  <Label htmlFor="fixed" className="font-normal">Fixed Amount</Label>
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
                  <Label htmlFor="active" className="font-normal">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="scheduled" id="scheduled" />
                  <Label htmlFor="scheduled" className="font-normal">Scheduled</Label>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>

          <TabsContent value="usage" className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Applies To</Label>
              <RadioGroup
                className="col-span-3 flex gap-4"
                value={formData.appliesTo}
                onValueChange={(value) => handleRadioChange("appliesTo", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all-products" />
                  <Label htmlFor="all-products" className="font-normal">All Products</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="category" id="specific-category" />
                  <Label htmlFor="specific-category" className="font-normal">Specific Categories</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="products" id="specific-products" />
                  <Label htmlFor="specific-products" className="font-normal">Specific Products</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.appliesTo === "category" && (
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Categories</Label>
                <div className="col-span-3 grid grid-cols-2 gap-2">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <div key={category._id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category._id}`}
                          checked={formData.categories.includes(category._id)}
                          onCheckedChange={(checked) => handleCategoryChange(category._id, checked)}
                        />
                        <Label htmlFor={`category-${category._id}`} className="font-normal">
                          {category.name} ({category.productCount})
                        </Label>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2">No categories found.</div>
                  )}
                </div>
              </div>
            )}

            {formData.appliesTo === "products" && (
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Products</Label>
                <div className="col-span-3 space-y-2">
                  <Select
                    value={selectedCategoryId || ""}
                    onValueChange={setSelectedCategoryId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {products.length > 0 ? (
                      products.map((product) => (
                        <div key={product._id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`product-${product._id}`}
                            checked={formData.products.includes(product._id)}
                            onCheckedChange={(checked) => handleProductChange(product._id, checked)}
                          />
                          <Label htmlFor={`product-${product._id}`} className="font-normal">
                            {product.name}
                          </Label>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2">No products found.</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Customer Groups</Label>
              <Select
                value={formData.customerGroups}
                onValueChange={(value) => handleRadioChange("customerGroups", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select customer group" />
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
                <Label htmlFor="excludeSaleItems" className="font-normal">
                  Don’t apply to products on sale
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
                <Label htmlFor="individualUse" className="font-normal">
                  Cannot be combined with other coupons
                </Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="limits" className="space-y-4 py-4">
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

        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button type="submit">{isEditing ? "Update" : "Create"}</Button>
        </DialogFooter>
      </form>
    </>
  );
}