const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
  item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
  qty: { type: Number, default: 1 }
});

const UserSchema = new Schema({
  name: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  cart: [CartItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
