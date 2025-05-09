const roleCheck = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: No user found in request' });
    }

    // Check for admin role
    if (requiredRole === 'admin' && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    next();
  };
};

module.exports = roleCheck;
