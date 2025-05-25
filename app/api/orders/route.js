// /app/api/user/orders/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Order from '@/app/lib/models/Order';
import { protect } from '@/app/lib/auth';
import { formatError } from '@/app/lib/utils';

// Get user's orders
export async function GET(req) {
  try {
    await connectDB();
    
    const result = await protect(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const { user } = result;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    
    const skip = (page - 1) * limit;
    
    const orders = await Order.find({ user: user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Order.countDocuments({ user: user._id });
    
    return NextResponse.json({
      success: true,
      data: {
        orders,
        page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}