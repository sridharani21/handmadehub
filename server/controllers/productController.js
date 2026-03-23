const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, `product-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });

const getAllProducts = async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = {};
    if (category && category !== 'All') query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    let sortOpt = {};
    if (sort === 'price_asc') sortOpt = { price: 1 };
    else if (sort === 'price_desc') sortOpt = { price: -1 };
    else if (sort === 'rating') sortOpt = { averageRating: -1 };
    else sortOpt = { createdAt: -1 };
    const products = await Product.find(query).sort(sortOpt);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
    const product = await Product.create({ ...req.body, images });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const toggleOutOfStock = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    product.isOutOfStock = !product.isOutOfStock;
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, toggleOutOfStock, upload };
