const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser, toggleUserBlock, getUserOrders } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', protect, adminOnly, getAllUsers);
router.delete('/:id', protect, adminOnly, deleteUser);
router.patch('/:id/block', protect, adminOnly, toggleUserBlock);
router.get('/:id/orders', protect, adminOnly, getUserOrders);

module.exports = router;
