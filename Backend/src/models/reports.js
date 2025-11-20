// models/reports.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reportsSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  reportType: {
    type: String,
    enum: ['patient', 'doctor', 'appointment', 'bill'],
    required: true
  },
  data: {
    type: Schema.Types.Mixed,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Report = mongoose.model('Report', reportsSchema);
module.exports = Report;
