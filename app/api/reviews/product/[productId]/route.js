import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '../../../lib/db';
import Review from '../../../lib/models/Review';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { productId } = params;

    if (!mongoose.isValidObjectId(productId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const reviews = await Review.find({ productId })
      .populate('userId', 'name') // Populate userId to get the customer's name
      .select('rating comment createdAt')
      .lean();

    return NextResponse.json({
      success: true,
      data: reviews,
    }, { status: 200 });

  } catch (error) {
    console.error('Get product reviews error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch reviews',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}