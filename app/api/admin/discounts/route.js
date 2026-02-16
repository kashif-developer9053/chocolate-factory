import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Coupon from '@/app/lib/models/Coupon';
import { admin } from '@/app/lib/auth';
import { formatError } from '@/app/lib/utils';

// Get all coupons (admin only)
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
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const searchQuery = searchParams.get('searchQuery');
    
    const skip = (page - 1) * limit;
    
    // Build query
    const query = {};
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (searchQuery) {
      query.code = { $regex: searchQuery, $options: 'i' };
    }
    
    const coupons = await Coupon.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Coupon.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      data: {
        coupons,
        page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error('Get coupons error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}

// Create a new coupon (admin only)
export async function POST(req) {
  try {
    await connectDB();
    
    const result = await admin(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const couponData = await req.json();
    
    // Validate required fields
    if (!couponData.code || !couponData.type || !couponData.value || !couponData.startDate || !couponData.endDate) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: code, type, value, startDate, endDate' },
        { status: 400 }
      );
    }
    
    const coupon = await Coupon.create(couponData);
    
    return NextResponse.json({
      success: true,
      data: coupon,
    }, { status: 201 });
  } catch (error) {
    console.error('Create coupon error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}

// Update a coupon (admin only)
export async function PUT(req) {
  try {
    await connectDB();
    
    const result = await admin(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Coupon ID is required' },
        { status: 400 }
      );
    }
    
    const couponData = await req.json();
    
    // Validate required fields
    if (!couponData.code || !couponData.type || !couponData.value || !couponData.startDate || !couponData.endDate) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: code, type, value, startDate, endDate' },
        { status: 400 }
      );
    }
    
    const coupon = await Coupon.findByIdAndUpdate(id, couponData, { new: true });
    
    if (!coupon) {
      return NextResponse.json(
        { success: false, message: 'Coupon not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    console.error('Update coupon error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}

// Delete a coupon (admin only)
export async function DELETE(req) {
  try {
    await connectDB();
    
    const result = await admin(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Coupon ID is required' },
        { status: 400 }
      );
    }
    
    const coupon = await Coupon.findByIdAndDelete(id);
    
    if (!coupon) {
      return NextResponse.json(
        { success: false, message: 'Coupon not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Coupon deleted successfully',
    });
  } catch (error) {
    console.error('Delete coupon error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}