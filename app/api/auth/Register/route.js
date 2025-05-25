// /app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import User from '@/app/lib/models/User';
import { generateToken, setTokenCookie } from '@/app/lib/auth';
import { formatError } from '@/app/lib/utils';

export async function POST(req) {
  try {
    await connectDB();
    
    const { name, email, phone, password } = await req.json();
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 400 }
      );
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password,
    });
    
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
    console.error('Register error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}