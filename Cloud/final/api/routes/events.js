const express = require('express');
const Event = require('../models/event');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// GET /api/events - List all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/events - Create a new event (only for authenticated users)
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, date_time, location } = req.body;
  try {
    const event = await Event.create({
      title,
      description,
      date_time,
      location,
      created_by: req.userId,
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// GET /api/events/:id - Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/events/:id - Update an event (only accessible by the creator)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.created_by !== req.userId) {
      return res.status(403).json({ message: 'You are not the creator of this event' });
    }

    event.title = req.body.title || event.title;
    event.description = req.body.description || event.description;
    event.date_time = req.body.date_time || event.date_time;
    event.location = req.body.location || event.location;

    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/events/:id - Delete an event
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.created_by !== req.userId) {
      return res.status(403).json({ message: 'You are not the creator of this event' });
    }

    await event.destroy();
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
