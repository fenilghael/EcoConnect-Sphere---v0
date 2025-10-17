const express = require('express');
const { body, validationResult } = require('express-validator');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      unreadOnly = false,
      type,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      unreadOnly: unreadOnly === 'true',
      type,
      sortBy,
      sortOrder
    };

    const result = await Notification.getUserNotifications(req.user._id, options);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single notification
// @route   GET /api/notifications/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('sender', 'name avatar')
      .populate('data.eventId', 'title date')
      .populate('data.badgeId', 'name icon');

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if user owns this notification
    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this notification'
      });
    }

    res.status(200).json({
      success: true,
      notification
    });
  } catch (error) {
    console.error('Get notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if user owns this notification
    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this notification'
      });
    }

    await notification.markAsRead();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Mark notification as unread
// @route   PUT /api/notifications/:id/unread
// @access  Private
router.put('/:id/unread', protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if user owns this notification
    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this notification'
      });
    }

    await notification.markAsUnread();

    res.status(200).json({
      success: true,
      message: 'Notification marked as unread'
    });
  } catch (error) {
    console.error('Mark notification as unread error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
router.put('/read-all', protect, async (req, res) => {
  try {
    const result = await Notification.markAllAsRead(req.user._id);

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read`
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if user owns this notification
    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this notification'
      });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create notification (admin/moderator only)
// @route   POST /api/notifications
// @access  Private/Admin
router.post('/', [
  body('recipient').isMongoId().withMessage('Valid recipient ID is required'),
  body('type').isIn([
    'event_created', 'event_updated', 'event_cancelled', 'event_reminder', 'event_completed',
    'registration_confirmed', 'registration_cancelled', 'waitlist_moved',
    'badge_earned', 'achievement_unlocked', 'message_received',
    'verification_approved', 'verification_rejected', 'impact_submitted',
    'friend_invited', 'system_announcement'
  ]).withMessage('Invalid notification type'),
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title must be between 1 and 100 characters'),
  body('message').trim().isLength({ min: 1, max: 500 }).withMessage('Message must be between 1 and 500 characters')
], protect, authorize('admin', 'moderator'), async (req, res) => {
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

    const notificationData = {
      ...req.body,
      sender: req.user._id
    };

    const notification = await Notification.createNotification(notificationData);

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      notification
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Send bulk notifications (admin/moderator only)
// @route   POST /api/notifications/bulk
// @access  Private/Admin
router.post('/bulk', [
  body('recipients').isArray({ min: 1 }).withMessage('Recipients array is required'),
  body('type').isIn([
    'event_created', 'event_updated', 'event_cancelled', 'event_reminder', 'event_completed',
    'registration_confirmed', 'registration_cancelled', 'waitlist_moved',
    'badge_earned', 'achievement_unlocked', 'message_received',
    'verification_approved', 'verification_rejected', 'impact_submitted',
    'friend_invited', 'system_announcement'
  ]).withMessage('Invalid notification type'),
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title must be between 1 and 100 characters'),
  body('message').trim().isLength({ min: 1, max: 500 }).withMessage('Message must be between 1 and 500 characters')
], protect, authorize('admin', 'moderator'), async (req, res) => {
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

    const { recipients, ...notificationData } = req.body;
    notificationData.sender = req.user._id;

    const notifications = await Notification.sendBulkNotifications(recipients, notificationData);

    res.status(201).json({
      success: true,
      message: `${notifications.length} notifications sent successfully`,
      count: notifications.length
    });
  } catch (error) {
    console.error('Send bulk notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get notification statistics
// @route   GET /api/notifications/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const totalNotifications = await Notification.countDocuments({ recipient: req.user._id });
    const unreadNotifications = await Notification.countDocuments({ 
      recipient: req.user._id, 
      isRead: false 
    });

    const typeStats = await Notification.aggregate([
      { $match: { recipient: req.user._id } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const recentActivity = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('sender', 'name avatar')
      .populate('data.eventId', 'title')
      .populate('data.badgeId', 'name icon');

    res.status(200).json({
      success: true,
      stats: {
        total: totalNotifications,
        unread: unreadNotifications,
        typeBreakdown: typeStats,
        recentActivity
      }
    });
  } catch (error) {
    console.error('Get notification stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update notification preferences
// @route   PUT /api/notifications/preferences
// @access  Private
router.put('/preferences', [
  body('notifications.email').optional().isBoolean().withMessage('Email notifications must be boolean'),
  body('notifications.push').optional().isBoolean().withMessage('Push notifications must be boolean'),
  body('notifications.events').optional().isBoolean().withMessage('Event notifications must be boolean'),
  body('notifications.achievements').optional().isBoolean().withMessage('Achievement notifications must be boolean')
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

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update notification preferences
    if (req.body.notifications) {
      user.preferences.notifications = {
        ...user.preferences.notifications,
        ...req.body.notifications
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Notification preferences updated successfully',
      preferences: user.preferences.notifications
    });
  } catch (error) {
    console.error('Update notification preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Cleanup old notifications (admin only)
// @route   DELETE /api/notifications/cleanup
// @access  Private/Admin
router.delete('/cleanup', protect, authorize('admin'), async (req, res) => {
  try {
    const { daysOld = 30 } = req.query;
    const result = await Notification.cleanupOldNotifications(parseInt(daysOld));

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} old notifications cleaned up`
    });
  } catch (error) {
    console.error('Cleanup notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
