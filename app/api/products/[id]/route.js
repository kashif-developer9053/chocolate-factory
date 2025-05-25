// /app/api/products/[id]/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Product from '@/app/lib/models/Product';
import { admin } from '@/app/lib/auth';
import { formatError } from '@/app/lib/utils';

// Get a single product
export async function GET(req, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    const product = await Product.findById(id).populate('category', 'name');
    
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}

// Update a product (admin only)
export async function PUT(req, { params }) {
  try {
    await connectDB();
    
    const result = await admin(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const { id } = params;
    const updates = await req.json();
    
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }
    
    Object.keys(updates).forEach(key => {
      product[key] = updates[key];
    });
    
    const updatedProduct = await product.save();
    
    return NextResponse.json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}

// Delete a product (admin only)
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    
    const result = await admin(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const { id } = params;
    
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }
    
    await product.deleteOne();
    
    return NextResponse.json({
      success: true,
      message: 'Product removed',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}