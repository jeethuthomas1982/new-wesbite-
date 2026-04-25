const express = require('express');
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  const items = db.prepare(`
    SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.price, p.mrp, p.discount, p.image, p.pack_size, p.prescription_required
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = ?
  `).all(req.user.id);
  res.json(items);
});

router.post('/add', authenticateToken, (req, res) => {
  const { product_id, quantity = 1 } = req.body;
  if (!product_id) return res.status(400).json({ error: 'product_id required' });

  const product = db.prepare('SELECT id, stock FROM products WHERE id = ?').get(product_id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const existing = db.prepare('SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?').get(req.user.id, product_id);
  if (existing) {
    const newQty = existing.quantity + quantity;
    if (newQty > product.stock) return res.status(400).json({ error: 'Not enough stock' });
    db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(newQty, existing.id);
  } else {
    db.prepare('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)').run(req.user.id, product_id, quantity);
  }
  res.json({ success: true });
});

router.put('/update/:itemId', authenticateToken, (req, res) => {
  const { quantity } = req.body;
  if (!quantity || quantity < 1) return res.status(400).json({ error: 'Invalid quantity' });

  const item = db.prepare('SELECT id FROM cart_items WHERE id = ? AND user_id = ?').get(req.params.itemId, req.user.id);
  if (!item) return res.status(404).json({ error: 'Cart item not found' });

  db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(quantity, req.params.itemId);
  res.json({ success: true });
});

router.delete('/remove/:itemId', authenticateToken, (req, res) => {
  db.prepare('DELETE FROM cart_items WHERE id = ? AND user_id = ?').run(req.params.itemId, req.user.id);
  res.json({ success: true });
});

router.delete('/clear', authenticateToken, (req, res) => {
  db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.user.id);
  res.json({ success: true });
});

module.exports = router;
