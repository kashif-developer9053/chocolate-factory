// /app/api/products/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Product from '@/app/lib/models/Product';
import { admin } from '@/app/lib/auth';
import { formatError } from '@/app/lib/utils';

// Get all products with pagination and filtering
export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const keyword = searchParams.get('keyword') || '';
    const category = searchParams.get('category') || '';
    const brand = searchParams.get('brand') || '';
    const minPrice = parseFloat(searchParams.get('minPrice')) || 0;
    const maxPrice = parseFloat(searchParams.get('maxPrice')) || Number.MAX_SAFE_INTEGER;
    const rating = parseFloat(searchParams.get('rating')) || 0;
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    const skip = (page - 1) * limit;
    
    // Build query
    const query = {};
    
    if (keyword) {
      query.$text = { $search: keyword };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (brand) {
      query.brand = brand;
    }
    
    query.price = { $gte: minPrice, $lte: maxPrice };
    query.rating = { $gte: rating };
    
    // Execute query with pagination
    const products = await Product.find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .populate('category', 'name');
    
    const total = await Product.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      data: {
        products,
        page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}

// Create a new product (admin only)
export async function POST(req) {
  try {
    await connectDB();
    
    const result = await admin(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const productData = await req.json();
    
    const product = await Product.create(productData);
    
    return NextResponse.json({
      success: true,
      data: product,
    }, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}
