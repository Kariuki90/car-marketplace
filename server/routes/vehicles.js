const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const { auth, isDealer } = require('../middleware/auth');
const Vehicle = require('../models/Vehicle');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/vehicles');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
});

// Vehicle validation middleware
const vehicleValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('make').trim().notEmpty().withMessage('Make is required'),
  body('model').trim().notEmpty().withMessage('Model is required'),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Invalid year'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('mileage').isInt({ min: 0 }).withMessage('Mileage must be a positive number'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('location').isObject().withMessage('Location is required'),
  body('specifications').isObject().withMessage('Specifications are required')
];

// Get all vehicles with filters
router.get('/', async (req, res) => {
  try {
    const {
      make,
      model,
      minYear,
      maxYear,
      minPrice,
      maxPrice,
      status,
      location
    } = req.query;

    const query = {};

    if (make) query.make = make;
    if (model) query.model = model;
    if (minYear || maxYear) {
      query.year = {};
      if (minYear) query.year.$gte = parseInt(minYear);
      if (maxYear) query.year.$lte = parseInt(maxYear);
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (status) query.status = status;
    if (location) query['location.city'] = location;

    const vehicles = await Vehicle.find(query)
      .populate('seller', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single vehicle
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('seller', 'name email phone');
    
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create vehicle listing
router.post('/', auth, upload.array('images', 10), vehicleValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const images = req.files.map(file => `/uploads/vehicles/${file.filename}`);
    
    const vehicle = new Vehicle({
      ...req.body,
      seller: req.user._id,
      images
    });

    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update vehicle listing
router.put('/:id', auth, upload.array('images', 10), vehicleValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Check if user owns the vehicle
    if (vehicle.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updateData = { ...req.body };
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => `/uploads/vehicles/${file.filename}`);
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedVehicle);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete vehicle listing
router.delete('/:id', auth, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Check if user owns the vehicle
    if (vehicle.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await vehicle.remove();
    res.json({ message: 'Vehicle removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 