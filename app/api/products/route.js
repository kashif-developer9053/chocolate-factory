// /app/api/products/route.js
import { NextResponse } from 'next/server';
import connectDB from '../lib/db';
import Product from '../lib/models/Product';
import { admin } from '../lib/auth';
import { formatError } from '../lib/utils';
import Category from '../lib/models/Category'; // Import Category model

// Get all products with pagination and filtering
export async function GET(req) {
  try {
    await connectDB();
    console.log('Connected to database for products');

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
    const featured = searchParams.get('featured') === 'true';

    const skip = (page - 1) * limit;

    const query = {};

    if (keyword) {
      query.name = { $regex: keyword, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    if (brand) {
      query.brand = brand;
    }

    if (featured) {
      query.featured = true;
    }

    query.price = { $gte: minPrice, $lte: maxPrice };
    query.rating = { $gte: rating };

    console.log('Query:', JSON.stringify(query));

    // Fetch products with category population
    const products = await Product.find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .populate('category', 'name slug') // Now this will work
      .lean();

    const total = await Product.countDocuments(query);

    console.log('Fetched Products:', products.length, 'Total:', total);

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
    console.error('Get products error:', error.message, error.stack);
    return NextResponse.json(
      { success: false, message: formatError(error) || 'Internal Server Error' },
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
