// models/users.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  passwordHash: { type: String, required: true },
  profilePic: { type: String }
});
// Hide sensitive fields when converting to JSON
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    return ret;
  }
});

// Instance method to compare plain password with stored hash
userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

// Instance method to generate JWT token
userSchema.methods.generateToken = function() {
  const secret = process.env.JWT_SECRET || 'secretkey';
  const token = jwt.sign({ _id: this._id.toString(), role: this.role }, secret, { expiresIn: '7d' });
  return token;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
