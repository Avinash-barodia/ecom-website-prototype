const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// Create item (for admin or dev) POST /api/items
router.post('/', async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err.message });
  }
});

// Update item PUT /api/items/:id
router.put('/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

// Delete item
router.delete('/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Error' });
  }
});

// GET /api/items with filters
// Query params: category, minPrice, maxPrice, q, sort, page, limit
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, q, sort, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
    if (q) filter.title = { $regex: q, $options: 'i' };

    let query = Item.find(filter);

    if (sort === 'price_asc') query = query.sort({ price: 1 });
    else if (sort === 'price_desc') query = query.sort({ price: -1 });
    else if (sort === 'newest') query = query.sort({ createdAt: -1 });

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Item.countDocuments(filter);
    const items = await query.skip(skip).limit(Number(limit));
    res.json({ items, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: 'Invalid id' });
  }
});

module.exports = router;
