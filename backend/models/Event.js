const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: ['cleanup', 'tree-planting', 'repair', 'e-waste', 'education', 'other'],
    default: 'other'
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organizerName: {
    type: String,
    required: true
  },
  organizerEmail: {
    type: String,
    required: true
  },
  
  // Event timing
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  time: {
    type: String,
    required: [true, 'Event time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide valid time format (HH:MM)']
  },
  endTime: {
    type: String,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide valid time format (HH:MM)']
  },
  duration: {
    type: Number, // in minutes
    default: 180
  },

  // Location details
  location: {
    name: {
      type: String,
      required: [true, 'Location name is required'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    },
    city: String,
    state: String,
    zipCode: String
  },

  // Capacity and registration
  capacity: {
    type: Number,
    required: [true, 'Event capacity is required'],
    min: [1, 'Capacity must be at least 1'],
    max: [1000, 'Capacity cannot exceed 1000']
  },
  registeredParticipants: {
    type: Number,
    default: 0
  },
  waitlist: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Event details
  requirements: {
    type: String,
    maxlength: [1000, 'Requirements cannot exceed 1000 characters']
  },
  whatToBring: {
    type: String,
    maxlength: [1000, 'What to bring cannot exceed 1000 characters']
  },
  ageRestriction: {
    min: { type: Number, min: 0 },
    max: { type: Number, min: 0 }
  },

  // Accessibility
  accessibility: [{
    type: String,
    enum: ['wheelchair-accessible', 'public-transport', 'sign-language', 'audio-description', 'other']
  }],

  // Media
  images: [{
    url: String,
    caption: String,
    isPrimary: { type: Boolean, default: false }
  }],
  coverImage: String,

  // Status and verification
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'active', 'completed', 'cancelled'],
    default: 'draft'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationNotes: String,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date,

  // Event metrics
  metrics: {
    checkInCount: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    impactMetrics: {
      wasteCollected: { type: String, default: '0 lbs' },
      treesPlanted: { type: Number, default: 0 },
      itemsRepaired: { type: Number, default: 0 },
      carbonSaved: { type: String, default: '0 lbs' }
    }
  },

  // Tags for search and categorization
  tags: [String],

  // Event visibility
  isPublic: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },

  // Registration settings
  registrationDeadline: Date,
  allowWaitlist: {
    type: Boolean,
    default: true
  },
  requiresApproval: {
    type: Boolean,
    default: false
  },

  // Event completion
  completedAt: Date,
  completionNotes: String,
  impactReport: String
}, {
  timestamps: true
});

// Indexes for better query performance
eventSchema.index({ date: 1, status: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ 'location.coordinates.latitude': 1, 'location.coordinates.longitude': 1 });
eventSchema.index({ tags: 1 });
eventSchema.index({ isPublic: 1, featured: 1 });
eventSchema.index({ createdAt: -1 });

// Virtual for checking if event is full
eventSchema.virtual('isFull').get(function() {
  return this.registeredParticipants >= this.capacity;
});

// Virtual for checking if registration is open
eventSchema.virtual('isRegistrationOpen').get(function() {
  const now = new Date();
  const deadline = this.registrationDeadline || this.date;
  return now < deadline && this.status === 'active';
});

// Virtual for checking if event is upcoming
eventSchema.virtual('isUpcoming').get(function() {
  return new Date() < this.date;
});

// Virtual for checking if event is past
eventSchema.virtual('isPast').get(function() {
  return new Date() > this.date;
});

// Method to add participant
eventSchema.methods.addParticipant = function(userId) {
  if (this.registeredParticipants < this.capacity) {
    this.registeredParticipants += 1;
    return { success: true, message: 'Successfully registered' };
  } else if (this.allowWaitlist) {
    // Check if user is already on waitlist
    const alreadyOnWaitlist = this.waitlist.some(w => w.user.toString() === userId.toString());
    if (!alreadyOnWaitlist) {
      this.waitlist.push({ user: userId });
      return { success: true, message: 'Added to waitlist' };
    } else {
      return { success: false, message: 'Already on waitlist' };
    }
  } else {
    return { success: false, message: 'Event is full and waitlist is not available' };
  }
};

// Method to remove participant
eventSchema.methods.removeParticipant = function(userId) {
  // Remove from waitlist first
  const waitlistIndex = this.waitlist.findIndex(w => w.user.toString() === userId.toString());
  if (waitlistIndex !== -1) {
    this.waitlist.splice(waitlistIndex, 1);
    return { success: true, message: 'Removed from waitlist' };
  }
  
  // If not on waitlist, remove from registered participants
  if (this.registeredParticipants > 0) {
    this.registeredParticipants -= 1;
    
    // Move someone from waitlist to registered if available
    if (this.waitlist.length > 0) {
      const nextInWaitlist = this.waitlist.shift();
      this.registeredParticipants += 1;
      return { 
        success: true, 
        message: 'Removed from event and notified next person on waitlist',
        movedFromWaitlist: nextInWaitlist.user
      };
    }
    
    return { success: true, message: 'Removed from event' };
  }
  
  return { success: false, message: 'User not found in participants or waitlist' };
};

// Method to calculate distance from coordinates
eventSchema.methods.calculateDistance = function(lat, lon) {
  if (!this.location.coordinates.latitude || !this.location.coordinates.longitude) {
    return null;
  }
  
  const R = 6371; // Earth's radius in kilometers
  const dLat = this.toRadians(this.location.coordinates.latitude - lat);
  const dLon = this.toRadians(this.location.coordinates.longitude - lon);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(this.toRadians(lat)) * Math.cos(this.toRadians(this.location.coordinates.latitude)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

eventSchema.methods.toRadians = function(degrees) {
  return degrees * (Math.PI/180);
};

// Ensure virtual fields are serialized
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
