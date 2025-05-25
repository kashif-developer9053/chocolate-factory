// /app/api/admin/inventory/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Product from '@/app/lib/models/Product';
import { admin } from '@/app/lib/auth';
import { formatError } from '@/app/lib/utils';

// Get inventory status (admin only)
export async function GET(req) {
  try {
    await connectDB();
    
    const result = await admin(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const lowStock = searchParams.get('lowStock') === 'true';
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    
    const skip = (page - 1) * limit;
    
    // Build query
    const query = {};
    
    if (lowStock) {
      query.stock = { $lt: 10 }; // Low stock threshold
    }
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ];
    }
    
    const products = await Product.find(query)
      .select('_id name brand stock price category')
      .populate('category', 'name')
      .sort({ stock: 1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Product.countDocuments(query);
    
    // Get inventory summary
    const inventorySummary = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalStock: { $sum: '$stock' },
          outOfStock: { $sum: { $cond: [{ $eq: ['$stock', 0] }, 1, 0] } },
          lowStock: { $sum: { $cond: [{ $and: [{ $gt: ['$stock', 0] }, { $lt: ['$stock', 10] }] }, 1, 0] } },
          totalValue: { $sum: { $multiply: ['$stock', '$price'] } },
        },
      },
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        products,
        page,
        pages: Math.ceil(total / limit),
        total,
        summary: inventorySummary[0] || {
          totalProducts: 0,
          totalStock: 0,
          outOfStock: 0,
          lowStock: 0,
          totalValue: 0,
        },
      },
    });
  } catch (error) {
    console.error('Get inventory error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}

// Update inventory (admin only)
export async function PUT(req) {
  try {
    await connectDB();
    
    const result = await admin(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const updates = await req.json();
    const { products } = updates;
    
    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No products to update' },
        { status: 400 }
      );
    }
    
    const updatedProducts = [];
    
    for (const item of products) {
      const { id, stock } = item;
      
      if (!id || stock === undefined || stock < 0) {
        continue;
      }
      
      const product = await Product.findById(id);
      
      if (!product) {
        continue;
      }
      
      product.stock = stock;
      const updatedProduct = await product.save();
      updatedProducts.push(updatedProduct);
    }
    
    return NextResponse.json({
      success: true,
      message: `Updated ${updatedProducts.length} products`,
      data: updatedProducts,
    });
  } catch (error) {
    console.error('Update inventory error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}