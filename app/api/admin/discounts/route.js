// /app/api/admin/discounts/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Discount from '@/app/lib/models/Discount';
import { admin } from '@/app/lib/auth';
import { formatError } from '@/app/lib/utils';

// Get all discounts (admin only)
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
    const isActive = searchParams.get('isActive');
    
    const skip = (page - 1) * limit;
    
    // Build query
    const query = {};
    
    if (isActive !== null && isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    const discounts = await Discount.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Discount.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      data: {
        discounts,
        page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error('Get discounts error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}

// Create a new discount (admin only)
export async function POST(req) {
  try {
    await connectDB();
    
    const result = await admin(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const discountData = await req.json();
    
    const discount = await Discount.create(discountData);
    
    return NextResponse.json({
      success: true,
      data: discount,
    }, { status: 201 });
  } catch (error) {
    console.error('Create discount error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}