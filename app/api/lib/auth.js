// /app/lib/auth.js
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';

// Generate JWT Token
export const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

// Set JWT cookie
export const setTokenCookie = (token) => {
  cookies().set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/',
  });
};

// Get current user from token
export const getCurrentUser = async (req) => {
  try {
    const token = cookies().get('token')?.value;
    
    if (!token) {
      return null;
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const User = (await import('./models/User')).default;
    const user = await User.findById(decoded.id).select('-password');
    
    return user;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
};

// Middleware to protect routes
export const protect = async (req) => {
  try {
    const user = await getCurrentUser(req);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Not authorized, please login' },
        { status: 401 }
      );
    }
    
    return { user };
  } catch (error) {
    console.error('Protect middleware error:', error);
    return NextResponse.json(
      { success: false, message: 'Not authorized, please login' },
      { status: 401 }
    );
  }
};

// Admin middleware
export const admin = async (req) => {
  try {
    const result = await protect(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const { user } = result;
    
    if (user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Not authorized as admin' },
        { status: 403 }
      );
    }
    
    return { user };
  } catch (error) {
    console.error('Admin middleware error:', error);
    return NextResponse.json(
      { success: false, message: 'Not authorized as admin' },
      { status: 403 }
    );
  }
};