const express = require('express');
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/place', authenticateToken, (req, res) => {
  const { payment_method, shipping_name, shipping_phone, shipping_address, shipping_city, shipping_pincode } = req.body;

  if (!shipping_name || !shipping_address || !shipping_city || !shipping_pincode)
    return res.status(400).json({ error: 'Shipping details are required' });

  const cartItems = db.prepare(`
    SELECT ci.quantity, p.id as product_id, p.name, p.price, p.stock
    FROM cart_items ci JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = ?
  `).all(req.user.id);

  if (!cartItems.length) return res.status(400).json({ error: 'Cart is empty' });

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery_fee = subtotal >= 499 ? 0 : 40;
  const total = subtotal + delivery_fee;

  const placeOrder = db.transaction(() => {
    const order = db.prepare(`
      INSERT INTO orders (user_id, total, subtotal, delivery_fee, payment_method, shipping_name, shipping_phone, shipping_address, shipping_city, shipping_pincode)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(req.user.id, total, subtotal, delivery_fee, payment_method || 'cod', shipping_name, shipping_phone, shipping_address, shipping_city, shipping_pincode);

    const orderId = order.lastInsertRowid;
    const insertItem = db.prepare('INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?)');
    for (const item of cartItems) {
      insertItem.run(orderId, item.product_id, item.name, item.quantity, item.price);
      db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(item.quantity, item.product_id);
    }
    db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.user.id);
    return orderId;
  });

  const orderId = placeOrder();
  res.json({ success: true, order_id: orderId, total });
});

router.get('/', authenticateToken, (req, res) => {
  const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  res.json(orders);
});

router.get('/:id', authenticateToken, (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
  res.json({ ...order, items });
});

module.exports = router;
