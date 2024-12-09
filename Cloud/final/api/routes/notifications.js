const express = require('express');
const Notification = require('../models/notification');
const User = require('../models/user');
const Event = require('../models/event');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// GET /api/notifications - List all notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      include: [
        { model: User, attributes: ['id', 'first_name', 'email'] },
        { model: Event, attributes: ['id', 'title', 'description', 'date_time'] },
      ],
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/notifications - Create a new notification (only for authenticated users)
router.post('/', authMiddleware, async (req, res) => {
  const { user_id, event_id, message } = req.body;
  try {
    const notification = await Notification.create({
      user_id,
      event_id,
      message,
      sent_at: new Date(),
    });
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/notifications/:id - Get notification by ID
router.get('/:id', async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Event, attributes: ['id', 'title', 'date_time'] },
      ],
    });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/notifications/:id - Update a notification
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.message = req.body.message || notification.message;
    notification.sent_at = req.body.sent_at || notification.sent_at;

    await notification.save();
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/notifications/:id - Delete a notification
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.destroy();
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
