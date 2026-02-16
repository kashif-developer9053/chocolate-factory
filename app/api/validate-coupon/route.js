// app/api/validate-coupon/route.js
import { NextResponse } from 'next/server';
import connectDB from '../lib/db';
import Coupon from '../lib/models/Coupons';

export async function POST(req) {
  try {
    await connectDB();

    const { couponCode, cartTotal, customerGroup = 'all', hasOnSaleItems = false } = await req.json();

    if (!couponCode || !cartTotal) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: 'Missing required fields'
      });
    }

    // Find the coupon
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    
    if (!coupon) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: 'Invalid coupon code'
      });
    }

    const now = new Date();

    // Check if coupon is active
    if (coupon.status !== 'active') {
      return NextResponse.json({
        success: false,
        valid: false,
        error: 'Coupon is not active'
      });
    }

    // Check date validity
    if (now < coupon.startDate) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: 'Coupon is not yet valid'
      });
    }

    if (now > coupon.endDate) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: 'Coupon has expired'
      });
    }

    // Check usage limits
    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: 'Coupon usage limit exceeded'
      });
    }

    // Check minimum purchase requirement
    if (coupon.minPurchase > 0 && cartTotal < coupon.minPurchase) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: `Minimum purchase of Rs. ${coupon.minPurchase} required`
      });
    }

    // Check customer group eligibility
    if (coupon.customerGroups !== 'all' && coupon.customerGroups !== customerGroup) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: 'Coupon not available for your customer group'
      });
    }

    // Check if coupon excludes sale items and cart has sale items
    if (coupon.excludeSaleItems && hasOnSaleItems) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: 'Coupon cannot be applied to sale items'
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = (cartTotal * coupon.value) / 100;
    } else if (coupon.type === 'fixed') {
      discountAmount = Math.min(coupon.value, cartTotal); // Don't exceed cart total
    }

    // Round to 2 decimal places
    discountAmount = Math.round(discountAmount * 100) / 100;

    return NextResponse.json({
      success: true,
      valid: true,
      coupon: {
        id: coupon._id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        description: coupon.description
      },
      discount: discountAmount,
      finalTotal: Math.max(0, cartTotal - discountAmount)
    });

  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json({
      success: false,
      valid: false,
      error: 'Unable to validate coupon'
    }, { status: 500 });
  }
}