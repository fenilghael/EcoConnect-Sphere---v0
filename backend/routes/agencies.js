const express = require('express');
const { body, validationResult } = require('express-validator');
const Agency = require('../models/Agency');
const User = require('../models/User');
const { protect, authorize, checkAgencyAccess } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all agencies
// @route   GET /api/agencies
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      verificationStatus,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      type,
      verificationStatus,
      search,
      sortBy,
      sortOrder
    };

    const result = await Agency.getAgencies(options);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get agencies error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single agency
// @route   GET /api/agencies/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const agency = await Agency.findById(req.params.id)
      .populate('administrators.user', 'name email avatar')
      .populate('verifiedBy', 'name');

    if (!agency) {
      return res.status(404).json({
        success: false,
        message: 'Agency not found'
      });
    }

    res.status(200).json({
      success: true,
      agency
    });
  } catch (error) {
    console.error('Get agency error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new agency
// @route   POST /api/agencies
// @access  Private
router.post('/', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Agency name must be between 2 and 100 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('type').isIn(['government', 'nonprofit', 'corporate', 'community', 'educational', 'other']).withMessage('Invalid agency type'),
  body('contactInfo.email').isEmail().withMessage('Valid contact email is required'),
  body('contactInfo.phone').optional().isMobilePhone().withMessage('Valid phone number is required')
], protect, async (req, res) => {
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

    const agencyData = {
      ...req.body,
      administrators: [{
        user: req.user._id,
        role: 'admin',
        addedAt: new Date(),
        permissions: {
          canVerifyOrganizers: true,
          canManageEvents: true,
          canViewAnalytics: true,
          canManageBadges: true
        }
      }]
    };

    const agency = await Agency.create(agencyData);

    // Populate administrator info
    await agency.populate('administrators.user', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Agency created successfully',
      agency
    });
  } catch (error) {
    console.error('Create agency error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update agency
// @route   PUT /api/agencies/:id
// @access  Private
router.put('/:id', [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Agency name must be between 2 and 100 characters'),
  body('description').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('type').optional().isIn(['government', 'nonprofit', 'corporate', 'community', 'educational', 'other']).withMessage('Invalid agency type'),
  body('contactInfo.email').optional().isEmail().withMessage('Valid contact email is required'),
  body('contactInfo.phone').optional().isMobilePhone().withMessage('Valid phone number is required')
], protect, checkAgencyAccess, async (req, res) => {
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

    const agency = await Agency.findById(req.params.id);

    if (!agency) {
      return res.status(404).json({
        success: false,
        message: 'Agency not found'
      });
    }

    // Update agency fields
    const allowedFields = [
      'name', 'description', 'type', 'website', 'contactInfo', 'settings',
      'branding', 'notificationSettings'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        agency[field] = { ...agency[field], ...req.body[field] };
      }
    });

    agency.lastActivity = new Date();
    await agency.save();

    res.status(200).json({
      success: true,
      message: 'Agency updated successfully',
      agency
    });
  } catch (error) {
    console.error('Update agency error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Add administrator to agency
// @route   POST /api/agencies/:id/administrators
// @access  Private
router.post('/:id/administrators', [
  body('userId').isMongoId().withMessage('Valid user ID is required'),
  body('role').optional().isIn(['admin', 'moderator', 'viewer']).withMessage('Invalid role')
], protect, checkAgencyAccess, async (req, res) => {
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

    const agency = await Agency.findById(req.params.id);

    if (!agency) {
      return res.status(404).json({
        success: false,
        message: 'Agency not found'
      });
    }

    const { userId, role = 'moderator' } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await agency.addAdministrator(userId, role, req.user._id);

    // Populate administrator info
    await agency.populate('administrators.user', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'Administrator added successfully',
      agency
    });
  } catch (error) {
    console.error('Add administrator error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @desc    Remove administrator from agency
// @route   DELETE /api/agencies/:id/administrators/:userId
// @access  Private
router.delete('/:id/administrators/:userId', protect, checkAgencyAccess, async (req, res) => {
  try {
    const agency = await Agency.findById(req.params.id);

    if (!agency) {
      return res.status(404).json({
        success: false,
        message: 'Agency not found'
      });
    }

    const { userId } = req.params;

    await agency.removeAdministrator(userId);

    res.status(200).json({
      success: true,
      message: 'Administrator removed successfully'
    });
  } catch (error) {
    console.error('Remove administrator error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update administrator permissions
// @route   PUT /api/agencies/:id/administrators/:userId/permissions
// @access  Private
router.put('/:id/administrators/:userId/permissions', protect, checkAgencyAccess, async (req, res) => {
  try {
    const agency = await Agency.findById(req.params.id);

    if (!agency) {
      return res.status(404).json({
        success: false,
        message: 'Agency not found'
      });
    }

    const { userId } = req.params;
    const { permissions } = req.body;

    await agency.updateAdministratorPermissions(userId, permissions);

    res.status(200).json({
      success: true,
      message: 'Administrator permissions updated successfully'
    });
  } catch (error) {
    console.error('Update administrator permissions error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @desc    Upload verification documents
// @route   POST /api/agencies/:id/documents
// @access  Private
router.post('/:id/documents', protect, checkAgencyAccess, async (req, res) => {
  try {
    const agency = await Agency.findById(req.params.id);

    if (!agency) {
      return res.status(404).json({
        success: false,
        message: 'Agency not found'
      });
    }

    const { type, name, url } = req.body;

    // Add document to verification documents array
    agency.verificationDocuments.push({
      type,
      name,
      url,
      uploadedAt: new Date()
    });

    await agency.save();

    res.status(200).json({
      success: true,
      message: 'Document uploaded successfully',
      agency
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Verify agency (admin only)
// @route   PUT /api/agencies/:id/verify
// @access  Private/Admin
router.put('/:id/verify', [
  body('status').isIn(['verified', 'rejected', 'suspended']).withMessage('Invalid verification status'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
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

    const agency = await Agency.findById(req.params.id);

    if (!agency) {
      return res.status(404).json({
        success: false,
        message: 'Agency not found'
      });
    }

    const { status, notes } = req.body;

    switch (status) {
      case 'verified':
        await agency.verify(req.user._id, notes);
        break;
      case 'rejected':
        await agency.reject(req.user._id, notes);
        break;
      case 'suspended':
        await agency.suspend(req.user._id, notes);
        break;
    }

    res.status(200).json({
      success: true,
      message: `Agency ${status} successfully`,
      agency
    });
  } catch (error) {
    console.error('Verify agency error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get agency statistics
// @route   GET /api/agencies/:id/stats
// @access  Private
router.get('/:id/stats', protect, checkAgencyAccess, async (req, res) => {
  try {
    const agency = await Agency.findById(req.params.id);

    if (!agency) {
      return res.status(404).json({
        success: false,
        message: 'Agency not found'
      });
    }

    // Update agency statistics
    await agency.updateStats();

    res.status(200).json({
      success: true,
      stats: agency.stats
    });
  } catch (error) {
    console.error('Get agency stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all agency statistics
// @route   GET /api/agencies/stats/overview
// @access  Public
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Agency.getAgencyStats();

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get agency overview stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get user's agencies
// @route   GET /api/agencies/user/:userId
// @access  Private
router.get('/user/:userId', protect, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if user can view agencies for this user
    if (userId !== req.user._id.toString() && !['admin', 'moderator'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view agencies for this user'
      });
    }

    const agencies = await Agency.find({
      'administrators.user': userId
    })
      .populate('administrators.user', 'name email avatar')
      .populate('verifiedBy', 'name');

    res.status(200).json({
      success: true,
      agencies
    });
  } catch (error) {
    console.error('Get user agencies error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete agency (admin only)
// @route   DELETE /api/agencies/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const agency = await Agency.findById(req.params.id);

    if (!agency) {
      return res.status(404).json({
        success: false,
        message: 'Agency not found'
      });
    }

    // Soft delete - deactivate agency instead of deleting
    agency.isActive = false;
    agency.verificationStatus = 'suspended';
    await agency.save();

    res.status(200).json({
      success: true,
      message: 'Agency deactivated successfully'
    });
  } catch (error) {
    console.error('Delete agency error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
