const User = require('../models/User');
const Badge = require('../models/Badge');
const Event = require('../models/Event');
const Agency = require('../models/Agency');

const seedBadges = async () => {
  const badges = [
    {
      name: 'First Step',
      description: 'Attended your first sustainability event',
      icon: '🌱',
      category: 'participation',
      rarity: 'common',
      points: 10,
      requirements: 'Attend 1 event',
      criteria: {
        type: 'events_attended',
        target: 1,
        timeframe: 'lifetime'
      }
    },
    {
      name: 'Tree Guardian',
      description: 'Planted 10+ trees to help combat climate change',
      icon: '🌳',
      category: 'environmental',
      rarity: 'uncommon',
      points: 25,
      requirements: 'Plant 10 trees',
      criteria: {
        type: 'trees_planted',
        target: 10,
        timeframe: 'lifetime'
      }
    },
    {
      name: 'Ocean Protector',
      description: 'Participated in 5 beach cleanup events',
      icon: '🌊',
      category: 'environmental',
      rarity: 'uncommon',
      points: 30,
      requirements: 'Join 5 beach cleanups',
      criteria: {
        type: 'events_attended',
        target: 5,
        timeframe: 'lifetime',
        category: 'cleanup'
      }
    },
    {
      name: 'Repair Champion',
      description: 'Fixed 20+ items at repair cafés',
      icon: '🔧',
      category: 'repair',
      rarity: 'rare',
      points: 40,
      requirements: 'Repair 20 items',
      criteria: {
        type: 'items_repaired',
        target: 20,
        timeframe: 'lifetime'
      }
    },
    {
      name: 'Impact Maker',
      description: 'Reached 200+ impact points',
      icon: '⭐',
      category: 'achievement',
      rarity: 'rare',
      points: 50,
      requirements: 'Earn 200 impact points',
      criteria: {
        type: 'impact_points',
        target: 200,
        timeframe: 'lifetime'
      }
    },
    {
      name: 'Community Leader',
      description: 'Organized 3+ successful events',
      icon: '👥',
      category: 'leadership',
      rarity: 'epic',
      points: 75,
      requirements: 'Organize 3 events',
      criteria: {
        type: 'events_organized',
        target: 3,
        timeframe: 'lifetime'
      }
    },
    {
      name: 'Waste Warrior',
      description: 'Collected 100+ pounds of waste',
      icon: '♻️',
      category: 'environmental',
      rarity: 'rare',
      points: 45,
      requirements: 'Collect 100 lbs of waste',
      criteria: {
        type: 'waste_collected',
        target: 100,
        timeframe: 'lifetime'
      }
    },
    {
      name: 'Green Advocate',
      description: 'Invited 10+ friends to join the platform',
      icon: '🌿',
      category: 'social',
      rarity: 'uncommon',
      points: 35,
      requirements: 'Invite 10 friends',
      criteria: {
        type: 'friends_invited',
        target: 10,
        timeframe: 'lifetime'
      }
    }
  ];

  for (const badgeData of badges) {
    const existingBadge = await Badge.findOne({ name: badgeData.name });
    if (!existingBadge) {
      await Badge.create(badgeData);
      console.log(`Created badge: ${badgeData.name}`);
    }
  }
};

const seedUsers = async () => {
  const users = [
    {
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      password: 'password123',
      role: 'citizen',
      location: 'San Francisco, CA',
      bio: 'Passionate about environmental sustainability and community engagement.',
      stats: {
        eventsAttended: 12,
        badgesEarned: 8,
        impactPoints: 245,
        wasteCollected: '45 lbs',
        treesPlanted: 15,
        itemsRepaired: 23
      }
    },
    {
      name: 'Sarah Green',
      email: 'sarah.green@example.com',
      password: 'password123',
      role: 'organizer',
      location: 'Seattle, WA',
      bio: 'Environmental activist and community organizer.',
      stats: {
        eventsAttended: 25,
        eventsOrganized: 8,
        badgesEarned: 12,
        impactPoints: 450,
        wasteCollected: '120 lbs',
        treesPlanted: 35,
        itemsRepaired: 45
      }
    },
    {
      name: 'Mike Chen',
      email: 'mike.chen@example.com',
      password: 'password123',
      role: 'admin',
      location: 'Portland, OR',
      bio: 'Platform administrator and sustainability advocate.',
      stats: {
        eventsAttended: 50,
        eventsOrganized: 15,
        badgesEarned: 20,
        impactPoints: 800,
        wasteCollected: '200 lbs',
        treesPlanted: 60,
        itemsRepaired: 80
      }
    }
  ];

  for (const userData of users) {
    const existingUser = await User.findOne({ email: userData.email });
    if (!existingUser) {
      const user = await User.create(userData);
      console.log(`Created user: ${user.name}`);
    }
  }
};

const seedAgencies = async () => {
  const agencies = [
    {
      name: 'Green Future Collective',
      description: 'A nonprofit organization dedicated to environmental sustainability and community engagement.',
      type: 'nonprofit',
      website: 'https://greenfuture.org',
      contactInfo: {
        email: 'contact@greenfuture.org',
        phone: '+1-555-0123',
        address: {
          street: '123 Green Street',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94102'
        }
      },
      verificationStatus: 'verified'
    },
    {
      name: 'City Environmental Department',
      description: 'Municipal department responsible for environmental programs and sustainability initiatives.',
      type: 'government',
      website: 'https://city.gov/environmental',
      contactInfo: {
        email: 'environment@city.gov',
        phone: '+1-555-0456',
        address: {
          street: '456 City Hall Plaza',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94102'
        }
      },
      verificationStatus: 'verified'
    }
  ];

  for (const agencyData of agencies) {
    const existingAgency = await Agency.findOne({ name: agencyData.name });
    if (!existingAgency) {
      await Agency.create(agencyData);
      console.log(`Created agency: ${agencyData.name}`);
    }
  }
};

const seedEvents = async () => {
  const users = await User.find({ role: 'organizer' }).limit(2);
  if (users.length === 0) {
    console.log('No organizer users found. Please seed users first.');
    return;
  }

  const events = [
    {
      title: 'Community Beach Cleanup',
      description: 'Join us for a morning of cleaning up our beautiful coastline. We\'ll provide all necessary equipment and refreshments. This is a great opportunity to make a positive impact on our environment and meet like-minded community members.',
      category: 'cleanup',
      organizer: users[0]._id,
      organizerName: users[0].name,
      organizerEmail: users[0].email,
      date: new Date('2024-10-15'),
      time: '09:00',
      endTime: '12:00',
      duration: 180,
      location: {
        name: 'Sunset Beach',
        address: '123 Sunset Blvd, San Francisco, CA 94102',
        coordinates: {
          latitude: 37.7749,
          longitude: -122.4194
        },
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102'
      },
      capacity: 50,
      requirements: 'Please bring water, sunscreen, and comfortable clothing. We\'ll provide gloves and trash bags.',
      whatToBring: 'Water bottle, sunscreen, comfortable walking shoes',
      accessibility: ['wheelchair-accessible', 'public-transport'],
      tags: ['beach', 'plastic', 'ocean-conservation'],
      status: 'active',
      isVerified: true
    },
    {
      title: 'Urban Tree Planting',
      description: 'Help us plant native trees in our urban park to improve air quality and create a greener city. No experience necessary - we\'ll teach you everything you need to know!',
      category: 'tree-planting',
      organizer: users[1] ? users[1]._id : users[0]._id,
      organizerName: users[1] ? users[1].name : users[0].name,
      organizerEmail: users[1] ? users[1].email : users[0].email,
      date: new Date('2024-10-18'),
      time: '08:00',
      endTime: '11:00',
      duration: 180,
      location: {
        name: 'Central Park',
        address: '456 Park Ave, San Francisco, CA 94103',
        coordinates: {
          latitude: 37.7849,
          longitude: -122.4094
        },
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94103'
      },
      capacity: 30,
      requirements: 'Please bring work gloves if you have them. We\'ll provide tools and saplings.',
      whatToBring: 'Work gloves, water bottle, comfortable clothes',
      accessibility: ['wheelchair-accessible'],
      tags: ['trees', 'air-quality', 'urban-forestry'],
      status: 'active',
      isVerified: true
    },
    {
      title: 'Repair Café Workshop',
      description: 'Bring your broken items and learn how to fix them! Our skilled volunteers will help you repair electronics, clothing, and small appliances. Reduce waste and learn new skills!',
      category: 'repair',
      organizer: users[0]._id,
      organizerName: users[0].name,
      organizerEmail: users[0].email,
      date: new Date('2024-10-20'),
      time: '14:00',
      endTime: '18:00',
      duration: 240,
      location: {
        name: 'Community Center',
        address: '789 Community St, San Francisco, CA 94104',
        coordinates: {
          latitude: 37.7949,
          longitude: -122.3994
        },
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94104'
      },
      capacity: 20,
      requirements: 'Bring items you want to repair. Basic tools will be provided.',
      whatToBring: 'Broken items, any spare parts you might have',
      accessibility: ['wheelchair-accessible', 'sign-language'],
      tags: ['repair', 'electronics', 'sustainability'],
      status: 'active',
      isVerified: true
    }
  ];

  for (const eventData of events) {
    const existingEvent = await Event.findOne({ title: eventData.title });
    if (!existingEvent) {
      await Event.create(eventData);
      console.log(`Created event: ${eventData.title}`);
    }
  }
};

const seedAll = async () => {
  try {
    console.log('Starting database seeding...');
    
    await seedUsers();
    await seedBadges();
    await seedAgencies();
    await seedEvents();
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = {
  seedBadges,
  seedUsers,
  seedAgencies,
  seedEvents,
  seedAll
};
