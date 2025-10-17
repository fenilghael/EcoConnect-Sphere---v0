const express = require('express');
const { body, validationResult } = require('express-validator');
const Badge = require('../models/Badge');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all badges
// @route   GET /api/badges
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      category,
      rarity,
      isActive = true,
      sortBy = 'points',
      sortOrder = 'desc'
    } = req.query;

    const query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (rarity) {
      query.rarity = rarity;
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const badges = await Badge.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Badge.countDocuments(query);

    res.status(200).json({
      success: true,
      count: badges.length,
      badges,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single badge
// @route   GET /api/badges/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const badge = await Badge.findById(req.params.id);

    if (!badge) {
      return res.status(404).json({
        success: false,
        message: 'Badge not found'
      });
    }

    res.status(200).json({
      success: true,
      badge
    });
  } catch (error) {
    console.error('Get badge error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new badge (admin only)
// @route   POST /api/badges
// @access  Private/Admin
router.post('/', [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Badge name must be between 2 and 50 characters'),
  body('description').trim().isLength({ min: 10, max: 200 }).withMessage('Description must be between 10 and 200 characters'),
  body('icon').trim().isLength({ min: 1, max: 10 }).withMessage('Icon must be between 1 and 10 characters'),
  body('category').isIn(['participation', 'environmental', 'leadership', 'social', 'repair', 'achievement', 'education', 'technology', 'consistency']).withMessage('Invalid category'),
  body('rarity').isIn(['common', 'uncommon', 'rare', 'epic', 'legendary']).withMessage('Invalid rarity'),
  body('points').isInt({ min: 1, max: 1000 }).withMessage('Points must be between 1 and 1000'),
  body('requirements').trim().isLength({ min: 5, max: 200 }).withMessage('Requirements must be between 5 and 200 characters'),
  body('criteria.type').isIn(['events_attended', 'events_organized', 'impact_points', 'trees_planted', 'waste_collected', 'items_repaired', 'friends_invited', 'months_streak', 'rating_achieved', 'custom']).withMessage('Invalid criteria type'),
  body('criteria.target').isInt({ min: 1 }).withMessage('Target must be at least 1')
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

    const badge = await Badge.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Badge created successfully',
      badge
    });
  } catch (error) {
    console.error('Create badge error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update badge (admin only)
// @route   PUT /api/badges/:id
// @access  Private/Admin
router.put('/:id', [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Badge name must be between 2 and 50 characters'),
  body('description').optional().trim().isLength({ min: 10, max: 200 }).withMessage('Description must be between 10 and 200 characters'),
  body('icon').optional().trim().isLength({ min: 1, max: 10 }).withMessage('Icon must be between 1 and 10 characters'),
  body('category').optional().isIn(['participation', 'environmental', 'leadership', 'social', 'repair', 'achievement', 'education', 'technology', 'consistency']).withMessage('Invalid category'),
  body('rarity').optional().isIn(['common', 'uncommon', 'rare', 'epic', 'legendary']).withMessage('Invalid rarity'),
  body('points').optional().isInt({ min: 1, max: 1000 }).withMessage('Points must be between 1 and 1000'),
  body('requirements').optional().trim().isLength({ min: 5, max: 200 }).withMessage('Requirements must be between 5 and 200 characters')
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

    const badge = await Badge.findById(req.params.id);

    if (!badge) {
      return res.status(404).json({
        success: false,
        message: 'Badge not found'
      });
    }

    // Update badge
    const allowedFields = [
      'name', 'description', 'icon', 'category', 'rarity', 'points', 'requirements',
      'criteria', 'display', 'isActive', 'isHidden', 'startDate', 'endDate',
      'prerequisites', 'unlocks', 'tags', 'difficulty', 'estimatedTime'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        badge[field] = req.body[field];
      }
    });

    await badge.save();

    res.status(200).json({
      success: true,
      message: 'Badge updated successfully',
      badge
    });
  } catch (error) {
    console.error('Update badge error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete badge (admin only)
// @route   DELETE /api/badges/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const badge = await Badge.findById(req.params.id);

    if (!badge) {
      return res.status(404).json({
        success: false,
        message: 'Badge not found'
      });
    }

    // Soft delete - deactivate badge instead of deleting
    badge.isActive = false;
    await badge.save();

    res.status(200).json({
      success: true,
      message: 'Badge deactivated successfully'
    });
  } catch (error) {
    console.error('Delete badge error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Award badge to user (admin only)
// @route   POST /api/badges/:id/award/:userId
// @access  Private/Admin
router.post('/:id/award/:userId', protect, authorize('admin'), async (req, res) => {
  try {
    const badge = await Badge.findById(req.params.id);

    if (!badge) {
      return res.status(404).json({
        success: false,
        message: 'Badge not found'
      });
    }

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const result = await badge.awardToUser(req.params.userId);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Badge awarded successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Award badge error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Check and award badges for user
// @route   POST /api/badges/check/:userId
// @access  Private
router.post('/check/:userId', protect, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if user can check badges for this user
    if (userId !== req.user._id.toString() && !['admin', 'moderator'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to check badges for this user'
      });
    }

    const newlyAwarded = await Badge.checkAndAwardBadges(userId);

    res.status(200).json({
      success: true,
      message: 'Badge check completed',
      newlyAwarded: newlyAwarded.length,
      badges: newlyAwarded
    });
  } catch (error) {
    console.error('Check badges error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get user's badge progress
// @route   GET /api/badges/progress/:userId
// @access  Private
router.get('/progress/:userId', protect, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if user can view progress for this user
    if (userId !== req.user._id.toString() && !['admin', 'moderator'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view progress for this user'
      });
    }

    const user = await User.findById(userId).select('earnedBadges stats');
    const earnedBadgeIds = user.earnedBadges.map(badge => badge.badge);

    // Get available badges with progress calculation
    const availableBadges = await Badge.find({ isActive: true });
    
    const badgesWithProgress = await Promise.all(
      availableBadges.map(async (badge) => {
        const isEarned = earnedBadgeIds.includes(badge._id);
        let progress = 0;

        if (!isEarned) {
          const meetsCriteria = await badge.checkCriteria(userId, user.stats);
          // Calculate progress percentage based on criteria
          // This is a simplified calculation - you might want to implement more detailed progress tracking
          progress = meetsCriteria ? 100 : 0;
        }

        return {
          ...badge.toObject(),
          isEarned,
          progress: isEarned ? 100 : progress
        };
      })
    );

    res.status(200).json({
      success: true,
      badges: badgesWithProgress
    });
  } catch (error) {
    console.error('Get badge progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get badge statistics
// @route   GET /api/badges/stats
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const stats = await Badge.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalPoints: { $sum: '$points' }
        }
      }
    ]);

    const rarityStats = await Badge.aggregate([
      {
        $group: {
          _id: '$rarity',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalStats = await Badge.aggregate([
      {
        $group: {
          _id: null,
          totalBadges: { $sum: 1 },
          totalPoints: { $sum: '$points' },
          totalEarned: { $sum: '$stats.totalEarned' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        categoryBreakdown: stats,
        rarityBreakdown: rarityStats,
        total: totalStats[0] || { totalBadges: 0, totalPoints: 0, totalEarned: 0 }
      }
    });
  } catch (error) {
    console.error('Get badge stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get badge categories
// @route   GET /api/badges/categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Badge.distinct('category');
    
    const categoryStats = await Promise.all(
      categories.map(async (category) => {
        const count = await Badge.countDocuments({ category, isActive: true });
        return { category, count };
      })
    );

    res.status(200).json({
      success: true,
      categories: categoryStats
    });
  } catch (error) {
    console.error('Get badge categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
