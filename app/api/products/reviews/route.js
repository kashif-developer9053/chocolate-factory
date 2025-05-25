// /app/api/products/reviews/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Product from '@/app/lib/models/Product';
import Review from '@/app/lib/models/Review';
import { protect } from '@/app/lib/auth';
import { formatError } from '@/app/lib/utils';

// Get reviews for a product
export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    
    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    const reviews = await Review.find({ product: productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}

// Create a new review
export async function POST(req) {
  try {
    await connectDB();
    
    const result = await protect(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const { user } = result;
    const { productId, rating, title, comment } = await req.json();
    
    // Check if product exists
    const product = await Product.findById(productId);
    
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({
      user: user._id,
      product: productId,
    });
    
    if (alreadyReviewed) {
      return NextResponse.json(
        { success: false, message: 'Product already reviewed' },
        { status: 400 }
      );
    }
    
    // Create review
    const review = await Review.create({
      user: user._id,
      product: productId,
      rating,
      title,
      comment,
    });
    
    // Update product rating
    const reviews = await Review.find({ product: productId });
    product.numReviews = reviews.length;
    product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    
    await product.save();
    
    return NextResponse.json({
      success: true,
      data: review,
    }, { status: 201 });
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}