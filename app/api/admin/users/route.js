// /app/api/admin/users/route.js
import { NextResponse } from 'next/server';
import connectDB from '../../lib/db';
import User from '../../lib/models/User';
import { admin } from '../../lib/auth';
import { formatError } from '../../lib/utils';

// Get all users with role "user" (admin only)
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
    
    const skip = (page - 1) * limit;
    
    // Build query - only get users with role "user"
    const query = { role: 'user' };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
      // Add role filter to each search condition
      query.$and = [
        { role: 'user' },
        {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ]
        }
      ];
      delete query.$or;
      delete query.role;
    }
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await User.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      data: {
        users,
        page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}

// Delete user (admin only) - bulk delete support
export async function DELETE(req) {
  try {
    await connectDB();
    
    const result = await admin(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const { userIds } = await req.json();
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No user IDs provided' },
        { status: 400 }
      );
    }
    
    // Find users to delete and prevent admin from deleting themselves
    const usersToDelete = await User.find({ 
      _id: { $in: userIds },
      role: 'user' // Only allow deletion of users with role "user"
    });
    
    if (usersToDelete.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid users found to delete' },
        { status: 404 }
      );
    }
    
    // Check if admin is trying to delete themselves
    const adminId = result.user._id.toString();
    const containsAdmin = usersToDelete.some(user => user._id.toString() === adminId);
    
    if (containsAdmin) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete yourself' },
        { status: 400 }
      );
    }
    
    // Delete users
    const deleteResult = await User.deleteMany({ 
      _id: { $in: userIds },
      role: 'user'
    });
    
    return NextResponse.json({
      success: true,
      message: `${deleteResult.deletedCount} user(s) deleted successfully`,
      deletedCount: deleteResult.deletedCount
    });
  } catch (error) {
    console.error('Delete users error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}