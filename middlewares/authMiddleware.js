const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to check if the user is authenticated
exports.isAuthenticated = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  const token = authorization.split(' ')[1]; // Get token from header

  try {
    const decoded = jwt.verify(token,"Priyanshu"); // Verify token
    req.user = await User.findById(decoded.id); // Attach the user to the request object

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next(); // Continue to the next middleware/controller
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

// Middleware to check for authorized roles (admin in this case)
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Role (${req.user.role}) is not allowed to access this resource` });
    }
    next(); // Continue if the user has the required role
  };
};

//
