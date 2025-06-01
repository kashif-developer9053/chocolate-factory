// /app/api/admin/reports/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import User from '@/app/lib/models/User';
import Product from '@/app/lib/models/Product';
import Order from '@/app/lib/models/Order';
import Category from '@/app/lib/models/Category';
import { admin } from '@/app/lib/auth';
import { formatError } from '@/app/lib/utils';

// Generate reports (admin only)
export async function GET(req) {
  try {
    await connectDB();
    
    const result = await admin(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const { searchParams } = new URL(req.url);
    const reportType = searchParams.get('type') || 'sales';
    const period = searchParams.get('period') || 'week';
    
    let startDate, endDate;
    const today = new Date();
    
    // Calculate date range based on period
    switch (period) {
      case 'day':
        startDate = new Date(today);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'week':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        endDate = today;
        break;
      case 'month':
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 1);
        endDate = today;
        break;
      case 'year':
        startDate = new Date(today);
        startDate.setFullYear(today.getFullYear() - 1);
        endDate = today;
        break;
      default:
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        endDate = today;
    }
    
    let reportData;
    
    // Generate report based on type
    switch (reportType) {
      case 'sales':
        // Sales report
        reportData = await Order.aggregate([
          {
            $match: {
              createdAt: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              totalSales: { $sum: '$totalPrice' },
              count: { $sum: 1 },
            },
          },
          {
            $sort: { _id: 1 },
          },
        ]);
        break;
      
      case 'products':
        // Top selling products
        reportData = await Order.aggregate([
          {
            $match: {
              createdAt: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $unwind: '$items',
          },
          {
            $group: {
              _id: '$items.product',
              productName: { $first: '$items.name' },
              totalSold: { $sum: '$items.quantity' },
              totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
            },
          },
          {
            $sort: { totalSold: -1 },
          },
          {
            $limit: 10,
          },
        ]);
        break;
      
      case 'categories':
        // Sales by category
        const orders = await Order.find({
          createdAt: { $gte: startDate, $lte: endDate },
        }).populate({
          path: 'items.product',
          select: 'category',
          populate: {
            path: 'category',
            select: 'name',
          },
        });
        
        // Process orders to group by category
        const categorySales = {};
        
        orders.forEach(order => {
          order.items.forEach(item => {
            if (item.product && item.product.category) {
              const categoryId = item.product.category._id.toString();
              const categoryName = item.product.category.name;
              
              if (!categorySales[categoryId]) {
                categorySales[categoryId] = {
                  _id: categoryId,
                  name: categoryName,
                  totalSold: 0,
                  totalRevenue: 0,
                };
              }
              
              categorySales[categoryId].totalSold += item.quantity;
              categorySales[categoryId].totalRevenue += item.price * item.quantity;
            }
          });
        });
        
        reportData = Object.values(categorySales).sort((a, b) => b.totalRevenue - a.totalRevenue);
        break;
      
      case 'customers':
        // Top customers
        reportData = await Order.aggregate([
          {
            $match: {
              createdAt: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: '$user',
              orderCount: { $sum: 1 },
              totalSpent: { $sum: '$totalPrice' },
            },
          },
          {
            $sort: { totalSpent: -1 },
          },
          {
            $limit: 10,
          },
        ]);
        
        // Populate user info
        for (let i = 0; i < reportData.length; i++) {
          const user = await User.findById(reportData[i]._id).select('name email');
          if (user) {
            reportData[i].name = user.name;
            reportData[i].email = user.email;
          }
        }
        break;
      
      default:
        reportData = [];
    }
    
    return NextResponse.json({
      success: true,
      data: {
        reportType,
        period,
        startDate,
        endDate,
        results: reportData,
      },
    });
  } catch (error) {
    console.error('Generate report error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}