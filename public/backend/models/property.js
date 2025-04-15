const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  address: { type: String, required: true },
  neighborhood: { type: String, required: true },
  sqft: { type: Number, required: true },
  garage: { type: String, required: true, enum: ['yes', 'no'] },
  publicTransport: { type: String, required: true, enum: ['yes', 'no'] },
  ownerEmail: { type: String, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', propertySchema);