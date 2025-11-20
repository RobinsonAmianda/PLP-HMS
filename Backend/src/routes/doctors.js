// routes/doctors.js
// const express = require('express');
// const router = express.Router();
// const Doctor = require('../models/doctors');
// router.post('/register', async (req, res) => {
//   try {
//     const doctor = new Doctor(req.body);
//     await doctor.save();
//     res.send(doctor);
//   } catch (error) {
//     res.status(500).send({ error: 'Failed to register doctor' });
//   }
// });
// router.get('/search', async (req, res) => {
//   try {
//     const doctors = await Doctor.find(req.query);
//     res.send(doctors);
//   } catch (error) {
//     res.status(500).send({ error: 'Failed to search doctors' });
//   }
// });
// router.get('/:id', async (req, res) => {
//   try {
//     const doctor = await Doctor.findById(req.params.id);
//     res.send(doctor);
//   } catch (error) {
//     res.status(404).send({ error: 'Doctor not found' });
//   }
// });
// router.post('/:id/appointment', async (req, res) => {
//   try {
//     const doctor = await Doctor.findById(req.params.id);
//     const appointment = new Appointment(req.body);
//     doctor.appointments.push(appointment);
//     await doctor.save();
//     res.send(appointment);
//   } catch (error) {
//     res.status(500).send({ error: 'Failed to schedule appointment' });
//   }
// });
// module.exports = router;

// routes/patients.js
const express = require('express');
const router = express.Router();
const Doctors = require('../models/doctors');
const authenticate = require('../middleware/auth');
const isAdmin = require('../middleware/admin');
// const authenticate = require('../middleware/auth');
// const isAdmin = require('../middleware/admin');
// list doctors - public
router.get('/',  async (req, res) => {
  try {
    const doctors = await Doctors.find();
    res.send(doctors);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});
// create doctor - admin only
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const doctors = new Doctors(req.body);
    await doctors.save();
    res.send(doctors);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// Update a doctor
// update doctor - admin only
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const updates = req.body;
    const options = { new: true, runValidators: true };
    const updatedDoctor = await Doctors.findByIdAndUpdate(req.params.id, updates, options);
    if (!updatedDoctor) {
      return res.status(404).send({ error: 'Doctor not found' });
    }
    res.send(updatedDoctor);
  } catch (error) {
    res.status(400).send({ error: 'Failed to update doctor', details: error.message });
  }
});

// Delete a doctor
// delete doctor - admin only
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const deleted = await Doctors.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).send({ error: 'Doctor not found' });
    }
    res.send({ message: 'Doctor deleted', id: req.params.id });
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete doctor' });
  }
});
module.exports = router;
