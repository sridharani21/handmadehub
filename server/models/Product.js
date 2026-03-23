const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Crochet', 'Jewelry', 'Candles', 'Bags', 'Home Decor', 'Keychains', 'Cards', 'Other'],
  },
  images: [{ type: String }],
  stock: { type: Number, default: 10 },
  isOutOfStock: { type: Boolean, default: false },
  tags: [String],
  averageRating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
