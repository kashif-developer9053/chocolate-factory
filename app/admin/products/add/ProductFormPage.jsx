// /app/admin/products/_components/ProductForm.jsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, Plus, Save, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"
import axios from "axios"

export default function ProductForm({ id, isEditing }) {
  const router = useRouter()
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState([])
  const [images, setImages] = useState([null, null, null, null]) // 4 image slots
  const [imageFiles, setImageFiles] = useState([null, null, null, null]) // For file uploads
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountedPrice: "",
    category: "",
    brand: "",
    stock: "",
    featured: false,
  })

  // Fetch categories and product data (if editing)
  useEffect(() => {
    fetchCategories()
    if (isEditing && id) {
      fetchProduct(id)
    }
  }, [isEditing, id])

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/products/categories')
      if (res.data.success) {
        setCategories(res.data.data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      })
    }
  }

  const fetchProduct = async (productId) => {
    setIsLoading(true)
    try {
      const res = await axios.get(`/api/products/${productId}`)
      if (res.data.success) {
        const product = res.data.data
        
        // Set form data
        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: product.price || "",
          discountedPrice: product.discountedPrice || "",
          category: product.category?._id || "",
          brand: product.brand || "",
          stock: product.stock || "",
          featured: product.featured || false,
        })
        
        // Set images
        if (product.images && product.images.length > 0) {
          const productImages = [...images]
          product.images.forEach((img, index) => {
            if (index < 4) {
              productImages[index] = img
            }
          })
          setImages(productImages)
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error)
      toast({
        title: "Error",
        description: "Failed to load product details",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleImageChange = (e, index) => {
    const file = e.target.files[0]
    if (file) {
      // Update image preview
      const reader = new FileReader()
      reader.onload = (e) => {
        const newImages = [...images]
        newImages[index] = e.target.result
        setImages(newImages)
      }
      reader.readAsDataURL(file)
      
      // Store file for upload
      const newImageFiles = [...imageFiles]
      newImageFiles[index] = file
      setImageFiles(newImageFiles)
    }
  }

  const removeImage = (index) => {
    const newImages = [...images]
    newImages[index] = null
    setImages(newImages)
    
    const newImageFiles = [...imageFiles]
    newImageFiles[index] = null
    setImageFiles(newImageFiles)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form
      if (!formData.name || !formData.price || !formData.category) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Process images
      const productImages = []
      
      // First, include existing images
      images.forEach((img, index) => {
        if (img && !img.startsWith('data:')) {
          productImages.push(img)
        }
      })
      
      // Then, process new image files
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i]
        if (file) {
          const base64Image = await convertFileToBase64(file)
          productImages.push(base64Image)
        }
      }

      // Prepare product data
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        discountedPrice: formData.discountedPrice ? parseFloat(formData.discountedPrice) : undefined,
        stock: parseInt(formData.stock),
        images: productImages,
      }

      // Submit to API
      let response
      if (isEditing) {
        response = await axios.put(`/api/products/${id}`, productData)
      } else {
        response = await axios.post('/api/products', productData)
      }

      if (response.data.success) {
        toast({
          title: isEditing ? "Product updated" : "Product added",
          description: `The product has been ${isEditing ? 'updated' : 'added'} successfully`,
        })
        router.push("/admin/products")
      }
    } catch (error) {
      console.error("Error saving product:", error)
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'add'} product`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full py-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading product...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update product details and inventory' : 'Create a new product in your inventory'}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/admin/products")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                Product Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter product description"
                rows={5}
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">
                  Price <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="pl-7"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountedPrice">Discounted Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                  <Input
                    id="discountedPrice"
                    name="discountedPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="pl-7"
                    value={formData.discountedPrice}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                  required
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  name="brand"
                  placeholder="Enter brand name"
                  value={formData.brand}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">
                Stock <span className="text-destructive">*</span>
              </Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                placeholder="0"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-4">
              <Label>Product Status</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: !!checked })}
                />
                <Label htmlFor="featured" className="font-normal">
                  Featured Product
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Product Images</Label>
              <div className="grid grid-cols-2 gap-4">
                {images.map((image, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-2">
                      {image ? (
                        <div className="relative aspect-square">
                          <img
                            src={image}
                            alt={`Product image ${index + 1}`}
                            className="h-full w-full rounded-md object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute right-1 top-1 h-6 w-6"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border border-dashed text-muted-foreground hover:bg-muted/50">
                          <Upload className="mb-2 h-8 w-8" />
                          <span className="text-xs">Upload Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageChange(e, index)}
                          />
                        </label>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Upload up to 4 images. First image will be the featured image.
              </p>
            </div>

            <div className="space-y-2">
              <Label>SEO Information</Label>
              <div className="rounded-md border p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input 
                    id="metaTitle" 
                    placeholder="Product meta title (for SEO)" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea 
                    id="metaDescription" 
                    placeholder="Product meta description (for SEO)" 
                    rows={3} 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Additional Information</Label>
              <div className="rounded-md border p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                  <Input 
                    id="sku" 
                    placeholder="Enter product SKU" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input 
                    id="weight" 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    placeholder="0.00" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dimensions (cm)</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Input placeholder="Length" />
                    <Input placeholder="Width" />
                    <Input placeholder="Height" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push("/admin/products")}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                <span>{isEditing ? "Updating..." : "Creating..."}</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>{isEditing ? "Update Product" : "Create Product"}</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}