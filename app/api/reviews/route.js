import { NextResponse } from 'next/server';
import connectDB from '../lib/db';
import Review from '../lib/models/Review';
import Order from '../lib/models/Order';
import { formatError } from '../lib/utils';

export async function POST(req) {
  try {
    await connectDB();
    const reviewData = await req.json();
    
    const { orderId, productId, rating, comment, userId } = reviewData;

    // Validate required fields
    if (!orderId || !productId || !rating || !userId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify order exists and is delivered
    const order = await Order.findById(orderId);
    if (!order || order.orderStatus !== 'delivered') {
      return NextResponse.json(
        { success: false, message: 'Invalid order or order not delivered' },
        { status: 400 }
      );
    }

    // Check if review already exists for this product and order
    const existingReview = await Review.findOne({ orderId, productId, userId });
    if (existingReview) {
      return NextResponse.json(
        { success: false, message: 'Review already submitted for this product' },
        { status: 400 }
      );
    }

    const review = await Review.create({
      orderId,
      productId,
      userId,
      rating,
      comment
    });

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    }, { status: 201 });

  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: formatError(error) || 'Failed to submit review',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}