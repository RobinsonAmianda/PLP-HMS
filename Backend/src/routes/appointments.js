// routes/appointments.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const Appointment = require('../models/appointments');
const Doctors = require('../models/doctors');
const { isDoctor, isPatient } = require('../middleware/roles');

// Create appointment (authenticated users)
router.post('/', authenticate, async (req, res) => {
  try {
    // enforce role-based ownership: doctors create appointments for themselves; patients for themselves
    const payload = { ...req.body };
    if (req.user.role === 'doctor') {
      // try to map doctor user to a Doctor record (match by email)
      const d = await Doctors.findOne({ email: req.user.email });
      payload.doctorId = d ? d._id : req.user._id;
    }
    if (req.user.role === 'patient') {
      payload.patientId = req.user._id;
    }
    // ensure dateTime exists
    if (!payload.dateTime) return res.status(400).send({ error: 'dateTime is required' });
    const appointment = new Appointment(payload);
    await appointment.save();
    // populate names for convenience
    const populated = await Appointment.findById(appointment._id).populate('patientId', 'name').populate('doctorId', 'name');
    const out = populated.toObject();
    out.patientName = populated.patientId ? populated.patientId.name : undefined;
    out.doctorName = populated.doctorId ? populated.doctorId.name : undefined;
    res.send(out);
  } catch (error) {
    res.status(500).send({ error: 'Failed to schedule appointment' });
  }
});
// List appointments - role-based: admin(all), doctor(own), patient(own)
router.get('/', authenticate, async (req, res) => {
  try {
    const q = {};
    if (req.user.role === 'admin') {
      // admin: can filter via query
      Object.assign(q, req.query || {});
    } else if (req.user.role === 'doctor') {
      // map doctor user -> doctor's record id if possible
      const d = await Doctors.findOne({ email: req.user.email });
      q.doctorId = d ? d._id : req.user._id;
    } else if (req.user.role === 'patient') {
      q.patientId = req.user._id;
    } else {
      return res.status(403).send({ error: 'Forbidden' });
    }
    const appointments = await Appointment.find(q).sort({ dateTime: -1 }).populate('patientId', 'name').populate('doctorId', 'name');
    // map to include patientName/doctorName convenience fields
    const out = appointments.map((a) => {
      const obj = a.toObject();
      obj.patientName = a.patientId ? a.patientId.name : undefined;
      obj.doctorName = a.doctorId ? a.doctorId.name : undefined;
      return obj;
    });
    res.send(out);
  } catch (error) {
    res.status(500).send({ error: 'Failed to search appointments' });
  }
});
router.get('/:id', authenticate, async (req, res) => {
  try {
  const appointment = await Appointment.findById(req.params.id).populate('patientId', 'name').populate('doctorId', 'name');
    if (!appointment) return res.status(404).send({ error: 'Appointment not found' });
    // only admin, assigned doctor, or owning patient can view
    let userDoctorId = null;
    if (req.user.role === 'doctor') {
      const d = await Doctors.findOne({ email: req.user.email });
      userDoctorId = d ? d._id.toString() : req.user._id.toString();
    }
    if (req.user.role !== 'admin' && req.user._id.toString() !== (appointment.patientId || '').toString() && userDoctorId !== (appointment.doctorId || '').toString() && req.user._id.toString() !== (appointment.doctorId || '').toString()) {
      return res.status(403).send({ error: 'Forbidden' });
    }
    const out = appointment.toObject();
    out.patientName = appointment.patientId ? appointment.patientId.name : undefined;
    out.doctorName = appointment.doctorId ? appointment.doctorId.name : undefined;
    res.send(out);
  } catch (error) {
    res.status(404).send({ error: 'Appointment not found' });
  }
});
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).send({ error: 'Appointment not found' });
    // admin or owning patient or assigned doctor can delete
    let userDocId2 = null;
    if (req.user.role === 'doctor') {
      const d2 = await Doctors.findOne({ email: req.user.email });
      userDocId2 = d2 ? d2._id.toString() : req.user._id.toString();
    }
    if (req.user.role !== 'admin' && req.user._id.toString() !== (appt.patientId || '').toString() && userDocId2 !== (appt.doctorId || '').toString() && req.user._id.toString() !== (appt.doctorId || '').toString()) {
      return res.status(403).send({ error: 'Forbidden' });
    }
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    res.send(appointment);
  } catch (error) {
    res.status(404).send({ error: 'Appointment not found' });
  }
});

// PATCH endpoint to update appointment fields (status, dateTime, notes, etc.)
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).send({ error: 'Appointment not found' });
    // only admin, doctor assigned, or owning patient can update
    let userDocId3 = null;
    if (req.user.role === 'doctor') {
      const d3 = await Doctors.findOne({ email: req.user.email });
      userDocId3 = d3 ? d3._id.toString() : req.user._id.toString();
    }
    if (req.user.role !== 'admin' && req.user._id.toString() !== (appt.patientId || '').toString() && userDocId3 !== (appt.doctorId || '').toString() && req.user._id.toString() !== (appt.doctorId || '').toString()) {
      return res.status(403).send({ error: 'Forbidden' });
    }
    const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('patientId', 'name').populate('doctorId', 'name');
    const out = updated.toObject();
    out.patientName = updated.patientId ? updated.patientId.name : undefined;
    out.doctorName = updated.doctorId ? updated.doctorId.name : undefined;
    res.send(out);
  } catch (error) {
    res.status(500).send({ error: 'Failed to update appointment' });
  }
});

module.exports = router;
