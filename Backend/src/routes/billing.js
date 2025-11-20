// routes/billing.js
const express = require('express');
const router = express.Router();
const Billing = require('../models/billing');
const authenticate = require('../middleware/auth');
const isAdmin = require('../middleware/admin');
// List/create bills: listing is role-restricted
router.post('/', async (req, res) => {
  try {
    const bill = new Billing(req.body);
    await bill.save();
    res.send(bill);
  } catch (error) {
    res.status(500).send({ error: 'Failed to generate bill' });
  }
});
// GET bills - authenticated users; admin sees all, patient sees own bills
router.get('/', authenticate, async (req, res) => {
  try {
    const q = {};
    if (req.user.role === 'admin') {
      Object.assign(q, req.query || {});
    } else if (req.user.role === 'patient') {
      q.patientId = req.user._id;
    } else {
      // doctors or others can only see none by default (or extend if needed)
      return res.status(403).send({ error: 'Forbidden' });
    }
    const bills = await Billing.find(q);
    res.send(bills);
  } catch (error) {
    res.status(500).send({ error: 'Failed to search bills' });
  }
});
router.get('/:id', authenticate, async (req, res) => {
  try {
    const bill = await Billing.findById(req.params.id);
    if (!bill) return res.status(404).send({ error: 'Bill not found' });
    if (req.user.role !== 'admin' && bill.patientId?.toString() !== req.user._id.toString()) return res.status(403).send({ error: 'Forbidden' });
    res.send(bill);
  } catch (error) {
    res.status(404).send({ error: 'Bill not found' });
  }
});
router.post('/:id/payment', authenticate, async (req, res) => {
  try {
    const bill = await Billing.findById(req.params.id);
    if (!bill) return res.status(404).send({ error: 'Bill not found' });
    // allow admin or owning patient to make a payment
    if (req.user.role !== 'admin' && bill.patientId?.toString() !== req.user._id.toString()) {
      return res.status(403).send({ error: 'Forbidden' });
    }
    bill.paid = true;
    if (req.body && req.body.method) bill.paymentMethod = req.body.method;
    await bill.save();
    res.send(bill);
  } catch (error) {
    res.status(500).send({ error: 'Failed to make payment' });
  }
});

// Generic PATCH to update a bill (used for marking paid, changing paymentMethod, etc.)
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const bill = await Billing.findById(req.params.id);
    if (!bill) return res.status(404).send({ error: 'Bill not found' });
    // only admin or owning patient can patch (mark paid, change paymentMethod)
    if (req.user.role !== 'admin' && bill.patientId?.toString() !== req.user._id.toString()) {
      return res.status(403).send({ error: 'Forbidden' });
    }
    const updated = await Billing.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.send(updated);
  } catch (error) {
    res.status(500).send({ error: 'Failed to update bill' });
  }
});

// Generate a simple PDF invoice for a bill
router.get('/:id/invoice', authenticate, isAdmin, async (req, res) => {
  try {
    const bill = await Billing.findById(req.params.id);
    if (!bill) return res.status(404).send({ error: 'Bill not found' });
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${bill._id}.pdf`);
    doc.pipe(res);
    // Header
    doc.fontSize(20).text('AfyaBora Invoice', { align: 'center' });
    doc.moveDown();
    // Bill info
    doc.fontSize(12).text(`Invoice ID: ${bill._id}`);
    doc.text(`Patient: ${bill.patientId || ''}`);
    doc.text(`Date: ${bill.date ? new Date(bill.date).toLocaleString() : ''}`);
    doc.text(`Payment Method: ${bill.paymentMethod || '—'}`);
    doc.moveDown();
    doc.text('Services:', { underline: true });
    if (Array.isArray(bill.services)) {
      bill.services.forEach((s, i) => {
        doc.text(`${i + 1}. ${typeof s === 'string' ? s : s.name || JSON.stringify(s)}`);
      });
    } else {
      doc.text(bill.services || '—');
    }
    doc.moveDown();
    doc.fontSize(14).text(`Total: $${bill.total}`, { align: 'right' });
    doc.end();
  } catch (error) {
    console.error('Failed to generate PDF invoice', error);
    res.status(500).send({ error: 'Failed to generate invoice' });
  }
});

module.exports = router;
