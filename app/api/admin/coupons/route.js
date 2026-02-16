// ==================== /app/api/admin/coupons/route.js ====================
import { NextResponse } from 'next/server';
import connectDB from '../../lib/db';
import Coupon from '../../lib/models/Coupons';

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const keyword = searchParams.get('keyword') || '';
    const type = searchParams.get('type') || '';
    const status = searchParams.get('status') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    const query = {};
    
    if (keyword) {
      query.$or = [
        { code: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const [coupons, total] = await Promise.all([
      Coupon.find(query)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Coupon.countDocuments(query)
    ]);

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
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const couponData = await req.json();

    const requiredFields = ['code', 'type', 'value', 'startDate', 'endDate'];
    for (const field of requiredFields) {
      if (!couponData[field]) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const existingCoupon = await Coupon.findOne({ code: couponData.code });
    if (existingCoupon) {
      return NextResponse.json(
        { success: false, message: 'Coupon code already exists' },
        { status: 400 }
      );
    }

    if (!/^[A-Z0-9]+$/.test(couponData.code)) {
      return NextResponse.json(
        { success: false, message: 'Coupon code must contain only uppercase letters and numbers' },
        { status: 400 }
      );
    }

    if (couponData.type === 'percentage') {
      if (couponData.value < 0 || couponData.value > 100) {
        return NextResponse.json(
          { success: false, message: 'Percentage must be between 0 and 100' },
          { status: 400 }
        );
      }
    } else if (couponData.type === 'fixed') {
      if (couponData.value <= 0) {
        return NextResponse.json(
          { success: false, message: 'Fixed amount must be greater than 0' },
          { status: 400 }
        );
      }
    }

    const startDate = new Date(couponData.startDate);
    const endDate = new Date(couponData.endDate);
    const now = new Date();

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { success: false, message: 'Invalid date format' },
        { status: 400 }
      );
    }

    if (startDate >= endDate) {
      return NextResponse.json(
        { success: false, message: 'End date must be after start date' },
        { status: 400 }
      );
    }

    if (couponData.minPurchase && couponData.minPurchase < 0) {
      return NextResponse.json(
        { success: false, message: 'Minimum purchase cannot be negative' },
        { status: 400 }
      );
    }

    if (couponData.maxUses && couponData.maxUses < 0) {
      return NextResponse.json(
        { success: false, message: 'Maximum uses cannot be negative' },
        { status: 400 }
      );
    }

    if (couponData.usesPerCustomer && couponData.usesPerCustomer < 1) {
      return NextResponse.json(
        { success: false, message: 'Uses per customer must be at least 1' },
        { status: 400 }
      );
    }

    if (!couponData.status || !['active', 'scheduled', 'expired'].includes(couponData.status)) {
      if (now < startDate) {
        couponData.status = 'scheduled';
      } else if (now > endDate) {
        couponData.status = 'expired';
      } else {
        couponData.status = 'active';
      }
    }

    const coupon = await Coupon.create(couponData);

    return NextResponse.json({
      success: true,
      data: coupon,
      message: 'Coupon created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Create coupon error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Coupon code already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Coupon ID is required' },
        { status: 400 }
      );
    }

    const couponData = await req.json();

    const requiredFields = ['code', 'type', 'value', 'startDate', 'endDate'];
    for (const field of requiredFields) {
      if (!couponData[field]) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const existingCoupon = await Coupon.findById(id);
    if (!existingCoupon) {
      return NextResponse.json(
        { success: false, message: 'Coupon not found' },
        { status: 404 }
      );
    }

    const duplicateCoupon = await Coupon.findOne({ 
      code: couponData.code, 
      _id: { $ne: id } 
    });
    if (duplicateCoupon) {
      return NextResponse.json(
        { success: false, message: 'Coupon code already exists' },
        { status: 400 }
      );
    }

    if (!/^[A-Z0-9]+$/.test(couponData.code)) {
      return NextResponse.json(
        { success: false, message: 'Coupon code must contain only uppercase letters and numbers' },
        { status: 400 }
      );
    }

    if (couponData.type === 'percentage') {
      if (couponData.value < 0 || couponData.value > 100) {
        return NextResponse.json(
          { success: false, message: 'Percentage must be between 0 and 100' },
          { status: 400 }
        );
      }
    } else if (couponData.type === 'fixed') {
      if (couponData.value <= 0) {
        return NextResponse.json(
          { success: false, message: 'Fixed amount must be greater than 0' },
          { status: 400 }
        );
      }
    }

    const startDate = new Date(couponData.startDate);
    const endDate = new Date(couponData.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { success: false, message: 'Invalid date format' },
        { status: 400 }
      );
    }

    if (startDate >= endDate) {
      return NextResponse.json(
        { success: false, message: 'End date must be after start date' },
        { status: 400 }
      );
    }

    if (couponData.minPurchase && couponData.minPurchase < 0) {
      return NextResponse.json(
        { success: false, message: 'Minimum purchase cannot be negative' },
        { status: 400 }
      );
    }

    if (couponData.maxUses && couponData.maxUses < 0) {
      return NextResponse.json(
        { success: false, message: 'Maximum uses cannot be negative' },
        { status: 400 }
      );
    }

    if (couponData.usesPerCustomer && couponData.usesPerCustomer < 1) {
      return NextResponse.json(
        { success: false, message: 'Uses per customer must be at least 1' },
        { status: 400 }
      );
    }

    couponData.usedCount = existingCoupon.usedCount;

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id, 
      couponData, 
      { 
        new: true,
        runValidators: true
      }
    );

    return NextResponse.json({
      success: true,
      data: updatedCoupon,
      message: 'Coupon updated successfully'
    });
  } catch (error) {
    console.error('Update coupon error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Coupon code already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Coupon ID is required' },
        { status: 400 }
      );
    }

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return NextResponse.json(
        { success: false, message: 'Coupon not found' },
        { status: 404 }
      );
    }

    await Coupon.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Coupon deleted successfully',
      data: { deletedCoupon: coupon.code }
    });
  } catch (error) {
    console.error('Delete coupon error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}