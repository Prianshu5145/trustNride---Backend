// middlewares/listingMiddlewares.js
const checkApprovedDealer = (req, res, next) => {
    if (req.user.role !== 'dealer' || !req.user.isApproved) {
      return res.status(403).json({ message: 'Only approved dealers can create listings' });
    }
    next();
  };
  
  const checkUserRole = (roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'You do not have permission to perform this action' });
      }
      next();
    };
  };
  
  module.exports = { checkApprovedDealer, checkUserRole };
  