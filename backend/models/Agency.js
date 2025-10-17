const mongoose = require('mongoose');

const agencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Agency name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Agency name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Agency description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  type: {
    type: String,
    required: [true, 'Agency type is required'],
    enum: ['government', 'nonprofit', 'corporate', 'community', 'educational', 'other'],
    default: 'community'
  },
  website: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please provide a valid website URL']
  },
  contactInfo: {
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: {
        type: String,
        default: 'USA'
      }
    }
  },
  
  // Agency administrators
  administrators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'moderator', 'viewer'],
      default: 'moderator'
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    permissions: {
      canVerifyOrganizers: { type: Boolean, default: false },
      canManageEvents: { type: Boolean, default: false },
      canViewAnalytics: { type: Boolean, default: true },
      canManageBadges: { type: Boolean, default: false }
    }
  }],
  
  // Agency verification status
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'suspended'],
    default: 'pending'
  },
  verificationDocuments: [{
    type: {
      type: String,
      enum: ['business_license', 'nonprofit_certificate', 'insurance_policy', 'tax_exempt', 'other'],
      required: true
    },
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    verified: {
      type: Boolean,
      default: false
    }
  }],
  verificationNotes: String,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date,
  
  // Agency statistics
  stats: {
    totalEvents: { type: Number, default: 0 },
    totalParticipants: { type: Number, default: 0 },
    totalOrganizers: { type: Number, default: 0 },
    totalImpact: {
      wasteCollected: { type: String, default: '0 lbs' },
      treesPlanted: { type: Number, default: 0 },
      itemsRepaired: { type: Number, default: 0 },
      carbonSaved: { type: String, default: '0 tons' },
      volunteerHours: { type: Number, default: 0 }
    }
  },
  
  // Agency settings
  settings: {
    autoVerifyOrganizers: {
      type: Boolean,
      default: false
    },
    requireEventApproval: {
      type: Boolean,
      default: true
    },
    allowPublicEvents: {
      type: Boolean,
      default: true
    },
    maxEventsPerOrganizer: {
      type: Number,
      default: 10
    }
  },
  
  // Agency branding
  branding: {
    logo: String,
    primaryColor: {
      type: String,
      default: '#10B981'
    },
    secondaryColor: {
      type: String,
      default: '#059669'
    },
    customDomain: String
  },
  
  // Agency activity tracking
  lastActivity: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Agency notifications
  notificationSettings: {
    newOrganizerApplications: { type: Boolean, default: true },
    eventReports: { type: Boolean, default: true },
    monthlyReports: { type: Boolean, default: true },
    systemUpdates: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
agencySchema.index({ name: 1 });
agencySchema.index({ type: 1 });
agencySchema.index({ verificationStatus: 1 });
agencySchema.index({ 'contactInfo.email': 1 });
agencySchema.index({ 'administrators.user': 1 });

// Virtual for agency verification badge
agencySchema.virtual('verificationBadge').get(function() {
  switch (this.verificationStatus) {
    case 'verified':
      return { color: 'green', text: 'Verified', icon: '✓' };
    case 'pending':
      return { color: 'yellow', text: 'Pending', icon: '⏳' };
    case 'rejected':
      return { color: 'red', text: 'Rejected', icon: '✗' };
    case 'suspended':
      return { color: 'gray', text: 'Suspended', icon: '⏸' };
    default:
      return { color: 'gray', text: 'Unknown', icon: '?' };
  }
});

// Method to add administrator
agencySchema.methods.addAdministrator = async function(userId, role = 'moderator', addedBy = null) {
  // Check if user is already an administrator
  const existingAdmin = this.administrators.find(admin => 
    admin.user.toString() === userId.toString()
  );
  
  if (existingAdmin) {
    throw new Error('User is already an administrator');
  }
  
  this.administrators.push({
    user: userId,
    role: role,
    addedBy: addedBy,
    addedAt: new Date()
  });
  
  return await this.save();
};

// Method to remove administrator
agencySchema.methods.removeAdministrator = async function(userId) {
  this.administrators = this.administrators.filter(admin => 
    admin.user.toString() !== userId.toString()
  );
  
  return await this.save();
};

// Method to update administrator permissions
agencySchema.methods.updateAdministratorPermissions = async function(userId, permissions) {
  const admin = this.administrators.find(admin => 
    admin.user.toString() === userId.toString()
  );
  
  if (!admin) {
    throw new Error('Administrator not found');
  }
  
  admin.permissions = { ...admin.permissions, ...permissions };
  return await this.save();
};

// Method to verify agency
agencySchema.methods.verify = function(verifiedBy, notes = '') {
  this.verificationStatus = 'verified';
  this.verifiedBy = verifiedBy;
  this.verifiedAt = new Date();
  this.verificationNotes = notes;
  return this.save();
};

// Method to reject agency
agencySchema.methods.reject = function(rejectedBy, notes = '') {
  this.verificationStatus = 'rejected';
  this.verifiedBy = rejectedBy;
  this.verifiedAt = new Date();
  this.verificationNotes = notes;
  return this.save();
};

// Method to suspend agency
agencySchema.methods.suspend = function(suspendedBy, notes = '') {
  this.verificationStatus = 'suspended';
  this.verifiedBy = suspendedBy;
  this.verifiedAt = new Date();
  this.verificationNotes = notes;
  this.isActive = false;
  return this.save();
};

// Method to update agency statistics
agencySchema.methods.updateStats = async function() {
  const Event = mongoose.model('Event');
  const User = mongoose.model('User');
  
  // Count events organized by agency administrators
  const adminIds = this.administrators.map(admin => admin.user);
  const totalEvents = await Event.countDocuments({
    organizer: { $in: adminIds },
    status: { $in: ['completed', 'active'] }
  });
  
  // Count total participants (this would need to be calculated from event registrations)
  // For now, we'll use a placeholder
  const totalParticipants = 0;
  
  // Count organizers in the agency
  const totalOrganizers = adminIds.length;
  
  this.stats = {
    ...this.stats,
    totalEvents,
    totalParticipants,
    totalOrganizers
  };
  
  return await this.save();
};

// Static method to get agencies with pagination
agencySchema.statics.getAgencies = async function(options = {}) {
  const {
    page = 1,
    limit = 20,
    type,
    verificationStatus,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = options;
  
  const query = {};
  
  if (type) {
    query.type = type;
  }
  
  if (verificationStatus) {
    query.verificationStatus = verificationStatus;
  }
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  
  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
  
  const agencies = await this.find(query)
    .populate('administrators.user', 'name email avatar')
    .populate('verifiedBy', 'name')
    .sort(sort)
    .skip(skip)
    .limit(limit);
  
  const total = await this.countDocuments(query);
  
  return {
    agencies,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// Static method to get agency statistics
agencySchema.statics.getAgencyStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$verificationStatus',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const typeStats = await this.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const totalStats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalAgencies: { $sum: 1 },
        totalEvents: { $sum: '$stats.totalEvents' },
        totalParticipants: { $sum: '$stats.totalParticipants' }
      }
    }
  ]);
  
  return {
    verificationBreakdown: stats,
    typeBreakdown: typeStats,
    totalStats: totalStats[0] || { totalAgencies: 0, totalEvents: 0, totalParticipants: 0 }
  };
};

// Ensure virtual fields are serialized
agencySchema.set('toJSON', { virtuals: true });
agencySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Agency', agencySchema);
