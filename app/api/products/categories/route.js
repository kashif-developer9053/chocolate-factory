// /app/api/products/categories/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Category from '@/app/lib/models/Category';
import { admin } from '@/app/lib/auth';
import { formatError } from '@/app/lib/utils';

// Get all categories
export async function GET(req) {
  try {
    await connectDB();
    
    const categories = await Category.find({}).sort({ name: 1 });
    
    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}

// Create a new category (admin only)
export async function POST(req) {
  try {
    await connectDB();
    
    const result = await admin(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const categoryData = await req.json();
    
    const category = await Category.create(categoryData);
    
    return NextResponse.json({
      success: true,
      data: category,
    }, { status: 201 });
  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}