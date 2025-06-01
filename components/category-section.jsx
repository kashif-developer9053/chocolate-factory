'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';

export default function CategorySection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/products/categories');
        if (response.data.success) {
          setCategories(response.data.data);
        } else {
          setError('Failed to load categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('An error occurred while fetching categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-16 lg:py-20 bg-[#f8f5f2]">
        <div className="container">
          <div className="mb-8 flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Delicious Categories</h2>
            <p className="mt-4 max-w-[700px] text-gray-600">
              Explore our handcrafted selection of freshly baked goods and cafe delights
            </p>
          </div>
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C8815F]"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 md:py-16 lg:py-20 bg-[#f8f5f2]">
        <div className="container">
          <div className="mb-8 flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Delicious Categories</h2>
            <p className="mt-4 max-w-[700px] text-gray-600">
              Explore our handcrafted selection of freshly baked goods and cafe delights
            </p>
          </div>
          <div className="flex justify-center items-center min-h-[200px]">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="py-12 md:py-16 lg:py-20 bg-[#f8f5f2]">
        <div className="container">
          <div className="mb-8 flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Delicious Categories</h2>
            <p className="mt-4 max-w-[700px] text-gray-600">
              Explore our handcrafted selection of freshly baked goods and cafe delights
            </p>
          </div>
          <div className="flex justify-center items-center min-h-[200px]">
            <p className="text-gray-600">No categories available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-[#f8f5f2]">
      <div className="container">
        <div className="mb-8 flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Delicious Categories</h2>
          <p className="mt-4 max-w-[700px] text-gray-600">
            Explore our handcrafted selection of freshly baked goods and cafe delights
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <Link key={category._id} href={`/categories/${category._id}`} >
              <Card className="overflow-hidden transition-all hover:shadow-lg border-none">
                <CardContent className="p-0">
                  <div className="aspect-square overflow-hidden rounded-t-lg">
                    <img
                      src={category.image || '/placeholder.svg'}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                      onError={(e) => {
                        e.target.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <div className="p-4 text-center bg-white rounded-b-lg">
                    <h3 className="font-medium text-[#8B5A2B]">{category.name}</h3>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/menu"
            className="inline-flex items-center px-6 py-3 rounded-md bg-[#C8815F] text-white hover:bg-[#A66B4F] transition-colors"
          >
            View Full Menu
          </Link>
        </div>
      </div>
    </section>
  );
}