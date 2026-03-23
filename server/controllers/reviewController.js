const Review = require('../models/Review');
const Product = require('../models/Product');

const addReview = async (req, res) => {
  try {
    const existing = await Review.findOne({ product: req.params.productId, user: req.user._id });
    if (existing) return res.status(400).json({ message: 'You already reviewed this product' });

    const review = await Review.create({
      product: req.params.productId,
      user: req.user._id,
      userName: req.user.name,
      rating: req.body.rating,
      comment: req.body.comment,
    });

    // Update product average rating
    const reviews = await Review.find({ product: req.params.productId });
    const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(req.params.productId, {
      averageRating: avg.toFixed(1),
      numReviews: reviews.length,
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addReview, getProductReviews, deleteReview };
