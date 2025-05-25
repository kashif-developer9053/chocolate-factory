// /app/lib/models/Setting.js
import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  group: {
    type: String,
    default: 'general',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
SettingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Setting = mongoose.models.Setting || mongoose.model('Setting', SettingSchema);

export default Setting;