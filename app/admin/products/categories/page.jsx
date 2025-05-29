'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Edit, Trash2, Plus, Image as ImageIcon } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parent: '',
    image: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/products/categories');
      if (res.data.success) setCategories(res.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setMessage("Failed to load categories");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      const formDataObj = new FormData(e.target);
      const imageFile = formDataObj.get('image');
      
      let base64Image = null;
      
      if (imageFile && imageFile.size > 0) {
        base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(imageFile);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      }
      
      const data = {
        name: formDataObj.get('name') || '',
        slug: formDataObj.get('slug') || '',
        description: formDataObj.get('description') || '',
        parent: formDataObj.get('parent') || null,
        imageBase64: base64Image,
      };
      
      // Use PUT for edit, POST for new
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `/api/products/categories/${editingId}` 
        : '/api/products/categories';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await res.json();
      
      if (result.success) {
        // Close modal and refresh categories
        setModalOpen(false);
        fetchCategories();
        
        // Reset form
        setFormData({
          name: '',
          slug: '',
          description: '',
          parent: '',
          image: null,
        });
        setPreviewImage(null);
        setEditingId(null);
      } else {
        setMessage(result.message || "Failed to save category");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      setMessage("An error occurred while saving the category");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || '',
      parent: category.parent?._id || '',
      image: null,
    });
    
    // Handle image preview
    setPreviewImage(category.image || null);
    setEditingId(category._id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await axios.delete(`/api/products/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">📂 Categories</h2>
        
        <button
          onClick={() => {
            setModalOpen(true);
            setFormData({ name: '', slug: '', description: '', parent: '', image: null });
            setEditingId(null);
            setPreviewImage(null);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {/* Card Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Card image or placeholder */}
            <div className="h-48 bg-gray-100 relative overflow-hidden">
              {cat.image ? (
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <ImageIcon size={48} />
                </div>
              )}
            </div>
            
            {/* Card content */}
            <div className="p-4">
              <h3 className="text-lg font-bold">{cat.name}</h3>
              <p className="text-sm text-gray-500 mb-2">Slug: {cat.slug}</p>
              
              {cat.parent && (
                <p className="text-xs text-gray-500 mb-2">
                  Parent: <span className="font-medium">{cat.parent.name}</span>
                </p>
              )}
              
              <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                {cat.description || 'No description provided'}
              </p>
              
              {/* Action buttons */}
              <div className="flex justify-end gap-2 mt-2">
                <button 
                  onClick={() => handleEdit(cat)} 
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition"
                  title="Edit"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(cat._id)} 
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {categories.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No categories</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new category.</p>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            <h3 className="text-xl font-semibold mb-4">{editingId ? 'Edit' : 'Add'} Category</h3>
            <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  name="name"
                  placeholder="Category name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  name="slug"
                  placeholder="category-slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  placeholder="Category description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 min-h-[100px]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
                <select
                  name="parent"
                  value={formData.parent}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">No Parent</option>
                  {categories
                    .filter((cat) => cat._id !== editingId)
                    .map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border rounded px-3 py-2"
                />
                {previewImage && (
                  <div className="mt-2">
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="w-24 h-24 object-cover rounded border" 
                    />
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                >
                  {loading ? 'Saving...' : 'Save Category'}
                </button>
              </div>
              
              {message && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}