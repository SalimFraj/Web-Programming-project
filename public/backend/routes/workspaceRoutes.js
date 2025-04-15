const express = require('express');
const router = express.Router();
const Workspace = require('../models/workspace');

// GET all workspaces
router.get('/', async (req, res) => {
  try {
    const workspaces = await Workspace.find().populate('property');
    res.json(workspaces);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single workspace by ID
router.get('/:id', async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id).populate('property');
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    res.json(workspace);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a new workspace
router.post('/', async (req, res) => {
  const workspace = new Workspace({
    type: req.body.type,
    seats: req.body.seats,
    smoking: req.body.smoking,
    availability: req.body.availability,
    term: req.body.term,
    price: req.body.price,
    property: req.body.property
  });
  try {
    const newWorkspace = await workspace.save();
    res.status(201).json(newWorkspace);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a workspace
router.put('/:id', async (req, res) => {
  try {
    const workspace = await Workspace.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    res.json(workspace);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a workspace
router.delete('/:id', async (req, res) => {
  try {
    const workspace = await Workspace.findByIdAndDelete(req.params.id);
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    res.json({ message: 'Workspace deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;