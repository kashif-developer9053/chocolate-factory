// /app/api/admin/users/[id]/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import User from '@/app/lib/models/User';
import { admin } from '@/app/lib/auth';
import { formatError } from '@/app/lib/utils';

// Get user details (admin only)
export async function GET(req, { params }) {
  try {
    await connectDB();
    
    const result = await admin(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const { id } = params;
    
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}

// Update user (admin only)
export async function PUT(req, { params }) {
  try {
    await connectDB();
    
    const result = await admin(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const { id } = params;
    const { name, email, role } = await req.json();
    
    const user = await User.findById(id);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    
    const updatedUser = await user.save();
    
    return NextResponse.json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}

// Delete user (admin only)
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    
    const result = await admin(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const { id } = params;
    
    const user = await User.findById(id);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Prevent admin from deleting themselves
    if (user._id.toString() === result.user._id.toString()) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete yourself' },
        { status: 400 }
      );
    }
    
    await user.deleteOne();
    
    return NextResponse.json({
      success: true,
      message: 'User removed',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}