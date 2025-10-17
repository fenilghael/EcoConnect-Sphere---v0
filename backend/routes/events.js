const express = require('express');
const { body, validationResult } = require('express-validator');
const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');
const User = require('../models/User');
const Badge = require('../models/Badge');
const Notification = require('../models/Notification');
const { protect, authorize, optionalAuth, checkEventAccess } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all events
// @route   GET /api/events
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      status,
      location,
      search,
      sortBy = 'date',
      sortOrder = 'asc',
      lat,
      lon,
      radius = 50 // km
    } = req.query;

    const query = { isPublic: true };

    if (category) {
      query.category = category;
    }

    if (status) {
      query.status = status;
    } else {
      // Default to active events
      query.status = { $in: ['active', 'approved'] };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (location) {
      query.$or = [
        { 'location.name': { $regex: location, $options: 'i' } },
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.address': { $regex: location, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    let sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // If sorting by date, ensure upcoming events come first
    if (sortBy === 'date') {
      sort = { date: 1 };
    }

    let events = await Event.find(query)
      .populate('organizer', 'name avatar')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Filter by radius if coordinates provided
    if (lat && lon) {
      events = events.filter(event => {
        const distance = event.calculateDistance(parseFloat(lat), parseFloat(lon));
        return distance !== null && distance <= parseFloat(radius);
      });
    }

    // Add distance information if coordinates provided
    if (lat && lon) {
      events = events.map(event => {
        const distance = event.calculateDistance(parseFloat(lat), parseFloat(lon));
        return {
          ...event.toObject(),
          distance: distance ? `${distance} km` : null
        };
      });
    }

    const total = await Event.countDocuments(query);

    res.status(200).json({
      success: true,
      count: events.length,
      events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name avatar email phone')
      .populate('verifiedBy', 'name');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user can view this event
    if (!event.isPublic && (!req.user || event.organizer._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Event is private'
      });
    }

    // Get registration info if user is logged in
    let userRegistration = null;
    if (req.user) {
      userRegistration = await EventRegistration.findOne({
        user: req.user._id,
        event: req.params.id
      });
    }

    // Get participants list (limited to organizer and admin)
    let participants = [];
    if (req.user && (event.organizer._id.toString() === req.user._id.toString() || 
        ['admin', 'moderator'].includes(req.user.role))) {
      participants = await EventRegistration.find({ event: req.params.id })
        .populate('user', 'name avatar email')
        .sort({ registeredAt: -1 });
    }

    res.status(200).json({
      success: true,
      event: {
        ...event.toObject(),
        userRegistration,
        participants: req.user ? participants : undefined
      }
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new event
// @route   POST /api/events
// @access  Private
router.post('/', [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('description').trim().isLength({ min: 20, max: 2000 }).withMessage('Description must be between 20 and 2000 characters'),
  body('category').isIn(['cleanup', 'tree-planting', 'repair', 'e-waste', 'education', 'other']).withMessage('Invalid category'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format is required'),
  body('location.name').trim().notEmpty().withMessage('Location name is required'),
  body('location.address').trim().notEmpty().withMessage('Address is required'),
  body('capacity').isInt({ min: 1, max: 1000 }).withMessage('Capacity must be between 1 and 1000')
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

    const eventData = {
      ...req.body,
      organizer: req.user._id,
      organizerName: req.user.name,
      organizerEmail: req.user.email
    };

    // Set default status based on user role
    if (req.user.role === 'admin' || req.user.role === 'moderator') {
      eventData.status = 'approved';
    } else {
      eventData.status = 'pending';
    }

    const event = await Event.create(eventData);

    // Populate organizer info
    await event.populate('organizer', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('description').optional().trim().isLength({ min: 20, max: 2000 }).withMessage('Description must be between 20 and 2000 characters'),
  body('category').optional().isIn(['cleanup', 'tree-planting', 'repair', 'e-waste', 'education', 'other']).withMessage('Invalid category'),
  body('date').optional().isISO8601().withMessage('Valid date is required'),
  body('time').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format is required'),
  body('capacity').optional().isInt({ min: 1, max: 1000 }).withMessage('Capacity must be between 1 and 1000')
], protect, checkEventAccess, async (req, res) => {
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

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user can edit this event
    if (event.organizer.toString() !== req.user._id.toString() && 
        !['admin', 'moderator'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this event'
      });
    }

    // Update event
    const allowedFields = [
      'title', 'description', 'category', 'date', 'time', 'endTime', 'duration',
      'location', 'capacity', 'requirements', 'whatToBring', 'ageRestriction',
      'accessibility', 'tags', 'isPublic', 'registrationDeadline', 'allowWaitlist',
      'requiresApproval'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });

    // If non-admin user is updating, reset status to pending for review
    if (!['admin', 'moderator'].includes(req.user.role) && event.status === 'approved') {
      event.status = 'pending';
    }

    await event.save();

    // Populate organizer info
    await event.populate('organizer', 'name avatar');

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
router.delete('/:id', protect, checkEventAccess, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user can delete this event
    if (event.organizer.toString() !== req.user._id.toString() && 
        !['admin', 'moderator'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }

    // Cancel all registrations
    await EventRegistration.updateMany(
      { event: req.params.id, status: { $in: ['registered', 'confirmed'] } },
      { status: 'cancelled', cancelledAt: new Date() }
    );

    // Soft delete - change status to cancelled
    event.status = 'cancelled';
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Event cancelled successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private
router.post('/:id/register', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Event is not open for registration'
      });
    }

    // Check if user is already registered
    const existingRegistration = await EventRegistration.findOne({
      user: req.user._id,
      event: req.params.id
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }

    // Check if event is full
    if (event.registeredParticipants >= event.capacity) {
      if (!event.allowWaitlist) {
        return res.status(400).json({
          success: false,
          message: 'Event is full and waitlist is not available'
        });
      }
    }

    // Create registration
    const registration = new EventRegistration({
      user: req.user._id,
      event: req.params.id,
      role: req.body.role || 'participant',
      specialRequirements: req.body.specialRequirements,
      emergencyContact: req.body.emergencyContact,
      communicationPreferences: req.body.communicationPreferences
    });

    // Add participant to event
    const result = event.addParticipant(req.user._id);
    
    if (result.success) {
      if (result.message.includes('waitlist')) {
        registration.isWaitlisted = true;
        registration.waitlistPosition = event.waitlist.length;
      }
      
      await event.save();
      await registration.save();

      // Create notification
      await Notification.createNotification({
        recipient: event.organizer,
        type: 'registration_confirmed',
        title: 'New Event Registration',
        message: `${req.user.name} registered for your event "${event.title}"`,
        data: {
          eventId: event._id,
          userId: req.user._id
        }
      });

      res.status(201).json({
        success: true,
        message: result.message,
        registration
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Cancel event registration
// @route   DELETE /api/events/:id/register
// @access  Private
router.delete('/:id/register', protect, async (req, res) => {
  try {
    const registration = await EventRegistration.findOne({
      user: req.user._id,
      event: req.params.id
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Remove participant from event
    const result = event.removeParticipant(req.user._id);
    
    if (result.success) {
      await event.save();
      await registration.cancel(req.body.reason);

      // Create notification for organizer
      await Notification.createNotification({
        recipient: event.organizer,
        type: 'registration_cancelled',
        title: 'Event Registration Cancelled',
        message: `${req.user.name} cancelled their registration for "${event.title}"`,
        data: {
          eventId: event._id,
          userId: req.user._id
        }
      });

      res.status(200).json({
        success: true,
        message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get event registrations
// @route   GET /api/events/:id/registrations
// @access  Private
router.get('/:id/registrations', protect, checkEventAccess, async (req, res) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 50,
      status: req.query.status,
      role: req.query.role,
      sortBy: req.query.sortBy || 'registeredAt',
      sortOrder: req.query.sortOrder || 'desc'
    };

    const result = await EventRegistration.getEventRegistrations(req.params.id, options);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get event registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Check in participant
// @route   POST /api/events/:id/checkin/:userId
// @access  Private
router.post('/:id/checkin/:userId', protect, checkEventAccess, async (req, res) => {
  try {
    // Only organizer and admin can check in participants
    if (req.eventAccess !== 'organizer' && !['admin', 'moderator'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to check in participants'
      });
    }

    const registration = await EventRegistration.findOne({
      user: req.params.userId,
      event: req.params.id
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    await registration.checkIn(req.body.location);

    res.status(200).json({
      success: true,
      message: 'Participant checked in successfully',
      registration
    });
  } catch (error) {
    console.error('Check in participant error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Submit event feedback
// @route   POST /api/events/:id/feedback
// @access  Private
router.post('/:id/feedback', [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('feedback').optional().trim().isLength({ max: 1000 }).withMessage('Feedback cannot exceed 1000 characters')
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

    const registration = await EventRegistration.findOne({
      user: req.user._id,
      event: req.params.id
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    if (registration.status !== 'completed' && registration.status !== 'attended') {
      return res.status(400).json({
        success: false,
        message: 'You can only submit feedback for events you attended'
      });
    }

    await registration.submitFeedback(req.body.rating, req.body.feedback);

    res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Verify event (admin/moderator only)
// @route   PUT /api/events/:id/verify
// @access  Private/Admin
router.put('/:id/verify', [
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
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

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    event.status = req.body.status;
    event.isVerified = req.body.status === 'approved';
    event.verificationNotes = req.body.notes;
    event.verifiedBy = req.user._id;
    event.verifiedAt = new Date();

    await event.save();

    // Create notification for organizer
    await Notification.createNotification({
      recipient: event.organizer,
      type: req.body.status === 'approved' ? 'verification_approved' : 'verification_rejected',
      title: `Event ${req.body.status === 'approved' ? 'Approved' : 'Rejected'}`,
      message: `Your event "${event.title}" has been ${req.body.status}`,
      data: {
        eventId: event._id
      }
    });

    res.status(200).json({
      success: true,
      message: `Event ${req.body.status} successfully`,
      event
    });
  } catch (error) {
    console.error('Verify event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
