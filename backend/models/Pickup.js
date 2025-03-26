// models/Pickup.js
const mongoose = require('mongoose');

const PickupSchema = new mongoose.Schema({
  foodDetails: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Food',
    required: true 
  },
  ngoDetails: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'NGO',
    required: true 
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'collected'],
    default: 'pending'
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  preferredPickupTime: Date,
  notes: String,
  // Add more fields as needed (e.g., actualPickupTime, driver details)
});

module.exports = mongoose.model('Pickup', PickupSchema);