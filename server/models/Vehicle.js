const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  make: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  mileage: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  features: [{
    type: String
  }],
  images: [{
    type: String,
    required: true
  }],
  status: {
    type: String,
    enum: ['available', 'sold', 'pending'],
    default: 'available'
  },
  location: {
    city: String,
    state: String,
    country: String
  },
  specifications: {
    transmission: String,
    fuelType: String,
    bodyStyle: String,
    color: String,
    doors: Number,
    seats: Number,
    vin: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
vehicleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Vehicle', vehicleSchema); 