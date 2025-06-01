// /app/api/payment/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Order from '@/app/lib/models/Order';
import { protect } from '@/app/lib/auth';
import { formatError } from '@/app/lib/utils';

// Process payment
export async function POST(req) {
  try {
    await connectDB();
    
    const result = await protect(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const { user } = result;
    const { orderId, paymentMethod } = await req.json();
    
    // Validate order
    const order = await Order.findById(orderId);
    
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Verify order belongs to user
    if (order.user.toString() !== user._id.toString()) {
      return NextResponse.json(
        { success: false, message: 'Not authorized' },
        { status: 401 }
      );
    }
    
    // Check if order is already paid
    if (order.isPaid) {
      return NextResponse.json(
        { success: false, message: 'Order is already paid' },
        { status: 400 }
      );
    }
    
    // For simplicity, we'll just mark the order as paid
    // In a real application, you would integrate with a payment gateway
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentMethod = paymentMethod;
    order.paymentResult = {
      id: 'PAYMENT_' + Math.random().toString(36).substring(2, 15),
      status: 'completed',
      update_time: new Date().toISOString(),
      email_address: user.email,
    };
    
    // Update order status if it's still pending
    if (order.status === 'pending') {
      order.status = 'processing';
    }
    
    const updatedOrder = await order.save();
    
    return NextResponse.json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}