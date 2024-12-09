const express = require('express');
const Registration = require('../models/registration');
const Event = require('../models/event');
const User = require('../models/user');
const Ticket = require('../models/ticket');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// GET /api/registrations - List all registrations
router.get('/', async (req, res) => {
  try {
    const registrations = await Registration.findAll({
      include: [
        { model: User, attributes: ['id', 'first_name', 'email'] },
        {
          model: Event,
          attributes: ['id', 'title', 'description', 'date_time', 'location'],
        },
      ],
    });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.toString() });
  }
});

// POST /api/registrations - Create a new registration (only for authenticated users)
router.post('/', authMiddleware, async (req, res) => {
  const { event_id, ticket_id, number_of_tickets } = req.body;

  if (!event_id || !ticket_type || !number_of_tickets) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Ensure event exists
    const event = await Event.findByPk(event_id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const ticket = await Ticket.findByPk(ticket_id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const registration = await Registration.create({
      event_id,
      user_id: req.userId, // userId from JWT middleware
      ticket_id,
      number_of_tickets,
      registration_date: new Date(),
    });

    res.status(201).json(registration);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/registrations/:id - Get registration by ID
router.get('/:id', async (req, res) => {
  try {
    const registration = await Registration.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Event, attributes: ['id', 'title', 'date_time', 'location'] },
      ],
    });
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    res.json(registration);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/registrations/:id - Update a registration (only by the owner)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const registration = await Registration.findByPk(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    if (registration.user_id !== req.userId) {
      return res.status(403).json({ message: 'You are not the owner of this registration' });
    }

    registration.ticket_id = req.body.ticket_id || registration.ticket_id;
    registration.number_of_tickets = req.body.number_of_tickets || registration.number_of_tickets;

    await registration.save();
    res.json(registration);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/registrations/:id - Delete a registration
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const registration = await Registration.findByPk(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    if (registration.user_id !== req.userId) {
      return res.status(403).json({ message: 'You are not the owner of this registration' });
    }

    await registration.destroy();
    res.json({ message: 'Registration deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
