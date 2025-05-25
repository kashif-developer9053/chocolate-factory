// /app/api/user/profile/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import { protect } from '@/app/lib/auth';
import { formatError } from '@/app/lib/utils';

// Get user profile
export async function GET(req) {
  try {
    await connectDB();
    
    const result = await protect(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const { user } = result;
    
    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}

// Update user profile
export async function PUT(req) {
  try {
    await connectDB();
    
    const result = await protect(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const { user } = result;
    const { name, email, phone, address } = await req.json();
    
    // Update user fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    
    if (address) {
      user.address = {
        ...user.address,
        ...address,
      };
    }
    
    const updatedUser = await user.save();
    
    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}
