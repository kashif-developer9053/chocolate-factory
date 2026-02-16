// ==================== /lib/couponValidator.js ====================
import connectDB from './db';
import Coupon from './models/Coupons';

export async function validateCoupon(couponCode, cartTotal, customerId = null, customerGroup = 'all', hasOnSaleItems = false) {
  try {
    await connectDB();

    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    
    if (!coupon) {
      return {
        valid: false,
        error: 'Invalid coupon code',
        discount: 0
      };
    }

    const now = new Date();

    if (coupon.status !== 'active') {
      return {
        valid: false,
        error: 'Coupon is not active',
        discount: 0
      };
    }

    if (now < coupon.startDate) {
      return {
        valid: false,
        error: 'Coupon is not yet valid',
        discount: 0
      };
    }

    if (now > coupon.endDate) {
      return {
        valid: false,
        error: 'Coupon has expired',
        discount: 0
      };
    }

    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      return {
        valid: false,
        error: 'Coupon usage limit exceeded',
        discount: 0
      };
    }

    if (coupon.minPurchase > 0 && cartTotal < coupon.minPurchase) {
      return {
        valid: false,
        error: `Minimum purchase of $${coupon.minPurchase} required`,
        discount: 0
      };
    }

    if (coupon.customerGroups !== 'all' && coupon.customerGroups !== customerGroup) {
      return {
        valid: false,
        error: 'Coupon not available for your customer group',
        discount: 0
      };
    }

    if (coupon.excludeSaleItems && hasOnSaleItems) {
      return {
        valid: false,
        error: 'Coupon cannot be applied to sale items',
        discount: 0
      };
    }

    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = (cartTotal * coupon.value) / 100;
    } else if (coupon.type === 'fixed') {
      discountAmount = Math.min(coupon.value, cartTotal);
    }

    discountAmount = Math.round(discountAmount * 100) / 100;

    return {
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
    };

  } catch (error) {
    console.error('Coupon validation error:', error);
    return {
      valid: false,
      error: 'Unable to validate coupon',
      discount: 0
    };
  }
}

export async function applyCoupon(couponId) {
  try {
    await connectDB();

    const coupon = await Coupon.findById(couponId);
    
    if (!coupon) {
      return {
        success: false,
        error: 'Coupon not found'
      };
    }

    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      return {
        success: false,
        error: 'Coupon usage limit exceeded'
      };
    }

    coupon.usedCount += 1;
    await coupon.save();

    return {
      success: true,
      usedCount: coupon.usedCount,
      remainingUses: coupon.maxUses > 0 ? coupon.maxUses - coupon.usedCount : null
    };

  } catch (error) {
    console.error('Apply coupon error:', error);
    return {
      success: false,
      error: 'Unable to apply coupon'
    };
  }
}

export async function getActiveCoupons() {
  try {
    await connectDB();

    const now = new Date();
    
    const coupons = await Coupon.find({
      status: 'active',
      startDate: { $lte: now },
      endDate: { $gte: now },
      $or: [
        { maxUses: 0 },
        { $expr: { $lt: ['$usedCount', '$maxUses'] } }
      ]
    }).select('code type value description minPurchase customerGroups').lean();

    return coupons;

  } catch (error) {
    console.error('Get active coupons error:', error);
    return [];
  }
}

export async function checkCouponAvailability(couponCode) {
  try {
    await connectDB();

    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() })
      .select('code type value description status startDate endDate maxUses usedCount minPurchase customerGroups')
      .lean();
    
    if (!coupon) {
      return {
        exists: false,
        available: false
      };
    }

    const now = new Date();
    const isInDateRange = now >= coupon.startDate && now <= coupon.endDate;
    const hasUsageAvailable = coupon.maxUses === 0 || coupon.usedCount < coupon.maxUses;
    const isActive = coupon.status === 'active';

    return {
      exists: true,
      available: isActive && isInDateRange && hasUsageAvailable,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        description: coupon.description,
        minPurchase: coupon.minPurchase,
        customerGroups: coupon.customerGroups
      },
      restrictions: {
        startDate: coupon.startDate,
        endDate: coupon.endDate,
        maxUses: coupon.maxUses,
        usedCount: coupon.usedCount,
        remainingUses: coupon.maxUses > 0 ? coupon.maxUses - coupon.usedCount : null
      }
    };

  } catch (error) {
    console.error('Check coupon availability error:', error);
    return {
      exists: false,
      available: false,
      error: 'Unable to check coupon availability'
    };
  }
}