// routes/reports.js
const express = require('express');
const router = express.Router();
const Report = require('../models/reports');
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find();
    res.send(reports);
  } catch (error) {
    res.status(500).send({ error: 'Failed to generate reports' });
  }
});
router.get('/analytics', async (req, res) => {
  try {
    const analytics = await Report.aggregate([
      {
        $group: {
          _id: null,
          patientCount: { $sum: 1 },
          doctorCount: { $sum: 1 }
        }
      }
    ]);
    res.send(analytics);
  } catch (error) {
    res.status(500).send({ error: 'Failed to generate analytics' });
  }
});

module.exports = router;
