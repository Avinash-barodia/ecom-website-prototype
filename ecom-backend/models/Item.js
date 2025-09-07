const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  images: [String],
  category: String,
  stock: { type: Number, default: 100 }
}, { timestamps: true });

module.exports = mongoose.model('Item', ItemSchema);
