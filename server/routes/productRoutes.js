const express = require('express');
const router = express.Router();
const {
  getAllProducts, getProductById, createProduct,
  updateProduct, deleteProduct, toggleOutOfStock, upload
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', protect, adminOnly, upload.array('images', 5), createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.patch('/:id/stock', protect, adminOnly, toggleOutOfStock);

module.exports = router;
