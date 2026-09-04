const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  providerName: {
    type: String,
    required: true,
    trim: true,
  },
  providerEmail: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Plumbing',
      'Electrical',
      'Home Cleaning',
      'Painting',
      'AC Repair',
      'Vehicle Service',
      'Tech Support',
      'Carpentry',
      'Gardening',
      'Roofing',
      'Pest Control',
      'Appliance Repair',
      'Other',
    ],
  },
  experience: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    address: { type: String, default: 'Colombo, Sri Lanka' },
    lat: { type: Number, default: 6.9271 },
    lng: { type: Number, default: 79.8612 },
    city: { type: String, default: 'Colombo' },
  },
  rating: {
    type: Number,
    default: 5.0,
  },
  reviewCount: {
    type: Number,
    default: 1,
  },
  badge: {
    type: String,
    default: 'Pro Provider',
  },
  coverImage: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
