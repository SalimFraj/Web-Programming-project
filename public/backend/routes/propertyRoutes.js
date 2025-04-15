const express = require('express');
const router = express.Router();
const Property = require('../models/property');
const Workspace = require('../models/workspace');

// GET all properties (filtered by ownerEmail if provided)
router.get('/', async (req, res) => {
  try {
    const { ownerEmail } = req.query; // Extract ownerEmail from query parameters
    let query = {};
    if (ownerEmail) {
      query.ownerEmail = ownerEmail; // Filter by ownerEmail if provided
    }
    const properties = await Property.find(query);
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a new property
router.post('/', async (req, res) => {
  const property = new Property({
    address: req.body.address,
    neighborhood: req.body.neighborhood,
    sqft: req.body.sqft,
    garage: req.body.garage,
    publicTransport: req.body.publicTransport,
    ownerEmail: req.body.ownerEmail
  });
  try {
    const newProperty = await property.save();
    res.status(201).json(newProperty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a property
router.put('/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a property and its associated workspaces
router.delete('/:id', async (req, res) => {
  try {
    const propertyId = req.params.id;

    // Delete the property
    const property = await Property.findByIdAndDelete(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Delete all workspaces associated with this property
    await Workspace.deleteMany({ property: propertyId });

    res.json({ message: 'Property and associated workspaces deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;