// /app/api/admin/orders/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Order from '@/app/lib/models/Order';
import { admin } from '@/app/lib/auth';
import { formatError } from '@/app/lib/utils';

// Get all orders (admin only)
export async function GET(req) {
  try {
    await connectDB();
    
    const result = await admin(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status') || '';
    
    const skip = (page - 1) * limit;
    
    // Build query
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Order.countDocuments(query);
    
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