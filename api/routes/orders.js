const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const OrdersController = require('../controllers/orders');

// Get all products route
router.get('/', checkAuth, OrdersController.orders_get_all);

// Post order route
router.post('/', checkAuth, OrdersController.orders_create_order);

// Get order by ID route
router.get('/:orderId', checkAuth, OrdersController.orders_get_order);

// Delete order by ID route
router.delete('/:orderId', checkAuth, OrdersController.orders_delete_order);

module.exports = router;
