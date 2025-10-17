const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  phone: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['citizen', 'organizer', 'moderator', 'sponsor', 'admin'],
    default: 'citizen'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // User preferences
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      events: { type: Boolean, default: true },
      achievements: { type: Boolean, default: true }
    },
    privacy: {
      profileVisible: { type: Boolean, default: true },
      showEmail: { type: Boolean, default: false },
      showPhone: { type: Boolean, default: false },
      showEvents: { type: Boolean, default: true }
    }
  },

  // User stats
  stats: {
    eventsAttended: { type: Number, default: 0 },
    eventsOrganized: { type: Number, default: 0 },
    badgesEarned: { type: Number, default: 0 },
    impactPoints: { type: Number, default: 0 },
    wasteCollected: { type: String, default: '0 lbs' },
    treesPlanted: { type: Number, default: 0 },
    itemsRepaired: { type: Number, default: 0 }
  },

  // Badge tracking
  earnedBadges: [{
    badge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Badge'
    },
    earnedAt: {
      type: Date,
      default: Date.now
    },
    points: Number
  }],

  // Event participation history
  eventHistory: [{
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    },
    role: {
      type: String,
      enum: ['participant', 'volunteer', 'organizer'],
      default: 'participant'
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'completed', 'cancelled'],
      default: 'registered'
    },
    impact: String,
    attendedAt: Date
  }],

  lastLogin: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'stats.impactPoints': -1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get user's current rank based on impact points
userSchema.methods.getCurrentRank = function() {
  const points = this.stats.impactPoints;
  if (points >= 1000) return 'Sustainability Master';
  if (points >= 500) return 'Environmental Champion';
  if (points >= 200) return 'Green Advocate';
  if (points >= 100) return 'Eco Warrior';
  if (points >= 50) return 'Nature Lover';
  return 'Newcomer';
};

// Get next rank requirements
userSchema.methods.getNextRank = function() {
  const points = this.stats.impactPoints;
  if (points < 50) return { name: 'Nature Lover', points: 50 };
  if (points < 100) return { name: 'Eco Warrior', points: 100 };
  if (points < 200) return { name: 'Green Advocate', points: 200 };
  if (points < 500) return { name: 'Environmental Champion', points: 500 };
  if (points < 1000) return { name: 'Sustainability Master', points: 1000 };
  return { name: 'Max Level', points: 1000 };
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.verificationToken;
  delete userObject.passwordResetToken;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
