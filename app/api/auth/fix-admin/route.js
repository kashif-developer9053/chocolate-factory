// /app/api/auth/fix-admin/route.js
import { NextResponse } from 'next/server';
import connectDB from '../../lib/db';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectDB();
    console.log('Connected to database');
    
    // Get a direct connection to the MongoDB collection
    // This bypasses Mongoose completely
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // Find the admin user
    const admin = await usersCollection.findOne({ email: 'admin@example.com' });
    
    if (!admin) {
      console.log('Admin user not found. Creating new admin...');
      
      // Create a new admin user with a properly hashed password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      const newAdmin = {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date()
      };
      
      await usersCollection.insertOne(newAdmin);
      console.log('New admin user created directly in the database');
      
      return NextResponse.json({
        success: true,
        message: 'Created new admin user',
        credentials: {
          email: 'admin@example.com',
          password: 'admin123'
        }
      });
    }
    
    console.log('Admin user found. Updating password...');
    console.log('Current password hash:', admin.password);
    
    // Generate a new password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    console.log('New password hash:', hashedPassword);
    
    // Update the admin password directly in the database
    // This bypasses any Mongoose hooks or middleware
    await usersCollection.updateOne(
      { _id: admin._id },
      { $set: { password: hashedPassword } }
    );
    
    console.log('Admin password updated');
    
    // Verify the new password works
    const updatedAdmin = await usersCollection.findOne({ email: 'admin@example.com' });
    const passwordCheck = await bcrypt.compare('admin123', updatedAdmin.password);
    
    console.log('Password verification:', passwordCheck ? 'PASSED' : 'FAILED');
    
    if (!passwordCheck) {
      console.log('Warning: Password verification failed!');
    }
    
    return NextResponse.json({
      success: true,
      message: passwordCheck 
        ? 'Admin password updated and verified' 
        : 'Admin password updated but verification failed',
      credentials: {
        email: 'admin@example.com',
        password: 'admin123'
      },
      verification: passwordCheck
    });
  } catch (error) {
    console.error('Fix admin error:', error);
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}