const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Event = require('../models/Event');
const Badge = require('../models/Badge');
const EventRegistration = require('../models/EventRegistration');
const { protect, authorize, checkOwnershipOrAdmin } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, authorize('admin', 'moderator'), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const users = await User.find(query)
      .select('-password -verificationToken -passwordResetToken')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('earnedBadges.badge', 'name icon description points rarity')
      .select('-password -verificationToken -passwordResetToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user can view this profile
    if (user._id.toString() !== req.user._id.toString() && 
        !['admin', 'moderator'].includes(req.user.role) &&
        !user.preferences.privacy.profileVisible) {
      return res.status(403).json({
        success: false,
        message: 'Profile is private'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
router.put('/:id', [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('location').optional().trim().isLength({ max: 100 }).withMessage('Location cannot exceed 100 characters'),
  body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters')
], protect, checkOwnershipOrAdmin('id'), async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user fields
    const allowedFields = ['name', 'phone', 'location', 'bio', 'avatar'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    // Update preferences if provided
    if (req.body.preferences) {
      if (req.body.preferences.notifications) {
        user.preferences.notifications = { ...user.preferences.notifications, ...req.body.preferences.notifications };
      }
      if (req.body.preferences.privacy) {
        user.preferences.privacy = { ...user.preferences.privacy, ...req.body.preferences.privacy };
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete - deactivate user instead of deleting
    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get user's event history
// @route   GET /api/users/:id/events
// @access  Private
router.get('/:id/events', protect, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user can view this data
    if (userId !== req.user._id.toString() && 
        !['admin', 'moderator'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this data'
      });
    }

    const {
      page = 1,
      limit = 20,
      status,
      sortBy = 'registeredAt',
      sortOrder = 'desc'
    } = req.query;

    const options = { page: parseInt(page), limit: parseInt(limit) };
    if (status) options.status = status;
    if (sortBy) options.sortBy = sortBy;
    if (sortOrder) options.sortOrder = sortOrder;

    const result = await EventRegistration.getUserRegistrations(userId, options);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get user events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get user's badges
// @route   GET /api/users/:id/badges
// @access  Private
router.get('/:id/badges', protect, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user can view this data
    if (userId !== req.user._id.toString() && 
        !['admin', 'moderator'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this data'
      });
    }

    const user = await User.findById(userId)
      .populate('earnedBadges.badge', 'name icon description points rarity category requirements')
      .select('earnedBadges stats');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get available badges for progress tracking
    const availableBadges = await Badge.find({ isActive: true });

    res.status(200).json({
      success: true,
      earnedBadges: user.earnedBadges,
      stats: user.stats,
      availableBadges
    });
  } catch (error) {
    console.error('Get user badges error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get user statistics
// @route   GET /api/users/:id/stats
// @access  Private
router.get('/:id/stats', protect, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user can view this data
    if (userId !== req.user._id.toString() && 
        !['admin', 'moderator'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this data'
      });
    }

    const user = await User.findById(userId).select('stats earnedBadges');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get additional statistics
    const totalEvents = await Event.countDocuments({ organizer: userId });
    const completedEvents = await Event.countDocuments({ 
      organizer: userId, 
      status: 'completed' 
    });

    // Get user's current rank
    const currentRank = user.getCurrentRank();
    const nextRank = user.getNextRank();

    res.status(200).json({
      success: true,
      stats: {
        ...user.stats,
        totalEvents,
        completedEvents,
        currentRank,
        nextRank,
        badgesEarned: user.earnedBadges.length
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update user role (admin only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
router.put('/:id/role', [
  body('role').isIn(['citizen', 'organizer', 'moderator', 'sponsor', 'admin']).withMessage('Invalid role')
], protect, authorize('admin'), async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.role = req.body.role;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      timeframe = 'all' // all, month, year
    } = req.query;

    let dateFilter = {};
    if (timeframe === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      dateFilter.createdAt = { $gte: oneMonthAgo };
    } else if (timeframe === 'year') {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      dateFilter.createdAt = { $gte: oneYearAgo };
    }

    const skip = (page - 1) * limit;

    const leaderboard = await User.find({
      isActive: true,
      ...dateFilter
    })
      .select('name avatar stats impactPoints earnedBadges')
      .sort({ 'stats.impactPoints': -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments({
      isActive: true,
      ...dateFilter
    });

    res.status(200).json({
      success: true,
      leaderboard,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
