import { NextResponse } from 'next/server';
import mongoose from 'mongoose'; // Explicitly import mongoose
import connectDB from '../../lib/db';
import Review from '../../lib/models/Review';

export async function POST(req) {
  try {
    // Ensure database connection
    await connectDB();

    const { productIds } = await req.json();

    // Validate input
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Product IDs must be provided as an array' },
        { status: 400 }
      );
    }

    // Filter out invalid ObjectIDs and convert valid ones
    const validObjectIds = productIds
      .filter(id => {
        try {
          return mongoose.isValidObjectId(id);
        } catch {
          return false;
        }
      })
      .map(id => new mongoose.Types.ObjectId(id));

    if (validObjectIds.length === 0) {
      return NextResponse.json(
        { success: true, data: productIds.reduce((acc, id) => {
          acc[id] = { reviewCount: 0, averageRating: 0 };
          return acc;
        }, {}) },
        { status: 200 }
      );
    }

    // Aggregate reviews to get count and average rating for each product
    const reviewSummaries = await Review.aggregate([
      {
        $match: { productId: { $in: validObjectIds } }
      },
      {
        $group: {
          _id: '$productId',
          reviewCount: { $sum: 1 },
          averageRating: { $avg: '$rating' }
        }
      }
    ]);

    // Format the response to map product IDs to their review summaries
    const summaries = productIds.reduce((acc, id) => {
      const summary = reviewSummaries.find(s => s._id.toString() === id);
      acc[id] = {
        reviewCount: summary ? summary.reviewCount : 0,
        averageRating: summary ? Number(summary.averageRating.toFixed(1)) : 0
      };
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: summaries
    }, { status: 200 });

  } catch (error) {
    console.error('Get review summaries error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch review summaries',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}