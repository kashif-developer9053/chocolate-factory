// /app/api/contact/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Contact from '@/app/lib/models/Contact';
import { formatError } from '@/app/lib/utils';
import nodemailer from 'nodemailer';

// Process contact form submissions
export async function POST(req) {
  try {
    await connectDB();
    
    const { name, email, subject, message } = await req.json();
    
    // Validate input
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: 'Please fill all fields' },
        { status: 400 }
      );
    }
    
    // Store contact form submission
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });
    
    // Send email notification (uncomment and configure in production)
    /* 
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.CONTACT_EMAIL,
      subject: `Contact Form: ${subject}`,
      text: message,
      html: `<p>From: ${name} (${email})</p><p>${message}</p>`,
    });
    */
    
    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      data: {
        id: contact._id,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}

// Get contact submissions (admin only)
export async function GET(req) {
  try {
    await connectDB();
    
    // Use admin middleware
    const { admin } = await import('@/app/lib/auth');
    const result = await admin(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status') || '';
    
    const skip = (page - 1) * limit;
    
    // Build query
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Contact.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      data: {
        contacts,
        page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}