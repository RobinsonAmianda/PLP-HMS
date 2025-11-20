// middleware/roles.js
const isDoctor = (req, res, next) => {
  if (req.user && req.user.role === 'doctor') return next();
  return res.status(403).send({ error: 'Forbidden' });
};

const isPatient = (req, res, next) => {
  if (req.user && req.user.role === 'patient') return next();
  return res.status(403).send({ error: 'Forbidden' });
};

const isAdminOr = (role) => (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === role)) return next();
  return res.status(403).send({ error: 'Forbidden' });
};

module.exports = { isDoctor, isPatient, isAdminOr };
