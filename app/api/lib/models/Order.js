// app/api/lib/models/Order.js - Fixed version
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  customer: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    username: {
      type: String,
      default: "unregistered user",
      trim: true
    }
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    postalCode: {
      type: String,
      trim: true,
      default: ""
    }
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    image: {
      type: String,
      default: ""
    }
  }],
  pricing: {
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    shipping: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'online', 'card'],
    default: 'cod'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'confirmed'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  deliveryDate: {
    type: Date
  },
  trackingNumber: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
OrderSchema.index({ 'customer.email': 1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ orderDate: -1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ trackingNumber: 1 });

// Generate unique tracking number function
function generateTrackingNumber() {
  const prefix = 'TCF'; // The Chocolate Factory
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  const random = Math.random().toString(36).substring(2, 4).toUpperCase(); // 2 random chars
  return `${prefix}${timestamp}${random}`;
}

// Pre-save middleware to generate tracking number and validate pricing
OrderSchema.pre('save', function(next) {
  console.log('Pre-save middleware triggered');
  
  // Generate tracking number if it doesn't exist
  if (!this.trackingNumber) {
    this.trackingNumber = generateTrackingNumber();
    console.log('Generated tracking number:', this.trackingNumber);
  }

  // Validate pricing
  const calculatedTotal = this.pricing.subtotal + this.pricing.shipping + this.pricing.tax;
  const difference = Math.abs(calculatedTotal - this.pricing.total);
  
  if (difference > 0.01) { // Allow for small rounding differences
    console.error('Total price calculation mismatch');
    return next(new Error('Total price calculation mismatch'));
  }
  
  console.log('Order about to be saved with tracking number:', this.trackingNumber);
  next();
});

// Virtual for order ID display
OrderSchema.virtual('displayId').get(function() {
  return this._id.toString().slice(-6).toUpperCase();
});

// Method to calculate total items
OrderSchema.methods.getTotalItems = function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
};

// Method to get customer full name
OrderSchema.methods.getCustomerFullName = function() {
  return `${this.customer.firstName} ${this.customer.lastName}`;
};

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);