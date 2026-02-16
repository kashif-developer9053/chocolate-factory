import { NextResponse } from 'next/server';
import connectDB from '../../lib/db';
import Message from '../../lib/models/Message';
import { admin } from '../../lib/auth';

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
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) {
      query.status = status;
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: {
        messages,
        page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const result = await admin(req);
    if (result instanceof NextResponse) {
      return result;
    }

    const { messageIds } = await req.json();

    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No message IDs provided' },
        { status: 400 }
      );
    }

    const deleteResult = await Message.deleteMany({
      _id: { $in: messageIds },
    });

    return NextResponse.json({
      success: true,
      message: `${deleteResult.deletedCount} message(s) deleted successfully`,
      deletedCount: deleteResult.deletedCount,
    });
  } catch (error) {
    console.error('Delete messages error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete messages' },
      { status: 500 }
    );
  }
}