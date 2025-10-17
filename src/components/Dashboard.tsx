import { Calendar, MapPin, Award, Bell, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DashboardProps {
  setCurrentView: (view: string) => void;
}

export function Dashboard({ setCurrentView }: DashboardProps) {
  const upcomingEvents = [
    {
      id: 1,
      title: "Community Beach Cleanup",
      date: "Oct 15, 2024",
      time: "9:00 AM",
      location: "Sunset Beach",
      image: "https://images.unsplash.com/photo-1758599668932-484f54cdf48f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBjbGVhbnVwJTIwZW52aXJvbm1lbnR8ZW58MXx8fHwxNzU5NDc0NDAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      organizer: "Green Ocean Initiative"
    },
    {
      id: 2,
      title: "Urban Tree Planting",
      date: "Oct 18, 2024",
      time: "8:00 AM",
      location: "Central Park",
      image: "https://images.unsplash.com/photo-1633975531445-94aa5f8d5a26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVlJTIwcGxhbnRpbmclMjB2b2x1bnRlZXJzfGVufDF8fHx8MTc1OTQwMzI4MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      organizer: "City Green Team"
    }
  ];

  const recentBadges = [
    { name: "First Event", icon: "🌱", earned: "2 days ago" },
    { name: "Tree Guardian", icon: "🌳", earned: "1 week ago" },
    { name: "Ocean Protector", icon: "🌊", earned: "2 weeks ago" }
  ];

  const notifications = [
    { id: 1, message: "New event: E-Waste Collection Drive", time: "2 hours ago", type: "event" },
    { id: 2, message: "You earned the 'Impact Maker' badge!", time: "1 day ago", type: "achievement" },
    { id: 3, message: "Reminder: Beach cleanup tomorrow at 9 AM", time: "1 day ago", type: "reminder" }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[var(--eco-green-50)] to-[var(--eco-teal-50)] p-6 rounded-xl">
        <h1 className="text-2xl mb-2">Welcome back, Alex! 🌱</h1>
        <p className="text-[var(--eco-green-700)]">You've contributed to 12 events and made a real impact in your community.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Events Attended</CardTitle>
            <Calendar className="h-4 w-4 text-[var(--eco-green-600)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl mb-1">12</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +2 this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Badges Earned</CardTitle>
            <Award className="h-4 w-4 text-[var(--eco-green-600)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl mb-1">8</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +1 this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Impact Score</CardTitle>
            <Users className="h-4 w-4 text-[var(--eco-green-600)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl mb-1">245</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +15 this week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-[var(--eco-green-600)]" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center space-x-4 p-3 bg-[var(--eco-green-50)] rounded-lg hover:bg-[var(--eco-green-100)] transition-colors cursor-pointer">
                <ImageWithFallback
                  src={event.image}
                  alt={event.title}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{event.title}</p>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Calendar className="mr-1 h-3 w-3" />
                    {event.date} at {event.time}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin className="mr-1 h-3 w-3" />
                    {event.location}
                  </div>
                </div>
                <Button size="sm" className="bg-[var(--eco-green-600)] hover:bg-[var(--eco-green-700)]">
                  View
                </Button>
              </div>
            ))}
            <Button 
              variant="outline" 
              className="w-full mt-4 border-[var(--eco-green-200)] hover:bg-[var(--eco-green-50)]"
              onClick={() => setCurrentView('discover')}
            >
              Discover More Events
            </Button>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5 text-[var(--eco-green-600)]" />
              Recent Badges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentBadges.map((badge, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-[var(--eco-green-50)] rounded-lg">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg">
                  {badge.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">Earned {badge.earned}</p>
                </div>
                <Badge variant="secondary" className="bg-[var(--eco-green-100)] text-[var(--eco-green-700)]">
                  New
                </Badge>
              </div>
            ))}
            <Button 
              variant="outline" 
              className="w-full mt-4 border-[var(--eco-green-200)] hover:bg-[var(--eco-green-50)]"
              onClick={() => setCurrentView('badges')}
            >
              View All Badges
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5 text-[var(--eco-green-600)]" />
            Recent Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start space-x-3 p-3 hover:bg-[var(--eco-green-50)] rounded-lg transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-[var(--eco-green-100)] text-[var(--eco-green-700)]">
                    {notification.type === 'event' ? '📅' : notification.type === 'achievement' ? '🏆' : '⏰'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}