const express = require('express');
const Payment = require('../models/payment');
const Registration = require('../models/registration');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// GET /api/payments - List all payments
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [{ model: Registration, attributes: ['id', 'ticket_id', 'number_of_tickets'] }],
    });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/payments - Create a new payment (only for authenticated users)
router.post('/', authMiddleware, async (req, res) => {
  const { registration_id, amount, status } = req.body;
  try {
    // Ensure registration exists
    const registration = await Registration.findByPk(registration_id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    const payment = await Payment.create({
      registration_id,
      amount,
      status: status || 'pending',
      payment_date: new Date(),
    });
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/payments/:id - Get payment by ID
router.get('/:id', async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: [{ model: Registration, attributes: ['id', 'ticket_type', 'number_of_tickets'] }],
    });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/payments/:id - Update a payment (only accessible by authenticated users)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.amount = req.body.amount || payment.amount;
    payment.status = req.body.status || payment.status;

    await payment.save();
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/payments/:id - Delete a payment
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    await payment.destroy();
    res.json({ message: 'Payment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
