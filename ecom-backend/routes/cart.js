const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Item = require('../models/Item');

// get cart
router.get('/', auth, async (req, res) => {
  const user = await req.user.populate('cart.item');
  res.json({ cart: user.cart });
});

// add to cart: { itemId, qty }
router.post('/add', auth, async (req, res) => {
  const { itemId, qty = 1 } = req.body;
  if (!itemId) return res.status(400).json({ message: 'itemId required' });
  const item = await Item.findById(itemId);
  if (!item) return res.status(404).json({ message: 'Item not found' });

  const user = req.user;
  const existing = user.cart.find(ci => ci.item.toString() === itemId.toString());
  if (existing) {
    existing.qty = existing.qty + Number(qty);
  } else {
    user.cart.push({ item: itemId, qty: Number(qty) });
  }
  await user.save();
  await user.populate('cart.item');
  res.json({ cart: user.cart });
});

// remove item: { itemId }
router.post('/remove', auth, async (req, res) => {
  const { itemId } = req.body;
  if (!itemId) return res.status(400).json({ message: 'itemId required' });
  const user = req.user;
  user.cart = user.cart.filter(ci => ci.item.toString() !== itemId.toString());
  await user.save();
  await user.populate('cart.item');
  res.json({ cart: user.cart });
});

// update qty: { itemId, qty }
router.post('/update', auth, async (req, res) => {
  const { itemId, qty } = req.body;
  if (!itemId || typeof qty === 'undefined') return res.status(400).json({ message: 'itemId & qty required' });
  const user = req.user;
  const existing = user.cart.find(ci => ci.item.toString() === itemId.toString());
  if (!existing) return res.status(404).json({ message: 'Item not in cart' });
  existing.qty = Number(qty);
  if (existing.qty <= 0) {
    user.cart = user.cart.filter(ci => ci.item.toString() !== itemId.toString());
  }
  await user.save();
  await user.populate('cart.item');
  res.json({ cart: user.cart });
});

module.exports = router;
