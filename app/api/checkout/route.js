// /app/api/checkout/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Product from '@/app/lib/models/Product';
import Order from '@/app/lib/models/Order';
import Discount from '@/app/lib/models/Discount';
import { protect } from '@/app/lib/auth';
import { formatError, calculateTotals } from '@/app/lib/utils';
import { cookies } from 'next/headers';

// Process checkout
export async function POST(req) {
  try {
    await connectDB();
    
    const result = await protect(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const { user } = result;
    const { shippingAddress, paymentMethod, discountCode } = await req.json();
    
    // Get cart from cookie
    const cartCookie = cookies().get('cart')?.value;
    
    if (!cartCookie) {
      return NextResponse.json(
        { success: false, message: 'Cart is empty' },
        { status: 400 }
      );
    }
    
    const cart = JSON.parse(decodeURIComponent(cartCookie));
    
    if (cart.items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Cart is empty' },
        { status: 400 }
      );
    }
    
    // Verify all products exist and have enough stock
    const productIds = cart.items.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } });
    
    // Check if all products exist
    if (products.length !== productIds.length) {
      return NextResponse.json(
        { success: false, message: 'Some products are no longer available' },
        { status: 400 }
      );
    }
    
    // Check stock and update product data
    const orderItems = [];
    let isOutOfStock = false;
    
    for (const item of cart.items) {
      const product = products.find(p => p._id.toString() === item.product);
      
      if (product.stock < item.quantity) {
        isOutOfStock = true;
        break;
      }
      
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || '',
        price: product.price,
        quantity: item.quantity,
      });
    }
    
    if (isOutOfStock) {
      return NextResponse.json(
        { success: false, message: 'Some products are out of stock' },
        { status: 400 }
      );
    }
    
    // Calculate prices
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calculateTotals(orderItems);
    
    // Apply discount if provided
    let discountAmount = 0;
    
    if (discountCode) {
      const discount = await Discount.findOne({
        code: discountCode.toUpperCase(),
        isActive: true,
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() },
        usageLimit: { $gt: 0 },
      });
      
      if (discount) {
        // Check minimum purchase amount
        if (itemsPrice >= discount.minPurchaseAmount) {
          if (discount.discountType === 'percentage') {
            discountAmount = (itemsPrice * discount.discountValue) / 100;
          } else {
            discountAmount = discount.discountValue;
          }
          
          // Apply max discount amount if set
          if (discount.maxDiscountAmount && discountAmount > discount.maxDiscountAmount) {
            discountAmount = discount.maxDiscountAmount;
          }
          
          // Update discount usage count
          discount.usageCount += 1;
          if (discount.usageLimit) {
            discount.usageLimit -= 1;
          }
          await discount.save();
        }
      }
    }
    
    // Create order
    const order = await Order.create({
      user: user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      discountAmount,
      discountCode: discountCode || '',
      totalPrice: totalPrice - discountAmount,
    });
    
    // Update product stock
    for (const item of cart.items) {
      const product = products.find(p => p._id.toString() === item.product);
      product.stock -= item.quantity;
      await product.save();
    }
    
    // Clear cart
    cookies().set('cart', encodeURIComponent(JSON.stringify({ items: [] })), {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });
    
    return NextResponse.json({
      success: true,
      data: order,
    }, { status: 201 });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}