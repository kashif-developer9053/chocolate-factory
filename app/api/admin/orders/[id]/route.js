// app/api/orders/[id]/route.js
import { NextResponse } from 'next/server';
import connectDB from '../../lib/db';
import Order from '../../lib/models/Order';
import { formatError } from '../../lib/utils';

// Get single order by ID
export async function GET(req, { params }) {
  try {
    await connectDB();
    
    const order = await Order.findById(params.id).lean();
    
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}

// Update order status
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    
    const updateData = await req.json();
    
    // Validate order status if provided
    if (updateData.orderStatus) {
      const validStatuses = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(updateData.orderStatus)) {
        return NextResponse.json(
          { success: false, message: 'Invalid order status' },
          { status: 400 }
        );
      }
    }

    // Validate payment status if provided
    if (updateData.paymentStatus) {
      const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
      if (!validPaymentStatuses.includes(updateData.paymentStatus)) {
        return NextResponse.json(
          { success: false, message: 'Invalid payment status' },
          { status: 400 }
        );
      }
    }

    const order = await Order.findByIdAndUpdate(
      params.id,
      { 
        ...updateData,
        ...(updateData.orderStatus === 'delivered' && { deliveryDate: new Date() })
      },
      { new: true, runValidators: true }
    );

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      data: order
    });

  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}

// Delete order (admin only)
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    
    const order = await Order.findByIdAndDelete(params.id);
    
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('Delete order error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}