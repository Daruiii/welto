const ensureRole = (role) => {
    return (req, res, next) => {
      if (req.user && req.user.role === role) {
        return next();
      } else {
        res.status(403).json({ message: 'Forbidden' });
      }
    };
  };
  
  module.exports = ensureRole;
  