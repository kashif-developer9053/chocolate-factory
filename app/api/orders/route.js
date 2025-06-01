// app/api/orders/route.js
import { NextResponse } from 'next/server';
import connectDB from '../lib/db';
import Order from '../lib/models/Order';
import { formatError } from '../lib/utils';

// Create a new order
export async function POST(req) {
  try {
    await connectDB();
    console.log('Connected to database for order creation');

    const orderData = await req.json();
    console.log('Received order data:', JSON.stringify(orderData, null, 2));

    // Validate required fields
    const requiredFields = ['customer', 'address', 'items', 'pricing'];
    for (let field of requiredFields) {
      if (!orderData[field]) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate customer info
    const requiredCustomerFields = ['firstName', 'lastName', 'email', 'phone'];
    for (let field of requiredCustomerFields) {
      if (!orderData.customer[field]) {
        return NextResponse.json(
          { success: false, message: `Missing customer field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate items
    if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    // Create the order
    const order = await Order.create({
      customer: {
        firstName: orderData.customer.firstName,
        lastName: orderData.customer.lastName,
        email: orderData.customer.email,
        phone: orderData.customer.phone,
        username: orderData.customer.username || "unregistered user"
      },
      address: {
        street: orderData.address.street,
        city: orderData.address.city,
        postalCode: orderData.address.postalCode || ""
      },
      items: orderData.items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || ""
      })),
      pricing: {
        subtotal: orderData.pricing.subtotal,
        shipping: orderData.pricing.shipping,
        tax: orderData.pricing.tax,
        total: orderData.pricing.total
      },
      paymentMethod: orderData.paymentMethod || "cod",
      paymentStatus: orderData.paymentStatus || "pending",
      orderStatus: orderData.orderStatus || "confirmed",
      notes: orderData.notes || "",
      orderDate: orderData.orderDate || new Date(),
      // Explicitly generate tracking number if not provided
      trackingNumber: orderData.trackingNumber || `TCF${Date.now().toString().slice(-6)}${Math.random().toString(36).substring(2, 4).toUpperCase()}`
    });

    console.log('Order created successfully:', order._id);
    console.log('Tracking number assigned:', order.trackingNumber);

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      data: order
    }, { status: 201 });

  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: formatError(error) || 'Failed to create order',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Get all orders (for admin)
export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');
    const email = searchParams.get('email');
    const trackingNumber = searchParams.get('trackingNumber');
    const search = searchParams.get('search'); // General search term
    
    const skip = (page - 1) * limit;
    const query = {};

    if (status) {
      query.orderStatus = status;
    }

    if (email) {
      query['customer.email'] = email;
    }

    if (trackingNumber) {
      query.trackingNumber = trackingNumber;
    }

    // General search by order ID (last 6 characters)
    if (search) {
      if (search.length === 6) {
        // Search by partial Order ID - fixed syntax error here
        query._id = { $regex: search.toLowerCase() + '$', $options: 'i' };
      } else if (search.length === 24) {
        // Full MongoDB ObjectId
        query._id = search;
      }
    }

    console.log('Search query:', query);

    const orders = await Order.find(query)
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Order.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: {
        orders,
        page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}