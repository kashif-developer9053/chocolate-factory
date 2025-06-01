// /app/admin/products/edit/[id]/page.jsx
"use client"

import { useParams } from 'next/navigation'
import ProductForm from '../../add/ProductFormPage'

export default function EditProductPage() {
  // Use the built-in useParams hook instead of accessing params directly
  const params = useParams()
  const id = params.id
  
  return <ProductForm id={id} isEditing={true} />
}