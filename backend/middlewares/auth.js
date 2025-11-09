const jwt = require('jsonwebtoken');

// ✅ Correct middleware function
const auth = (rolesAllowed = []) => {
  return (req, res, next) => {
    try {
      // Correct way to get token from headers
      const token = req.headers['x-auth-token'] || req.query.token;

      if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'VerySecretKeyForAssignment');
      req.user = decoded.user;

      if (rolesAllowed.length && !rolesAllowed.includes(req.user.role)) {
        return res.status(403).json({ msg: 'Forbidden: Insufficient privileges' });
      }

      next();
    } catch (err) {
      console.error('Auth error:', err.message);
      res.status(401).json({ msg: 'Token invalid or expired' });
    }
  };
};

module.exports = auth;
