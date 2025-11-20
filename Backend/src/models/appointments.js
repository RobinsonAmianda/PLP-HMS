// models/appointments.js
const mongoose = require('mongoose');
const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  dateTime: { type: Date, required: true },
  status: { type: String, required: true },
  notes: { type: String }
});
const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
