const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Badge name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Badge name cannot exceed 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Badge description is required'],
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  icon: {
    type: String,
    required: [true, 'Badge icon is required'],
    maxlength: [10, 'Icon cannot exceed 10 characters']
  },
  category: {
    type: String,
    required: [true, 'Badge category is required'],
    enum: ['participation', 'environmental', 'leadership', 'social', 'repair', 'achievement', 'education', 'technology', 'consistency'],
    default: 'participation'
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  points: {
    type: Number,
    required: [true, 'Badge points are required'],
    min: [1, 'Points must be at least 1'],
    max: [1000, 'Points cannot exceed 1000']
  },
  requirements: {
    type: String,
    required: [true, 'Badge requirements are required'],
    maxlength: [200, 'Requirements cannot exceed 200 characters']
  },

  // Badge criteria for automatic awarding
  criteria: {
    type: {
      type: String,
      enum: ['events_attended', 'events_organized', 'impact_points', 'trees_planted', 'waste_collected', 'items_repaired', 'friends_invited', 'months_streak', 'rating_achieved', 'custom'],
      required: true
    },
    target: {
      type: Number,
      required: [true, 'Target value is required']
    },
    timeframe: {
      type: String,
      enum: ['lifetime', 'year', 'month', 'week'],
      default: 'lifetime'
    },
    category: String, // For category-specific badges
    customLogic: String // For complex badge logic
  },

  // Badge display settings
  display: {
    color: {
      type: String,
      default: '#10B981' // Default green color
    },
    backgroundColor: {
      type: String,
      default: '#ECFDF5'
    },
    borderColor: {
      type: String,
      default: '#10B981'
    },
    isAnimated: {
      type: Boolean,
      default: false
    }
  },

  // Badge availability
  isActive: {
    type: Boolean,
    default: true
  },
  isHidden: {
    type: Boolean,
    default: false // Hidden badges are not shown until earned
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date, // For time-limited badges

  // Badge statistics
  stats: {
    totalEarned: {
      type: Number,
      default: 0
    },
    totalAttempts: {
      type: Number,
      default: 0
    },
    averageTimeToEarn: {
      type: Number, // in days
      default: 0
    }
  },

  // Badge dependencies
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge'
  }],
  unlocks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge'
  }],

  // Badge metadata
  tags: [String],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'easy'
  },
  estimatedTime: {
    type: Number, // in days
    default: 1
  }
}, {
  timestamps: true
});

// Indexes for better query performance
badgeSchema.index({ category: 1, isActive: 1 });
badgeSchema.index({ rarity: 1 });
badgeSchema.index({ 'criteria.type': 1 });
badgeSchema.index({ points: -1 });
badgeSchema.index({ isHidden: 1, isActive: 1 });

// Virtual for badge rarity color
badgeSchema.virtual('rarityColor').get(function() {
  const colors = {
    common: 'bg-gray-100 text-gray-700 border-gray-300',
    uncommon: 'bg-green-100 text-green-700 border-green-300',
    rare: 'bg-blue-100 text-blue-700 border-blue-300',
    epic: 'bg-purple-100 text-purple-700 border-purple-300',
    legendary: 'bg-yellow-100 text-yellow-700 border-yellow-300'
  };
  return colors[this.rarity] || colors.common;
});

// Method to check if user meets badge criteria
badgeSchema.methods.checkCriteria = async function(userId, userStats = {}) {
  const User = mongoose.model('User');
  const Event = mongoose.model('Event');
  
  switch (this.criteria.type) {
    case 'events_attended':
      const attendedEvents = await Event.countDocuments({
        'eventHistory': {
          $elemMatch: {
            user: userId,
            status: { $in: ['attended', 'completed'] }
          }
        }
      });
      return attendedEvents >= this.criteria.target;
      
    case 'events_organized':
      const organizedEvents = await Event.countDocuments({
        organizer: userId,
        status: { $in: ['completed'] }
      });
      return organizedEvents >= this.criteria.target;
      
    case 'impact_points':
      const user = await User.findById(userId);
      return user && user.stats.impactPoints >= this.criteria.target;
      
    case 'trees_planted':
      const userTrees = await User.findById(userId);
      return userTrees && userTrees.stats.treesPlanted >= this.criteria.target;
      
    case 'waste_collected':
      // Parse waste collected string (e.g., "100 lbs" -> 100)
      const userWaste = await User.findById(userId);
      if (!userWaste) return false;
      const wasteAmount = parseInt(userWaste.stats.wasteCollected.match(/\d+/)?.[0] || '0');
      return wasteAmount >= this.criteria.target;
      
    case 'items_repaired':
      const userRepairs = await User.findById(userId);
      return userRepairs && userRepairs.stats.itemsRepaired >= this.criteria.target;
      
    case 'friends_invited':
      // This would need to be tracked separately in user model
      return false; // Placeholder
      
    case 'months_streak':
      // This would need streak tracking in user model
      return false; // Placeholder
      
    default:
      return false;
  }
};

// Method to award badge to user
badgeSchema.methods.awardToUser = async function(userId) {
  const User = mongoose.model('User');
  
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  // Check if user already has this badge
  const alreadyEarned = user.earnedBadges.some(badge => 
    badge.badge.toString() === this._id.toString()
  );
  
  if (alreadyEarned) {
    return { success: false, message: 'Badge already earned' };
  }
  
  // Add badge to user
  user.earnedBadges.push({
    badge: this._id,
    earnedAt: new Date(),
    points: this.points
  });
  
  // Update user stats
  user.stats.badgesEarned += 1;
  user.stats.impactPoints += this.points;
  
  await user.save();
  
  // Update badge stats
  this.stats.totalEarned += 1;
  await this.save();
  
  return { success: true, message: 'Badge awarded successfully' };
};

// Static method to check and award badges for a user
badgeSchema.statics.checkAndAwardBadges = async function(userId) {
  const User = mongoose.model('User');
  const user = await User.findById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  const activeBadges = await this.find({ isActive: true });
  const newlyAwarded = [];
  
  for (const badge of activeBadges) {
    // Check if user already has this badge
    const alreadyEarned = user.earnedBadges.some(earnedBadge => 
      earnedBadge.badge.toString() === badge._id.toString()
    );
    
    if (!alreadyEarned) {
      const meetsCriteria = await badge.checkCriteria(userId);
      if (meetsCriteria) {
        const result = await badge.awardToUser(userId);
        if (result.success) {
          newlyAwarded.push(badge);
        }
      }
    }
  }
  
  return newlyAwarded;
};

// Ensure virtual fields are serialized
badgeSchema.set('toJSON', { virtuals: true });
badgeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Badge', badgeSchema);
