// /app/api/orders/route.js - Updated to handle both logged-in and guest users
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Order from '@/app/lib/models/Order';
import { verifyToken, getTokenFromCookies } from '@/app/lib/auth';
import { formatError } from '@/app/lib/utils';

// Create a new order (both authenticated and guest users)
export async function POST(req) {
  try {
    await connectDB();
    
    const orderData = await req.json();
    const { customer, address, items, pricing, paymentMethod, paymentStatus, orderStatus, notes, isRegisteredUser } = orderData;
    
    // Check if user is authenticated
    let authenticatedUser = null;
    const token = getTokenFromCookies();
    
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        // User is authenticated
        authenticatedUser = decoded.userId;
      }
    }
    
    // Validate required fields
    if (!customer || !address || !items || !pricing) {
      return NextResponse.json(
        { success: false, message: 'Missing required order information' },
        { status: 400 }
      );
    }
    
    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Order must contain at least one item' },
        { status: 400 }
      );
    }
    
    // Generate order tracking number
    const generateTrackingNumber = () => {
      const prefix = 'TRK';
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.random().toString(36).substring(2, 6).toUpperCase();
      return `${prefix}${timestamp}${random}`;
    };
    
    // Generate order number
    const generateOrderNumber = () => {
      const prefix = 'ORD';
      const timestamp = Date.now().toString().slice(-8);
      const random = Math.random().toString(36).substring(2, 4).toUpperCase();
      return `${prefix}${timestamp}${random}`;
    };
    
    // Prepare order object
    const newOrder = {
      orderNumber: generateOrderNumber(),
      trackingNumber: generateTrackingNumber(),
      
      // Customer information
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        username: customer.username || 'unregistered user',
        userId: authenticatedUser || customer.userId || null, // Use authenticated user ID if available
        userRole: customer.userRole || 'guest'
      },
      
      // Shipping address
      shippingAddress: {
        street: address.street,
        city: address.city,
        postalCode: address.postalCode || 'N/A'
      },
      
      // Order items
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || '',
        total: item.price * item.quantity
      })),
      
      // Pricing
      subtotal: pricing.subtotal,
      shipping: pricing.shipping,
      tax: pricing.tax,
      total: pricing.total,
      
      // Order details
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: paymentStatus || 'pending',
      orderStatus: orderStatus || 'confirmed',
      notes: notes || '',
      
      // User type tracking
      isRegisteredUser: !!authenticatedUser,
      isGuestOrder: !authenticatedUser,
      
      // Timestamps
      orderDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // If user is authenticated, link order to user account
    if (authenticatedUser) {
      newOrder.user = authenticatedUser;
    }
    
    // Create the order
    const order = await Order.create(newOrder);
    
    console.log(`Order created successfully:`, {
      orderId: order._id,
      orderNumber: order.orderNumber,
      trackingNumber: order.trackingNumber,
      customer: order.customer.username,
      isRegistered: order.isRegisteredUser,
      total: order.total
    });
    
    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      data: {
        _id: order._id,
        orderNumber: order.orderNumber,
        trackingNumber: order.trackingNumber,
        customer: order.customer,
        shippingAddress: order.shippingAddress,
        items: order.items,
        subtotal: order.subtotal,
        shipping: order.shipping,
        tax: order.tax,
        total: order.total,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        orderDate: order.orderDate,
        isRegisteredUser: order.isRegisteredUser,
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}

// Get orders (only for authenticated users)
export async function GET(req) {
  try {
    await connectDB();
    
    const token = getTokenFromCookies();
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Get orders for the authenticated user
    const orders = await Order.find({ user: decoded.userId })
      .sort({ createdAt: -1 })
      .select('-__v');
    
    return NextResponse.json({
      success: true,
      data: orders,
      count: orders.length
    });
    
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}