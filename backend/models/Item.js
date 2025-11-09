const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, default: 'General' },
  condition: { type: String, default: 'Good' },
  quantity: { type: Number, default: 1 },
  available: { type: Number, default: 1 },
  description: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Item', ItemSchema);
