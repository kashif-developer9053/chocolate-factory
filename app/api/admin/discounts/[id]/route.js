// /app/api/admin/discounts/[id]/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Discount from '@/app/lib/models/Discount';
import { admin } from '@/app/lib/auth';
import { formatError } from '@/app/lib/utils';

// Get discount details (admin only)
export async function GET(req, { params }) {
  try {
    await connectDB();
    
    const result = await admin(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const { id } = params;
    
    const discount = await Discount.findById(id);
    
    if (!discount) {
      return NextResponse.json(
        { success: false, message: 'Discount not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: discount,
    });
  } catch (error) {
    console.error('Get discount error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}

// Update discount (admin only)
export async function PUT(req, { params }) {
  try {
    await connectDB();
    
    const result = await admin(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const { id } = params;
    const updates = await req.json();
    
    const discount = await Discount.findById(id);
    
    if (!discount) {
      return NextResponse.json(
        { success: false, message: 'Discount not found' },
        { status: 404 }
      );
    }
    
    Object.keys(updates).forEach(key => {
      discount[key] = updates[key];
    });
    
    const updatedDiscount = await discount.save();
    
    return NextResponse.json({
      success: true,
      data: updatedDiscount,
    });
  } catch (error) {
    console.error('Update discount error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}

// Delete discount (admin only)
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    
    const result = await admin(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const { id } = params;
    
    const discount = await Discount.findById(id);
    
    if (!discount) {
      return NextResponse.json(
        { success: false, message: 'Discount not found' },
        { status: 404 }
      );
    }
    
    await discount.deleteOne();
    
    return NextResponse.json({
      success: true,
      message: 'Discount removed',
    });
  } catch (error) {
    console.error('Delete discount error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}