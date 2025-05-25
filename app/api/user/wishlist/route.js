// /app/api/user/wishlist/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import User from '@/app/lib/models/User';
import Product from '@/app/lib/models/Product';
import { protect } from '@/app/lib/auth';
import { formatError } from '@/app/lib/utils';
import mongoose from 'mongoose';

// Get user's wishlist
export async function GET(req) {
  try {
    await connectDB();
    
    const result = await protect(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const { user } = result;
    
    // Populate wishlist with product details
    const userWithWishlist = await User.findById(user._id)
      .populate('wishlist', 'name price images stock');
    
    return NextResponse.json({
      success: true,
      data: userWithWishlist.wishlist || [],
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}

// Add product to wishlist
export async function POST(req) {
  try {
    await connectDB();
    
    const result = await protect(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const { user } = result;
    const { productId } = await req.json();
    
    // Check if product exists
    const product = await Product.findById(productId);
    
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Check if product already in wishlist
    const isProductInWishlist = user.wishlist && user.wishlist.some(
      id => id.toString() === productId
    );
    
    if (isProductInWishlist) {
      return NextResponse.json({
        success: true,
        message: 'Product already in wishlist',
        data: user.wishlist,
      });
    }
    
    // Add to wishlist
    if (!user.wishlist) {
      user.wishlist = [];
    }
    
    user.wishlist.push(productId);
    await user.save();
    
    // Get updated wishlist with product details
    const updatedUser = await User.findById(user._id)
      .populate('wishlist', 'name price images stock');
    
    return NextResponse.json({
      success: true,
      message: 'Product added to wishlist',
      data: updatedUser.wishlist,
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}

// Remove product from wishlist
export async function DELETE(req) {
  try {
    await connectDB();
    
    const result = await protect(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const { user } = result;
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    
    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    // Remove from wishlist
    if (user.wishlist) {
      user.wishlist = user.wishlist.filter(
        id => id.toString() !== productId
      );
      await user.save();
    }
    
    // Get updated wishlist with product details
    const updatedUser = await User.findById(user._id)
      .populate('wishlist', 'name price images stock');
    
    return NextResponse.json({
      success: true,
      message: 'Product removed from wishlist',
      data: updatedUser.wishlist,
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}