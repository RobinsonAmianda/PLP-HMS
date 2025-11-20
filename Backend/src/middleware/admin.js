// middleware/admin.js
const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      throw new Error();
    }
    next();
  } catch (error) {
    res.status(403).send({ error: 'Forbidden' });
  }
};
module.exports = isAdmin;
