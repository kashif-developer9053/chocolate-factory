// /app/api/admin/orders/[id]/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Order from '@/app/lib/models/Order';
import { admin } from '@/app/lib/auth';
import { formatError } from '@/app/lib/utils';

// Get order details (admin only)
export async function GET(req, { params }) {
  try {
    await connectDB();
    
    const result = await admin(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const { id } = params;
    
    const order = await Order.findById(id).populate('user', 'name email');
    
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}

// /app/api/admin/orders/[id]/route.js (continued)
export async function PUT(req, { params }) {
  try {
    await connectDB();
    
    const result = await admin(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const { id } = params;
    const { status, trackingNumber, isDelivered, isPaid } = await req.json();
    
    const order = await Order.findById(id);
    
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Update order fields
    if (status) order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    
    if (isDelivered !== undefined) {
      order.isDelivered = isDelivered;
      if (isDelivered) {
        order.deliveredAt = Date.now();
      }
    }
    
    if (isPaid !== undefined) {
      order.isPaid = isPaid;
      if (isPaid) {
        order.paidAt = Date.now();
      }
    }
    
    const updatedOrder = await order.save();
    
    return NextResponse.json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}