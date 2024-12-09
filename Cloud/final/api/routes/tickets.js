const express = require('express');
const Ticket = require('../models/ticket');
const Event = require('../models/event');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// GET /api/tickets - List all tickets
router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      include: [{ model: Event, attributes: ['id', 'title', 'date_time', 'location'] }],
    });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/tickets - Create a new ticket (only for authenticated users)
router.post('/', authMiddleware, async (req, res) => {
  const { event_id, type, price, availability } = req.body;
  try {
    // Ensure event exists
    const event = await Event.findByPk(event_id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const ticket = await Ticket.create({
      event_id,
      type,
      price,
      availability,
    });
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/tickets/:id - Get ticket by ID
router.get('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id, {
      include: [{ model: Event, attributes: ['id', 'title', 'date_time', 'location'] }],
    });
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/tickets/:id - Update a ticket (only accessible by authenticated users)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.type = req.body.type || ticket.type;
    ticket.price = req.body.price || ticket.price;
    ticket.availability = req.body.availability || ticket.availability;

    await ticket.save();
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/tickets/:id - Delete a ticket
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    await ticket.destroy();
    res.json({ message: 'Ticket deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
