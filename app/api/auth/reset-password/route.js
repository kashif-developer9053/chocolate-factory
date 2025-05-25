// /app/api/auth/reset-password/route.js
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/app/lib/db';
import User from '@/app/lib/models/User';
import { formatError } from '@/app/lib/utils';

// Generate reset token
export async function POST(req) {
  try {
    await connectDB();
    
    const { email } = await req.json();
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // Set expire
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    await user.save();
    
    // In a real app, you would send an email with the reset token
    // For this example, we'll just return the token
    return NextResponse.json({
      success: true,
      message: 'Password reset token generated',
      resetToken,
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}

// Implement password reset
export async function PUT(req) {
  try {
    await connectDB();
    
    const { resetToken, password } = await req.json();
    
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 400 }
      );
    }
    
    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();
    
    return NextResponse.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Reset password confirm error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}