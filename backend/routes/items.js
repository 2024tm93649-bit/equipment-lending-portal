const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const auth = require('../middlewares/auth');

// List & search items
router.get('/', async (req, res) => {
  try {
    const { q, category, available } = req.query;
    const filter = {};
    if (q) filter.name = { $regex: q, $options: 'i' };
    if (category) filter.category = category;
    if (available === 'true') filter.available = { $gt: 0 };
    const items = await Item.find(filter).sort({ name: 1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get single item
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: 'Item not found' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Admin: add new item
router.post('/', auth(['admin']), async (req, res) => {
  try {
    const { name, category, condition, quantity, description } = req.body;
    const item = new Item({ name, category, condition, quantity, available: quantity, description });
    await item.save();
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Admin: update item
router.put('/:id', auth(['admin']), async (req, res) => {
  try {
    const { name, category, condition, quantity, description } = req.body;
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: 'Item not found' });

    const qtyDiff = (quantity || item.quantity) - item.quantity;
    item.name = name || item.name;
    item.category = category || item.category;
    item.condition = condition || item.condition;
    item.quantity = quantity || item.quantity;
    item.available = Math.max(0, item.available + qtyDiff);
    item.description = description || item.description;
    await item.save();
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Admin: delete item
router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Item deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
