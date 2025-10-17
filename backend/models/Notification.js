const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Notification recipient is required']
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    required: [true, 'Notification type is required'],
    enum: [
      'event_created',
      'event_updated',
      'event_cancelled',
      'event_reminder',
      'event_completed',
      'registration_confirmed',
      'registration_cancelled',
      'waitlist_moved',
      'badge_earned',
      'achievement_unlocked',
      'message_received',
      'verification_approved',
      'verification_rejected',
      'impact_submitted',
      'friend_invited',
      'system_announcement'
    ]
  },
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  data: {
    // Flexible data object for additional context
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    },
    badgeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Badge'
    },
    url: String, // Link for navigation
    metadata: mongoose.Schema.Types.Mixed
  },
  
  // Notification status
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  
  // Delivery settings
  channels: {
    inApp: {
      type: Boolean,
      default: true
    },
    email: {
      type: Boolean,
      default: false
    },
    push: {
      type: Boolean,
      default: false
    },
    sms: {
      type: Boolean,
      default: false
    }
  },
  
  // Delivery status
  deliveryStatus: {
    inApp: {
      sent: { type: Boolean, default: true },
      sentAt: { type: Date, default: Date.now }
    },
    email: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      error: String
    },
    push: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      error: String,
      deviceToken: String
    },
    sms: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      error: String,
      phoneNumber: String
    }
  },
  
  // Priority and scheduling
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  scheduledFor: Date, // For delayed notifications
  
  // Expiration
  expiresAt: Date,
  
  // Notification actions (for interactive notifications)
  actions: [{
    label: String,
    action: String,
    url: String,
    style: {
      type: String,
      enum: ['default', 'primary', 'secondary', 'destructive'],
      default: 'default'
    }
  }],
  
  // Grouping for batch notifications
  groupKey: String,
  isGrouped: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better query performance
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ scheduledFor: 1 });
notificationSchema.index({ expiresAt: 1 });
notificationSchema.index({ groupKey: 1 });

// Virtual for notification age
notificationSchema.virtual('age').get(function() {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffInMinutes = Math.floor((now - created) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`;
  
  return created.toLocaleDateString();
});

// Method to mark notification as read
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Method to mark notification as unread
notificationSchema.methods.markAsUnread = function() {
  this.isRead = false;
  this.readAt = undefined;
  return this.save();
};

// Static method to create notification
notificationSchema.statics.createNotification = async function(notificationData) {
  const notification = new this(notificationData);
  await notification.save();
  
  // Emit real-time notification if socket.io is available
  if (global.io) {
    global.io.to(notification.recipient.toString()).emit('new_notification', notification);
  }
  
  return notification;
};

// Static method to get user notifications with pagination
notificationSchema.statics.getUserNotifications = async function(userId, options = {}) {
  const {
    page = 1,
    limit = 20,
    unreadOnly = false,
    type,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = options;
  
  const query = { recipient: userId };
  
  if (unreadOnly) {
    query.isRead = false;
  }
  
  if (type) {
    query.type = type;
  }
  
  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
  
  const notifications = await this.find(query)
    .populate('sender', 'name avatar')
    .populate('data.eventId', 'title date')
    .populate('data.badgeId', 'name icon')
    .sort(sort)
    .skip(skip)
    .limit(limit);
  
  const total = await this.countDocuments(query);
  
  return {
    notifications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// Static method to mark all user notifications as read
notificationSchema.statics.markAllAsRead = async function(userId) {
  return await this.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

// Static method to delete old notifications
notificationSchema.statics.cleanupOldNotifications = async function(daysOld = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  return await this.deleteMany({
    createdAt: { $lt: cutoffDate },
    isRead: true
  });
};

// Static method to send bulk notifications
notificationSchema.statics.sendBulkNotifications = async function(recipients, notificationData) {
  const notifications = recipients.map(recipientId => ({
    ...notificationData,
    recipient: recipientId
  }));
  
  const created = await this.insertMany(notifications);
  
  // Emit real-time notifications
  if (global.io) {
    created.forEach(notification => {
      global.io.to(notification.recipient.toString()).emit('new_notification', notification);
    });
  }
  
  return created;
};

// Ensure virtual fields are serialized
notificationSchema.set('toJSON', { virtuals: true });
notificationSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Notification', notificationSchema);
