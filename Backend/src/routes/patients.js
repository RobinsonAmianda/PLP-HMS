// routes/patients.js
const express = require('express');
const router = express.Router();
const Patient = require('../models/patients');
const authenticate = require('../middleware/auth');
const { isAdminOr } = require('../middleware/roles');

// List patients - admin sees all, doctor sees all patients (per requirement)
router.get('/', authenticate, async (req, res) => {
  try {
    if (req.user.role === 'admin' || req.user.role === 'doctor') {
      const patients = await Patient.find();
      return res.send(patients);
    }
    return res.status(403).send({ error: 'Forbidden' });
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// Create patient - admin or doctor
router.post('/', authenticate, isAdminOr('doctor'), async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.send(patient);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// Update a patient - admin or doctor
router.put('/:id', authenticate, isAdminOr('doctor'), async (req, res) => {
  try {
    const updates = req.body;
    const options = { new: true, runValidators: true };
    const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, updates, options);
    if (!updatedPatient) {
      return res.status(404).send({ error: 'Patient not found' });
    }
    res.send(updatedPatient);
  } catch (error) {
    res.status(400).send({ error: 'Failed to update patient', details: error.message });
  }
});

// Delete a patient - admin or doctor
router.delete('/:id', authenticate, isAdminOr('doctor'), async (req, res) => {
  try {
    const deleted = await Patient.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).send({ error: 'Patient not found' });
    }
    res.send({ message: 'Patient deleted', id: req.params.id });
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete patient' });
  }
});
module.exports = router;
