// /app/lib/models/Discount.js
import mongoose from 'mongoose';

const DiscountSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please provide a discount code'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  description: {
    type: String,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage',
  },
  discountValue: {
    type: Number,
    required: [true, 'Please provide a discount value'],
    min: [0, 'Discount value cannot be negative'],
  },
  minPurchaseAmount: {
    type: Number,
    default: 0,
  },
  maxDiscountAmount: {
    type: Number,
    default: null,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide an end date'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  usageLimit: {
    type: Number,
    default: null,
  },
  usageCount: {
    type: Number,
    default: 0,
  },
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  applicableCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Discount = mongoose.models.Discount || mongoose.model('Discount', DiscountSchema);

export default Discount;