// /app/api/user/orders/route.js - Dedicated route for current user orders
import { NextResponse } from 'next/server';
import connectDB from '../lib/db';
import Order from '../lib/models/Order';

// Get orders for current user only
export async function GET(req) {
  try {
    await connectDB();
    
    // Get user data from headers
    const userEmail = req.headers.get('user-email');
    const userId = req.headers.get('user-id');
    
    if (!userEmail && !userId) {
      return NextResponse.json(
        { success: false, message: 'User authentication required' },
        { status: 401 }
      );
    }
    
    console.log('Fetching orders for user:', { userEmail, userId });
    
    // Build query to find orders for current user
    let query = {};
    
    if (userId && userId !== 'null' && userId !== '') {
      // Search by userId first, then email as fallback
      query = {
        $or: [
          { "customer.userId": userId },
          { "customer.email": userEmail }
        ]
      };
    } else if (userEmail) {
      // If only email is provided, search by email
      query = { "customer.email": userEmail };
    }
    
    console.log('Database query:', JSON.stringify(query, null, 2));
    
    // Fetch orders for the user
    const orders = await Order.find(query)
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean(); // Use lean() for better performance
    
    console.log(`Found ${orders.length} orders for user`);
    
    // Format orders for frontend
    const formattedOrders = orders.map(order => ({
      _id: order._id,
      orderNumber: order.orderNumber || order._id?.toString().slice(-6).toUpperCase(),
      trackingNumber: order.trackingNumber,
      customer: order.customer,
      address: order.address,
      items: order.items,
      pricing: order.pricing,
      subtotal: order.subtotal,
      shipping: order.shipping,
      tax: order.tax,
      total: order.total,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      notes: order.notes,
      orderDate: order.orderDate,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }));
    
    return NextResponse.json({
      success: true,
      data: formattedOrders,
      count: formattedOrders.length,
      message: `Found ${formattedOrders.length} orders for user`
    });
    
  } catch (error) {
    console.error('Get user orders error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch user orders',
        error: error.message 
      },
      { status: 500 }
    );
  }
}