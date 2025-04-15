const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['meeting_room', 'private_office', 'open_desk'] },
  seats: { type: Number, required: true },
  smoking: { type: String, required: true, enum: ['yes', 'no'] },
  availability: { type: Date, required: true },
  term: { type: String, required: true, enum: ['day', 'week', 'month'] },
  price: { type: Number, required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Workspace', workspaceSchema);