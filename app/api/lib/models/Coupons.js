
// ==================== /lib/models/Coupon.js ====================
import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  type: { type: String, enum: ['percentage', 'fixed'], required: true },
  value: { type: Number, required: true },
  minPurchase: { type: Number, default: 0 },
  maxUses: { type: Number, default: 0 },
  usesPerCustomer: { type: Number, default: 1 },
  usedCount: { type: Number, default: 0 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'expired', 'scheduled'], required: true },
  excludeSaleItems: { type: Boolean, default: false },
  individualUse: { type: Boolean, default: true },
  description: { type: String },
  customerGroups: { type: String, enum: ['all', 'new', 'returning', 'vip'], default: 'all' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

couponSchema.pre('save', function() {
  this.updatedAt = new Date();
});

export default mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
