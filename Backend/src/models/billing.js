// models/billing.js
const mongoose = require('mongoose');
const billingSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  services: { type: String, required: true },
  total: { type: Number, required: true },
  paid: { type: Boolean, required: true },
  paymentMethod: { type: String, required: true, enum: ['Bank', 'Mpesa']}
});
const Billing = mongoose.model('Billing', billingSchema);
module.exports = Billing;
