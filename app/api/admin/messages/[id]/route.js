import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Message from '@/lib/models/Message';
import { admin } from '@/lib/auth';

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const result = await admin(req);
    if (result instanceof NextResponse) {
      return result;
    }

    const { id } = params;
    const { status } = await req.json();

    if (!['pending', 'responded', 'closed'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status' },
        { status: 400 }
      );
    }

    const message = await Message.findByIdAndUpdate(
      id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!message) {
      return NextResponse.json(
        { success: false, message: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: message,
      message: 'Message status updated successfully',
    });
  } catch (error) {
    console.error('Update message error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update message' },
      { status: 500 }
    );
  }
}