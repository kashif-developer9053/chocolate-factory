// /app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import User from '@/app/lib/models/User';
import { generateToken, setTokenCookie } from '@/app/lib/auth';
import { formatError } from '@/app/lib/utils';

export async function POST(req) {
  try {
    await connectDB();
    
    const { email, password } = await req.json();
    
    // Check for user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    const token = generateToken(user._id);
    setTokenCookie(token);
    
    return NextResponse.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}