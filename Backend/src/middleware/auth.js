// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).send({ error: 'Please authenticate' });
    const token = authHeader.replace('Bearer ', '');
    const secret = process.env.JWT_SECRET || 'secretkey';
    const decoded = jwt.verify(token, secret);
    const user = await User.findOne({ _id: decoded._id });
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};

module.exports = authenticate;
