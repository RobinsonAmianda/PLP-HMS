// models/patients.js
const mongoose = require('mongoose');
const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: String, required: true },
  address: { type: String, required: true },
  contact: { type: String, required: true },
  profilePic: { type: String }
});
const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;
