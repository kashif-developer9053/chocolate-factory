// /app/api/products/search/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Product from '@/app/lib/models/Product';
import { formatError } from '@/app/lib/utils';

export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    
    if (!query) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }
    
    const products = await Product.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(20)
      .populate('category', 'name');
    
    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Search products error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}