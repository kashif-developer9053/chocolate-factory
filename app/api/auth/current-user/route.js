// /app/api/auth/me/route.js - Get current user
import { NextResponse } from 'next/server';
import connectDB from '../../lib/db';
import User from '../../lib/models/User';
import { verifyToken, getTokenFromCookies } from '../../lib/auth';

export async function GET() {
  try {
    await connectDB();
    
    const token = getTokenFromCookies();
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, message: 'User not found or account inactive' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while fetching profile' },
      { status: 500 }
    );
  }
}