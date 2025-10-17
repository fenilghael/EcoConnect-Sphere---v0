const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - require authentication
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token
      const user = await User.findById(decoded.id).select('+password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'No user found with this token'
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'User account is deactivated'
        });
      }

      // Grant access to protected route
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }

    next();
  };
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Token is invalid, but we don't fail the request
        console.log('Invalid token in optional auth:', error.message);
      }
    }

    next();
  } catch (error) {
    next(); // Continue even if there's an error
  }
};

// Check if user owns resource or is admin/moderator
const checkOwnershipOrAdmin = (resourceUserIdField = 'user') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    // Admin and moderator can access any resource
    if (req.user.role === 'admin' || req.user.role === 'moderator') {
      return next();
    }

    // Check if user owns the resource
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    
    if (resourceUserId && resourceUserId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource'
      });
    }

    next();
  };
};

// Check if user can access event (organizer, participant, or admin/moderator)
const checkEventAccess = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    // Admin and moderator can access any event
    if (req.user.role === 'admin' || req.user.role === 'moderator') {
      return next();
    }

    const Event = require('../models/Event');
    const EventRegistration = require('../models/EventRegistration');
    
    const eventId = req.params.eventId || req.params.id;
    
    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required'
      });
    }

    // Check if user is the organizer
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.organizer.toString() === req.user._id.toString()) {
      req.eventAccess = 'organizer';
      return next();
    }

    // Check if user is registered for the event
    const registration = await EventRegistration.findOne({
      user: req.user._id,
      event: eventId
    });

    if (registration) {
      req.eventAccess = 'participant';
      req.registration = registration;
      return next();
    }

    // If event is public, allow read access
    if (event.isPublic) {
      req.eventAccess = 'public';
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this event'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during event access check'
    });
  }
};

// Check if user can manage agency
const checkAgencyAccess = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    // Admin can access any agency
    if (req.user.role === 'admin') {
      return next();
    }

    const Agency = require('../models/Agency');
    const agencyId = req.params.agencyId || req.params.id;

    if (!agencyId) {
      return res.status(400).json({
        success: false,
        message: 'Agency ID is required'
      });
    }

    const agency = await Agency.findById(agencyId);
    if (!agency) {
      return res.status(404).json({
        success: false,
        message: 'Agency not found'
      });
    }

    // Check if user is an administrator of the agency
    const isAdmin = agency.administrators.some(admin => 
      admin.user.toString() === req.user._id.toString()
    );

    if (isAdmin) {
      req.agencyAccess = 'administrator';
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this agency'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during agency access check'
    });
  }
};

// Rate limiting for authentication attempts
const authRateLimit = require('express-rate-limit')({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  protect,
  authorize,
  optionalAuth,
  checkOwnershipOrAdmin,
  checkEventAccess,
  checkAgencyAccess,
  authRateLimit
};
