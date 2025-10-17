import { useState } from 'react';
import { Plus, Calendar, Users, BarChart3, MessageSquare, Upload, MapPin, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function OrganizerConsole() {
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: '',
    date: '',
    time: '',
    location: '',
    capacity: '',
    description: '',
    requirements: '',
    accessibility: []
  });

  const myEvents = [
    {
      id: 1,
      title: 'Community Beach Cleanup',
      date: '2024-10-15',
      status: 'Active',
      participants: 45,
      capacity: 50,
      category: 'cleanup',
      image: 'https://images.unsplash.com/photo-1758599668932-484f54cdf48f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBjbGVhbnVwJTIwZW52aXJvbm1lbnR8ZW58MXx8fHwxNzU5NDc0NDAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      impactSubmitted: false
    },
    {
      id: 2,
      title: 'Repair Café Workshop',
      date: '2024-09-20',
      status: 'Completed',
      participants: 18,
      capacity: 20,
      category: 'repair',
      image: 'https://images.unsplash.com/photo-1677742331762-4bdcff04ddfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXBhaXIlMjBjYWZlJTIwc3VzdGFpbmFiaWxpdHl8ZW58MXx8fHwxNzU5NDc0NDA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      impactSubmitted: true
    },
    {
      id: 3,
      title: 'Urban Tree Planting',
      date: '2024-10-25',
      status: 'Draft',
      participants: 0,
      capacity: 30,
      category: 'tree-planting',
      image: 'https://images.unsplash.com/photo-1633975531445-94aa5f8d5a26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVlJTIwcGxhbnRpbmclMjB2b2x1bnRlZXJzfGVufDF8fHx8MTc1OTQwMzI4MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      impactSubmitted: false
    }
  ];

  const messages = [
    {
      id: 1,
      from: 'Sarah Johnson',
      event: 'Beach Cleanup',
      message: 'Will there be parking available at the location?',
      time: '2 hours ago',
      replied: false
    },
    {
      id: 2,
      from: 'Mike Chen',
      event: 'Beach Cleanup',
      message: 'Can I bring my 12-year-old daughter?',
      time: '4 hours ago',
      replied: true
    },
    {
      id: 3,
      from: 'Lisa Rodriguez',
      event: 'Repair Café',
      message: 'Thank you for organizing this! It was amazing.',
      time: '1 day ago',
      replied: true
    }
  ];

  const analytics = {
    totalEvents: 8,
    totalParticipants: 156,
    averageRating: 4.8,
    impactMetrics: {
      wasteCollected: '120 lbs',
      treesPlanted: 45,
      itemsRepaired: 67,
      carbonSaved: '2.3 tons'
    }
  };

  const CreateEventForm = () => (
    <Dialog open={showCreateEvent} onOpenChange={setShowCreateEvent}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                placeholder="e.g., Community Beach Cleanup"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={newEvent.category} onValueChange={(value) => setNewEvent({...newEvent, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cleanup">Cleanup</SelectItem>
                  <SelectItem value="tree-planting">Tree Planting</SelectItem>
                  <SelectItem value="repair">Repair Café</SelectItem>
                  <SelectItem value="e-waste">E-Waste Collection</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                placeholder="e.g., 9:00 AM - 12:00 PM"
                value={newEvent.time}
                onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Central Park"
                value={newEvent.location}
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                placeholder="Maximum participants"
                value={newEvent.capacity}
                onChange={(e) => setNewEvent({...newEvent, capacity: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your event, what participants can expect, and any special instructions..."
              rows={4}
              value={newEvent.description}
              onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements & What to Bring</Label>
            <Textarea
              id="requirements"
              placeholder="List any requirements, what participants should wear/bring, age restrictions, etc."
              rows={3}
              value={newEvent.requirements}
              onChange={(e) => setNewEvent({...newEvent, requirements: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>Event Images</Label>
            <div className="border-2 border-dashed border-[var(--eco-green-200)] rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-[var(--eco-green-600)] mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload event images</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Liability Waiver</Label>
            <div className="border-2 border-dashed border-orange-200 rounded-lg p-4 text-center">
              <Upload className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Upload liability waiver (optional)</p>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowCreateEvent(false)}>
              Cancel
            </Button>
            <Button className="bg-[var(--eco-green-600)] hover:bg-[var(--eco-green-700)]">
              Create Event
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl">Organizer Console</h1>
          <p className="text-muted-foreground">Manage your events and engage with participants</p>
        </div>
        <Button 
          onClick={() => setShowCreateEvent(true)}
          className="bg-[var(--eco-green-600)] hover:bg-[var(--eco-green-700)]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-2xl">{analytics.totalEvents}</p>
              </div>
              <Calendar className="h-8 w-8 text-[var(--eco-green-600)]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Participants</p>
                <p className="text-2xl">{analytics.totalParticipants}</p>
              </div>
              <Users className="h-8 w-8 text-[var(--eco-green-600)]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <p className="text-2xl">{analytics.averageRating}⭐</p>
              </div>
              <BarChart3 className="h-8 w-8 text-[var(--eco-green-600)]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unread Messages</p>
                <p className="text-2xl">{messages.filter(m => !m.replied).length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-[var(--eco-green-600)]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="events">My Events</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {myEvents.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-4">
                  <div className="flex space-x-4">
                    <ImageWithFallback
                      src={event.image}
                      alt={event.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="text-sm">{event.title}</h3>
                        <Badge 
                          variant={event.status === 'Active' ? 'default' : event.status === 'Completed' ? 'secondary' : 'outline'}
                          className={event.status === 'Active' ? 'bg-[var(--eco-green-600)]' : ''}
                        >
                          {event.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center text-xs text-muted-foreground space-x-4">
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Users className="mr-1 h-3 w-3" />
                          {event.participants}/{event.capacity}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span>Registration</span>
                          <span>{Math.round((event.participants/event.capacity) * 100)}%</span>
                        </div>
                        <Progress value={(event.participants/event.capacity) * 100} className="h-2" />
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="text-xs">
                          Manage
                        </Button>
                        {event.status === 'Completed' && !event.impactSubmitted && (
                          <Button size="sm" className="text-xs bg-[var(--eco-green-600)] hover:bg-[var(--eco-green-700)]">
                            Submit Impact
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Participants Tab */}
        <TabsContent value="participants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Participant Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-[var(--eco-green-50)] rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-[var(--eco-green-100)] text-[var(--eco-green-700)]">SJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">Sarah Johnson</p>
                      <p className="text-xs text-muted-foreground">Beach Cleanup • Registered</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Message</Button>
                    <Button size="sm" variant="outline">Check-in</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-[var(--eco-green-50)] rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-[var(--eco-green-100)] text-[var(--eco-green-700)]">MC</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">Mike Chen</p>
                      <p className="text-xs text-muted-foreground">Beach Cleanup • Registered</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Message</Button>
                    <Button size="sm" variant="outline">Check-in</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-orange-100 text-orange-700">LR</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">Lisa Rodriguez</p>
                      <p className="text-xs text-muted-foreground">Beach Cleanup • Waitlist</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Move to Active</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Participant Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`p-4 rounded-lg border ${!message.replied ? 'border-orange-200 bg-orange-50' : 'border-gray-200'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm">{message.from}</p>
                        <p className="text-xs text-muted-foreground">{message.event} • {message.time}</p>
                      </div>
                      {!message.replied && (
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                    <p className="text-sm mb-3">{message.message}</p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        Reply
                      </Button>
                      {message.replied && (
                        <Badge variant="secondary" className="text-xs">Replied</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Impact Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-[var(--eco-green-50)] rounded-lg">
                    <div className="text-lg">♻️</div>
                    <p className="text-sm">{analytics.impactMetrics.wasteCollected}</p>
                    <p className="text-xs text-muted-foreground">Waste Collected</p>
                  </div>
                  <div className="text-center p-3 bg-[var(--eco-green-50)] rounded-lg">
                    <div className="text-lg">🌳</div>
                    <p className="text-sm">{analytics.impactMetrics.treesPlanted}</p>
                    <p className="text-xs text-muted-foreground">Trees Planted</p>
                  </div>
                  <div className="text-center p-3 bg-[var(--eco-green-50)] rounded-lg">
                    <div className="text-lg">🔧</div>
                    <p className="text-sm">{analytics.impactMetrics.itemsRepaired}</p>
                    <p className="text-xs text-muted-foreground">Items Repaired</p>
                  </div>
                  <div className="text-center p-3 bg-[var(--eco-green-50)] rounded-lg">
                    <div className="text-lg">🌍</div>
                    <p className="text-sm">{analytics.impactMetrics.carbonSaved}</p>
                    <p className="text-xs text-muted-foreground">Carbon Saved</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Registration Rate</span>
                    <span className="text-sm">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Check-in Rate</span>
                    <span className="text-sm">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Participant Satisfaction</span>
                    <span className="text-sm">4.8/5</span>
                  </div>
                  <Progress value={96} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <CreateEventForm />
    </div>
  );
}