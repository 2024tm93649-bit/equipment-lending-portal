const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequestSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
  qty: { type: Number, default: 1 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['pending','approved','rejected','issued','returned'], default: 'pending' },
  adminRemark: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Request', RequestSchema);
