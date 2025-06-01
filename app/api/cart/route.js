// /app/api/cart/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Product from '@/app/lib/models/Product';
import { protect } from '@/app/lib/auth';
import { formatError, calculateTotals } from '@/app/lib/utils';
import { cookies } from 'next/headers';

// Get cart
export async function GET(req) {
  try {
    await connectDB();
    
    // Get cart from cookie
    const cartCookie = cookies().get('cart')?.value;
    const cart = cartCookie ? JSON.parse(decodeURIComponent(cartCookie)) : { items: [] };
    
    // If cart has items, get updated product info
    if (cart.items.length > 0) {
      const productIds = cart.items.map(item => item.product);
      const products = await Product.find({ _id: { $in: productIds } }).select('_id name price stock images');
      
      // Update cart items with current product info
      cart.items = cart.items.map(item => {
        const product = products.find(p => p._id.toString() === item.product);
        
        if (!product) {
          return null; // Product no longer exists
        }
        
        return {
          product: product._id.toString(),
          name: product.name,
          price: product.price,
          image: product.images[0] || '',
          quantity: Math.min(item.quantity, product.stock), // Limit quantity to available stock
        };
      }).filter(Boolean); // Remove null items
      
      // Recalculate totals
      const totals = calculateTotals(cart.items);
      cart.itemsPrice = totals.itemsPrice;
      cart.taxPrice = totals.taxPrice;
      cart.shippingPrice = totals.shippingPrice;
      cart.totalPrice = totals.totalPrice;
      
      // Update cart cookie
      cookies().set('cart', encodeURIComponent(JSON.stringify(cart)), {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      });
    }
    
    return NextResponse.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}

// Add to cart
export async function POST(req) {
  try {
    await connectDB();
    
    const { productId, quantity = 1 } = await req.json();
    
    // Check if product exists and has enough stock
    const product = await Product.findById(productId);
    
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }
    
    if (product.stock < quantity) {
      return NextResponse.json(
        { success: false, message: 'Not enough stock available' },
        { status: 400 }
      );
    }
    
    // Get current cart from cookie
    const cartCookie = cookies().get('cart')?.value;
    const cart = cartCookie ? JSON.parse(decodeURIComponent(cartCookie)) : { items: [] };
    
    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(item => item.product === productId);
    
    if (existingItemIndex !== -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
      // Ensure quantity doesn't exceed stock
      cart.items[existingItemIndex].quantity = Math.min(
        cart.items[existingItemIndex].quantity,
        product.stock
      );
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        name: product.name,
        price: product.price,
        image: product.images[0] || '',
        quantity,
      });
    }
    
    // Calculate totals
    const totals = calculateTotals(cart.items);
    cart.itemsPrice = totals.itemsPrice;
    cart.taxPrice = totals.taxPrice;
    cart.shippingPrice = totals.shippingPrice;
    cart.totalPrice = totals.totalPrice;
    
    // Update cart cookie
    cookies().set('cart', encodeURIComponent(JSON.stringify(cart)), {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });
    
    return NextResponse.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}

// Update cart item
export async function PUT(req) {
  try {
    await connectDB();
    
    const { productId, quantity } = await req.json();
    
    if (quantity < 1) {
      return NextResponse.json(
        { success: false, message: 'Quantity must be at least 1' },
        { status: 400 }
      );
    }
    
    // Check if product exists and has enough stock
    const product = await Product.findById(productId);
    
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }
    
    if (product.stock < quantity) {
      return NextResponse.json(
        { success: false, message: 'Not enough stock available' },
        { status: 400 }
      );
    }
    
    // Get current cart from cookie
    const cartCookie = cookies().get('cart')?.value;
    
    if (!cartCookie) {
      return NextResponse.json(
        { success: false, message: 'Cart is empty' },
        { status: 400 }
      );
    }
    
    const cart = JSON.parse(decodeURIComponent(cartCookie));
    
    // Check if product in cart
    const existingItemIndex = cart.items.findIndex(item => item.product === productId);
    
    if (existingItemIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Product not in cart' },
        { status: 400 }
      );
    }
    
    // Update quantity
    cart.items[existingItemIndex].quantity = quantity;
    
    // Calculate totals
    const totals = calculateTotals(cart.items);
    cart.itemsPrice = totals.itemsPrice;
    cart.taxPrice = totals.taxPrice;
    cart.shippingPrice = totals.shippingPrice;
    cart.totalPrice = totals.totalPrice;
    
    // Update cart cookie
    cookies().set('cart', encodeURIComponent(JSON.stringify(cart)), {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });
    
    return NextResponse.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}

// Remove from cart
export async function DELETE(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    
    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    // Get current cart from cookie
    const cartCookie = cookies().get('cart')?.value;
    
    if (!cartCookie) {
      return NextResponse.json({
        success: true,
        data: { items: [] },
      });
    }
    
    const cart = JSON.parse(decodeURIComponent(cartCookie));
    
    // Remove product from cart
    cart.items = cart.items.filter(item => item.product !== productId);
    
    // Calculate totals
    const totals = calculateTotals(cart.items);
    cart.itemsPrice = totals.itemsPrice;
    cart.taxPrice = totals.taxPrice;
    cart.shippingPrice = totals.shippingPrice;
    cart.totalPrice = totals.totalPrice;
    
    // Update cart cookie
    cookies().set('cart', encodeURIComponent(JSON.stringify(cart)), {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });
    
    return NextResponse.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}