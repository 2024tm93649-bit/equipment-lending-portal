const express = require('express');
const router = express.Router();
const RequestModel = require('../models/Request');
const Item = require('../models/Item');
const auth = require('../middlewares/auth');


// Create request (students/staff)
router.post('/', auth(['student','staff','admin']), async (req, res) => {
  try {
    const { itemId, qty, startDate, endDate } = req.body;

    // Check overlapping approved or issued requests
    const overlapping = await RequestModel.findOne({
      item: itemId,
      status: { $in: ['approved','issued'] },
      $or: [
        { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }
      ]
    });
    if (overlapping) {
      return res.status(400).json({ msg: 'Overlapping booking exists for selected dates' });
    }

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ msg: 'Item not found' });
    if (qty > item.available) return res.status(400).json({ msg: 'Not enough available' });

    const request = new RequestModel({
      user: req.user.id,
      item: itemId,
      qty,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: 'pending'
    });
    await request.save();
    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get my requests
router.get('/my', auth(['student','staff','admin']), async (req, res) => {
  try {
    const list = await RequestModel.find({ user: req.user.id })
      .populate('item')
      .sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Admin/staff: view all requests
router.get('/', auth(['admin','staff']), async (req, res) => {
  try {
    const list = await RequestModel.find()
      .populate('item user')
      .sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Admin/staff: change request status
router.put('/:id/status', auth(['admin','staff']), async (req, res) => {
  try {
    const { status, adminRemark } = req.body;
    const reqEntry = await RequestModel.findById(req.params.id).populate('item');
    if (!reqEntry) return res.status(404).json({ msg: 'Request not found' });

    // If approved, reduce available count
    if (status === 'approved') {
      if (reqEntry.qty > reqEntry.item.available) {
        return res.status(400).json({ msg: 'Not enough items to approve' });
      }
      reqEntry.item.available -= reqEntry.qty;
      await reqEntry.item.save();
    }

    // If returned, increase available count
    if (status === 'returned') {
      reqEntry.item.available += reqEntry.qty;
      await reqEntry.item.save();
    }

    reqEntry.status = status;
    reqEntry.adminRemark = adminRemark || reqEntry.adminRemark;
    await reqEntry.save();
    res.json(reqEntry);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
