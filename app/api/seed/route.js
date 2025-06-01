// /app/api/seed/route.js
import { NextResponse } from 'next/server';
import { seedDatabase } from '../../api/lib/seed';

// This endpoint is for seeding the database with initial data
// It should be disabled in production by checking environment variables
export async function GET(req) {
  try {
    // Security check: Only allow seeding in development environment
    // You might want to add additional security here (e.g., API key check)
    if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_SEEDING) {
      return NextResponse.json(
        { success: false, message: 'Seeding is not allowed in production' },
        { status: 403 }
      );
    }
    
    const result = await seedDatabase();
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: result.message,
      credentials: {
        email: 'admin@example.com',
        password: 'admin123',
      },
    });
  } catch (error) {
    console.error('Seed API error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}