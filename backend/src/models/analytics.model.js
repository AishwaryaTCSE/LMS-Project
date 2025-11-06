const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

// Optional: index for faster queries by key
AnalyticsSchema.index({ key: 1 });

module.exports = mongoose.model('Analytics', AnalyticsSchema);
