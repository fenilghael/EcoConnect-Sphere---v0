import { useState } from 'react';
import { User, Award, Calendar, Settings, Shield, Eye, EyeOff, Mail, Phone, MapPin, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface UserProfileProps {
  userRole?: 'citizen' | 'organizer' | 'moderator' | 'sponsor' | 'admin';
}

export function UserProfile({ userRole = 'citizen' }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Passionate about environmental sustainability and community engagement. Love organizing and participating in local cleanup events.',
    joinDate: '2023-03-15',
    notifications: {
      email: true,
      push: true,
      events: true,
      achievements: true
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
      showPhone: false,
      showEvents: true
    }
  });

  const badges = [
    { id: 1, name: 'First Event', icon: '🌱', description: 'Attended your first sustainability event', earned: '2024-03-20' },
    { id: 2, name: 'Tree Guardian', icon: '🌳', description: 'Planted 10+ trees', earned: '2024-04-15' },
    { id: 3, name: 'Ocean Protector', icon: '🌊', description: 'Participated in 5 beach cleanups', earned: '2024-05-10' },
    { id: 4, name: 'Repair Champion', icon: '🔧', description: 'Fixed 20+ items at repair cafes', earned: '2024-06-05' },
    { id: 5, name: 'Impact Maker', icon: '⭐', description: 'Reached 200+ impact points', earned: '2024-07-01' },
    { id: 6, name: 'Community Leader', icon: '👥', description: 'Organized 3+ events', earned: '2024-08-15' },
    { id: 7, name: 'Waste Warrior', icon: '♻️', description: 'Collected 100+ lbs of waste', earned: '2024-09-10' },
    { id: 8, name: 'Green Advocate', icon: '🌿', description: 'Invited 10+ friends to join', earned: '2024-09-25' }
  ];

  const eventHistory = [
    {
      id: 1,
      title: 'Community Beach Cleanup',
      date: '2024-09-15',
      role: 'Participant',
      status: 'Completed',
      impact: '15 lbs of waste collected',
      image: 'https://images.unsplash.com/photo-1758599668932-484f54cdf48f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBjbGVhbnVwJTIwZW52aXJvbm1lbnR8ZW58MXx8fHwxNzU5NDc0NDAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 2,
      title: 'Urban Tree Planting',
      date: '2024-08-22',
      role: 'Volunteer',
      status: 'Completed',
      impact: '3 trees planted',
      image: 'https://images.unsplash.com/photo-1633975531445-94aa5f8d5a26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVlJTIwcGxhbnRpbmclMjB2b2x1bnRlZXJzfGVufDF8fHx8MTc1OTQwMzI4MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 3,
      title: 'Repair Café Workshop',
      date: '2024-07-30',
      role: 'Organizer',
      status: 'Completed',
      impact: '8 items repaired',
      image: 'https://images.unsplash.com/photo-1677742331762-4bdcff04ddfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXBhaXIlMjBjYWZlJTIwc3VzdGFpbmFiaWxpdHl8ZW58MXx8fHwxNzU5NDc0NDA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 4,
      title: 'E-Waste Collection Drive',
      date: '2024-10-15',
      role: 'Participant',
      status: 'Registered',
      impact: 'Upcoming',
      image: 'https://images.unsplash.com/photo-1637681262973-a516e647e826?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXN0ZSUyMGNvbGxlY3Rpb24lMjByZWN5Y2xpbmd8ZW58MXx8fHwxNzU5NDc0NDA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ];

  const stats = {
    eventsAttended: 12,
    eventsOrganized: userRole === 'organizer' ? 4 : 0,
    badgesEarned: 8,
    impactPoints: 245,
    wasteCollected: '45 lbs',
    treesPlanted: 15,
    itemsRepaired: 23
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src="" />
              <AvatarFallback className="bg-[var(--eco-green-100)] text-[var(--eco-green-700)] text-2xl">
                {profileData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl">{profileData.name}</h1>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{profileData.location}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-[var(--eco-green-100)] text-[var(--eco-green-700)]">
                    {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="border-[var(--eco-green-200)] hover:bg-[var(--eco-green-50)]"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Member since {new Date(profileData.joinDate).toLocaleDateString()}
              </p>
              
              {profileData.bio && (
                <p className="text-sm">{profileData.bio}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl mb-1">{stats.eventsAttended}</div>
            <p className="text-xs text-muted-foreground">Events Attended</p>
          </CardContent>
        </Card>
        
        {userRole === 'organizer' && (
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-2xl mb-1">{stats.eventsOrganized}</div>
              <p className="text-xs text-muted-foreground">Events Organized</p>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl mb-1">{stats.badgesEarned}</div>
            <p className="text-xs text-muted-foreground">Badges Earned</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl mb-1">{stats.impactPoints}</div>
            <p className="text-xs text-muted-foreground">Impact Points</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="badges" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="history">Event History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Badges Tab */}
        <TabsContent value="badges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5 text-[var(--eco-green-600)]" />
                Your Badges ({badges.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map((badge) => (
                  <div key={badge.id} className="p-4 bg-[var(--eco-green-50)] rounded-lg hover:bg-[var(--eco-green-100)] transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
                        {badge.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm">{badge.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                        <p className="text-xs text-[var(--eco-green-600)] mt-2">
                          Earned {new Date(badge.earned).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Impact Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Your Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-[var(--eco-green-50)] rounded-lg">
                  <div className="text-2xl mb-1">♻️</div>
                  <div className="text-lg">{stats.wasteCollected}</div>
                  <p className="text-xs text-muted-foreground">Waste Collected</p>
                </div>
                <div className="text-center p-4 bg-[var(--eco-green-50)] rounded-lg">
                  <div className="text-2xl mb-1">🌳</div>
                  <div className="text-lg">{stats.treesPlanted}</div>
                  <p className="text-xs text-muted-foreground">Trees Planted</p>
                </div>
                <div className="text-center p-4 bg-[var(--eco-green-50)] rounded-lg">
                  <div className="text-2xl mb-1">🔧</div>
                  <div className="text-lg">{stats.itemsRepaired}</div>
                  <p className="text-xs text-muted-foreground">Items Repaired</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Event History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-[var(--eco-green-600)]" />
                Event History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {eventHistory.map((event) => (
                  <div key={event.id} className="flex items-center space-x-4 p-4 bg-[var(--eco-green-50)] rounded-lg">
                    <ImageWithFallback
                      src={event.image}
                      alt={event.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 space-y-1">
                      <h3 className="text-sm">{event.title}</h3>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                        <Badge variant="outline" className="text-xs border-[var(--eco-green-200)]">
                          {event.role}
                        </Badge>
                        <Badge 
                          variant={event.status === 'Completed' ? 'default' : 'secondary'}
                          className={event.status === 'Completed' ? 'bg-[var(--eco-green-600)]' : ''}
                        >
                          {event.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-[var(--eco-green-600)]">{event.impact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          {isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      value={profileData.location}
                      onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button className="bg-[var(--eco-green-600)] hover:bg-[var(--eco-green-700)]">
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Account Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5 text-[var(--eco-green-600)]" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{profileData.email}</span>
                      </div>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{profileData.phone}</span>
                      </div>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{profileData.location}</span>
                      </div>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Email Notifications</p>
                      <p className="text-xs text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Switch checked={profileData.notifications.email} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Push Notifications</p>
                      <p className="text-xs text-muted-foreground">Receive mobile push notifications</p>
                    </div>
                    <Switch checked={profileData.notifications.push} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Event Reminders</p>
                      <p className="text-xs text-muted-foreground">Get reminded about upcoming events</p>
                    </div>
                    <Switch checked={profileData.notifications.events} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Achievement Notifications</p>
                      <p className="text-xs text-muted-foreground">Get notified when you earn badges</p>
                    </div>
                    <Switch checked={profileData.notifications.achievements} />
                  </div>
                </CardContent>
              </Card>

              {/* Privacy */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-[var(--eco-green-600)]" />
                    Privacy Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Public Profile</p>
                      <p className="text-xs text-muted-foreground">Allow others to view your profile</p>
                    </div>
                    <Switch checked={profileData.privacy.profileVisible} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Show Email</p>
                      <p className="text-xs text-muted-foreground">Display email on public profile</p>
                    </div>
                    <Switch checked={profileData.privacy.showEmail} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Show Event History</p>
                      <p className="text-xs text-muted-foreground">Display your event participation</p>
                    </div>
                    <Switch checked={profileData.privacy.showEvents} />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}