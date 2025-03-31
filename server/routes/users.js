const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { auth, isDealer } = require('../middleware/auth');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('phone').optional().trim(),
  body('address').optional().isObject(),
  body('dealership').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updateFields = {};
    if (req.body.name) updateFields.name = req.body.name;
    if (req.body.phone) updateFields.phone = req.body.phone;
    if (req.body.address) updateFields.address = req.body.address;
    if (req.body.dealership) updateFields.dealership = req.body.dealership;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's vehicle listings
router.get('/vehicles', auth, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ seller: req.user._id })
      .sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dealer's statistics
router.get('/dealer/stats', auth, isDealer, async (req, res) => {
  try {
    const totalListings = await Vehicle.countDocuments({ seller: req.user._id });
    const activeListings = await Vehicle.countDocuments({
      seller: req.user._id,
      status: 'available'
    });
    const soldVehicles = await Vehicle.countDocuments({
      seller: req.user._id,
      status: 'sold'
    });

    res.json({
      totalListings,
      activeListings,
      soldVehicles
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dealer's inventory by status
router.get('/dealer/inventory', auth, isDealer, async (req, res) => {
  try {
    const { status } = req.query;
    const query = { seller: req.user._id };
    
    if (status) {
      query.status = status;
    }

    const vehicles = await Vehicle.find(query)
      .sort({ createdAt: -1 });

    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 