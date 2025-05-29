// /app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import connectDB from '../../lib/db';
import User from '../../lib/models/User';
import { generateToken } from '../../lib/auth';

import bcrypt from 'bcryptjs';


import mongoose from 'mongoose';

export async function POST(req) {
  try {
    await connectDB();
    
    const { email, password } = await req.json();
    
    console.log(`Login attempt - Email: ${email}, Password length: ${password?.length}`);
    
    // Get direct access to MongoDB collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // Find user directly from MongoDB
    const user = await usersCollection.findOne({ email });
    
    if (!user) {
      console.log(`User not found: ${email}`);
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    console.log(`User found: ${user.name}, Password hash: ${user.password.substring(0, 10)}...`);
    
    // Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Password comparison result: ${isMatch}`);
    
    if (!isMatch) {
      console.log('Password does not match');
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    console.log('Authentication successful');
    
    // Generate token
    const token = generateToken(user._id);
    
    // Create response
    const response = NextResponse.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
      },
    });
    
    // Set cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}