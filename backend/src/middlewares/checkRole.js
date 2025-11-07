/**
 * Middleware to check if user has required role
 * Usage: checkRole('admin', 'teacher')
 */
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      console.warn(`User ${req.user._id} with role ${req.user.role} attempted to access ${req.path}`);
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action',
        required: allowedRoles,
        current: req.user.role
      });
    }
    
    next();
  };
};

module.exports = checkRole;