// models/doctors.js
const mongoose = require('mongoose');
const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  experience: { type: Number, required: true },
  contact: { type: String, required: true }, 
  profilePic: { type: String }
});
const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
