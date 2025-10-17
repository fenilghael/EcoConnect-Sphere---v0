const mongoose = require('mongoose');

const eventRegistrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event is required']
  },
  role: {
    type: String,
    enum: ['participant', 'volunteer', 'organizer'],
    default: 'participant'
  },
  status: {
    type: String,
    enum: ['registered', 'confirmed', 'checked_in', 'attended', 'completed', 'cancelled', 'no_show'],
    default: 'registered'
  },
  
  // Registration details
  registeredAt: {
    type: Date,
    default: Date.now
  },
  confirmedAt: Date,
  checkedInAt: Date,
  attendedAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  
  // Registration metadata
  registrationNotes: String,
  cancellationReason: String,
  
  // Event participation tracking
  checkInLocation: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  
  // Impact tracking
  impactContribution: {
    wasteCollected: String,
    treesPlanted: Number,
    itemsRepaired: Number,
    hoursVolunteered: Number,
    notes: String
  },
  
  // Feedback and rating
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: {
    type: String,
    maxlength: [1000, 'Feedback cannot exceed 1000 characters']
  },
  feedbackSubmittedAt: Date,
  
  // Emergency contact
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  
  // Special requirements
  specialRequirements: {
    accessibility: [String],
    dietary: [String],
    medical: [String],
    other: String
  },
  
  // Communication preferences
  communicationPreferences: {
    eventUpdates: { type: Boolean, default: true },
    reminderEmails: { type: Boolean, default: true },
    smsReminders: { type: Boolean, default: false }
  },
  
  // Waitlist information
  isWaitlisted: {
    type: Boolean,
    default: false
  },
  waitlistPosition: Number,
  movedFromWaitlistAt: Date,
  
  // Approval workflow
  requiresApproval: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  approvalNotes: String,
  
  // Attendance tracking
  attendanceDetails: {
    arrivalTime: Date,
    departureTime: Date,
    totalHours: Number,
    tasksCompleted: [String],
    supervisorNotes: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
eventRegistrationSchema.index({ user: 1, event: 1 }, { unique: true });
eventRegistrationSchema.index({ event: 1, status: 1 });
eventRegistrationSchema.index({ user: 1, status: 1 });
eventRegistrationSchema.index({ event: 1, registeredAt: -1 });
eventRegistrationSchema.index({ isWaitlisted: 1, waitlistPosition: 1 });

// Virtual for registration duration
eventRegistrationSchema.virtual('registrationDuration').get(function() {
  if (this.registeredAt && this.attendedAt) {
    return Math.floor((this.attendedAt - this.registeredAt) / (1000 * 60 * 60 * 24));
  }
  return null;
});

// Virtual for attendance status
eventRegistrationSchema.virtual('attendanceStatus').get(function() {
  if (this.status === 'completed' || this.status === 'attended') {
    return 'attended';
  } else if (this.status === 'checked_in') {
    return 'checked_in';
  } else if (this.status === 'cancelled') {
    return 'cancelled';
  } else if (this.status === 'no_show') {
    return 'no_show';
  }
  return 'registered';
});

// Method to check in user
eventRegistrationSchema.methods.checkIn = function(location = null) {
  this.status = 'checked_in';
  this.checkedInAt = new Date();
  
  if (location) {
    this.checkInLocation = location;
  }
  
  return this.save();
};

// Method to mark attendance
eventRegistrationSchema.methods.markAttendance = function() {
  this.status = 'attended';
  this.attendedAt = new Date();
  return this.save();
};

// Method to complete registration
eventRegistrationSchema.methods.complete = function(impactContribution = {}) {
  this.status = 'completed';
  this.completedAt = new Date();
  
  if (impactContribution) {
    this.impactContribution = { ...this.impactContribution, ...impactContribution };
  }
  
  return this.save();
};

// Method to cancel registration
eventRegistrationSchema.methods.cancel = function(reason = '') {
  this.status = 'cancelled';
  this.cancelledAt = new Date();
  this.cancellationReason = reason;
  return this.save();
};

// Method to submit feedback
eventRegistrationSchema.methods.submitFeedback = function(rating, feedback) {
  this.rating = rating;
  this.feedback = feedback;
  this.feedbackSubmittedAt = new Date();
  return this.save();
};

// Static method to get event registrations with pagination
eventRegistrationSchema.statics.getEventRegistrations = async function(eventId, options = {}) {
  const {
    page = 1,
    limit = 50,
    status,
    role,
    sortBy = 'registeredAt',
    sortOrder = 'desc'
  } = options;
  
  const query = { event: eventId };
  
  if (status) {
    query.status = status;
  }
  
  if (role) {
    query.role = role;
  }
  
  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
  
  const registrations = await this.find(query)
    .populate('user', 'name email avatar phone')
    .populate('approvedBy', 'name')
    .sort(sort)
    .skip(skip)
    .limit(limit);
  
  const total = await this.countDocuments(query);
  
  return {
    registrations,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// Static method to get user registrations
eventRegistrationSchema.statics.getUserRegistrations = async function(userId, options = {}) {
  const {
    page = 1,
    limit = 20,
    status,
    sortBy = 'registeredAt',
    sortOrder = 'desc'
  } = options;
  
  const query = { user: userId };
  
  if (status) {
    query.status = status;
  }
  
  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
  
  const registrations = await this.find(query)
    .populate('event', 'title date location status category')
    .sort(sort)
    .skip(skip)
    .limit(limit);
  
  const total = await this.countDocuments(query);
  
  return {
    registrations,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// Static method to get registration statistics
eventRegistrationSchema.statics.getRegistrationStats = async function(eventId) {
  const stats = await this.aggregate([
    { $match: { event: mongoose.Types.ObjectId(eventId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const roleStats = await this.aggregate([
    { $match: { event: mongoose.Types.ObjectId(eventId) } },
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const averageRating = await this.aggregate([
    { $match: { event: mongoose.Types.ObjectId(eventId), rating: { $exists: true } } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalRatings: { $sum: 1 }
      }
    }
  ]);
  
  return {
    statusBreakdown: stats,
    roleBreakdown: roleStats,
    averageRating: averageRating[0] || { averageRating: 0, totalRatings: 0 }
  };
};

// Ensure virtual fields are serialized
eventRegistrationSchema.set('toJSON', { virtuals: true });
eventRegistrationSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('EventRegistration', eventRegistrationSchema);
