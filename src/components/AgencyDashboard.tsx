import { useState } from 'react';
import { Shield, CheckCircle, XCircle, AlertTriangle, BarChart3, Users, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function AgencyDashboard() {
  const [timeRange, setTimeRange] = useState('month');

  const pendingVerifications = [
    {
      id: 1,
      organizer: 'Green Future Collective',
      organizerEmail: 'contact@greenfuture.org',
      event: 'Citywide Tree Planting Initiative',
      submittedDate: '2024-10-01',
      documents: ['Business License', 'Liability Insurance'],
      category: 'tree-planting',
      status: 'pending'
    },
    {
      id: 2,
      organizer: 'Tech4Good',
      organizerEmail: 'hello@tech4good.com',
      event: 'E-Waste Collection Drive',
      submittedDate: '2024-09-28',
      documents: ['Nonprofit Certificate', 'Waste Handling Permit'],
      category: 'e-waste',
      status: 'pending'
    },
    {
      id: 3,
      organizer: 'Community Repair Hub',
      organizerEmail: 'info@repairhub.org',
      event: 'Monthly Repair Café',
      submittedDate: '2024-09-25',
      documents: ['Insurance Policy', 'Safety Protocols'],
      category: 'repair',
      status: 'under-review'
    }
  ];

  const analytics = {
    totalEvents: 156,
    totalParticipants: 3420,
    totalOrganizers: 45,
    verificationRate: 89,
    impactMetrics: {
      wasteCollected: '2.8 tons',
      treesPlanted: 1250,
      itemsRepaired: 892,
      carbonSaved: '15.6 tons',
      communityHours: 8760
    },
    monthlyGrowth: {
      events: 12,
      participants: 18,
      organizers: 8
    }
  };

  const recentEvents = [
    {
      id: 1,
      title: 'Community Beach Cleanup',
      organizer: 'Ocean Guardians',
      date: '2024-10-01',
      participants: 65,
      status: 'completed',
      impact: '85 lbs waste collected',
      category: 'cleanup'
    },
    {
      id: 2,
      title: 'Urban Tree Planting',
      organizer: 'Green City Initiative',
      date: '2024-09-28',
      participants: 42,
      status: 'completed',
      impact: '25 trees planted',
      category: 'tree-planting'
    },
    {
      id: 3,
      title: 'Repair Café Workshop',
      organizer: 'Fix-It Collective',
      date: '2024-09-25',
      participants: 28,
      status: 'completed',
      impact: '15 items repaired',
      category: 'repair'
    }
  ];

  const communityStats = [
    { label: 'Most Active District', value: 'Downtown', change: '+12%' },
    { label: 'Top Event Type', value: 'Cleanup Events', change: '+25%' },
    { label: 'Avg Event Size', value: '35 people', change: '+8%' },
    { label: 'Completion Rate', value: '94%', change: '+3%' }
  ];

  const handleVerification = (id: number, action: 'approve' | 'reject') => {
    console.log(`${action} verification for ID: ${id}`);
    // Handle verification logic here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl">Agency Dashboard</h1>
          <p className="text-muted-foreground">Monitor community sustainability initiatives and verify organizers</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alert for Pending Verifications */}
      {pendingVerifications.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You have {pendingVerifications.length} pending organizer verifications requiring review.
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-2xl">{analytics.totalEvents}</p>
                <p className="text-xs text-[var(--eco-green-600)] mt-1">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +{analytics.monthlyGrowth.events}% this month
                </p>
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
                <p className="text-2xl">{analytics.totalParticipants.toLocaleString()}</p>
                <p className="text-xs text-[var(--eco-green-600)] mt-1">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +{analytics.monthlyGrowth.participants}% this month
                </p>
              </div>
              <Users className="h-8 w-8 text-[var(--eco-green-600)]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Verified Organizers</p>
                <p className="text-2xl">{analytics.totalOrganizers}</p>
                <p className="text-xs text-[var(--eco-green-600)] mt-1">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +{analytics.monthlyGrowth.organizers}% this month
                </p>
              </div>
              <Shield className="h-8 w-8 text-[var(--eco-green-600)]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Verification Rate</p>
                <p className="text-2xl">{analytics.verificationRate}%</p>
                <p className="text-xs text-[var(--eco-green-600)] mt-1">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +2% this month
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-[var(--eco-green-600)]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="verification" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="verification">Verification Queue</TabsTrigger>
          <TabsTrigger value="analytics">Community Analytics</TabsTrigger>
          <TabsTrigger value="events">Event Monitoring</TabsTrigger>
        </TabsList>

        {/* Verification Queue */}
        <TabsContent value="verification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-[var(--eco-green-600)]" />
                Organizer Verification Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingVerifications.map((verification) => (
                  <div key={verification.id} className="border rounded-lg p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-[var(--eco-green-100)] text-[var(--eco-green-700)]">
                              {verification.organizer.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-sm">{verification.organizer}</h3>
                            <p className="text-xs text-muted-foreground">{verification.organizerEmail}</p>
                          </div>
                          <Badge 
                            variant={verification.status === 'pending' ? 'outline' : 'secondary'}
                            className={verification.status === 'pending' ? 'border-orange-300 text-orange-700' : ''}
                          >
                            {verification.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        
                        <div>
                          <p className="text-sm">Event: {verification.event}</p>
                          <p className="text-xs text-muted-foreground">
                            Category: {verification.category.replace('-', ' ')} • 
                            Submitted: {new Date(verification.submittedDate).toLocaleDateString()}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Documents submitted:</p>
                          <div className="flex flex-wrap gap-1">
                            {verification.documents.map((doc, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {doc}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleVerification(verification.id, 'reject')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-[var(--eco-green-600)] hover:bg-[var(--eco-green-700)]"
                          onClick={() => handleVerification(verification.id, 'approve')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Impact Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Community Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-[var(--eco-green-50)] rounded-lg">
                    <div className="text-2xl mb-1">♻️</div>
                    <p className="text-lg">{analytics.impactMetrics.wasteCollected}</p>
                    <p className="text-xs text-muted-foreground">Waste Collected</p>
                  </div>
                  <div className="text-center p-3 bg-[var(--eco-green-50)] rounded-lg">
                    <div className="text-2xl mb-1">🌳</div>
                    <p className="text-lg">{analytics.impactMetrics.treesPlanted}</p>
                    <p className="text-xs text-muted-foreground">Trees Planted</p>
                  </div>
                  <div className="text-center p-3 bg-[var(--eco-green-50)] rounded-lg">
                    <div className="text-2xl mb-1">🔧</div>
                    <p className="text-lg">{analytics.impactMetrics.itemsRepaired}</p>
                    <p className="text-xs text-muted-foreground">Items Repaired</p>
                  </div>
                  <div className="text-center p-3 bg-[var(--eco-green-50)] rounded-lg">
                    <div className="text-2xl mb-1">🌍</div>
                    <p className="text-lg">{analytics.impactMetrics.carbonSaved}</p>
                    <p className="text-xs text-muted-foreground">Carbon Saved</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center">
                  <div className="text-2xl mb-1">⏱️</div>
                  <p className="text-lg">{analytics.impactMetrics.communityHours.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Community Hours</p>
                </div>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Community Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {communityStats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-[var(--eco-green-50)] rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-lg">{stat.value}</p>
                      </div>
                      <Badge variant="secondary" className="bg-[var(--eco-green-100)] text-[var(--eco-green-700)]">
                        {stat.change}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Participation Trends */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Participation Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Cleanup Events</span>
                      <span className="text-sm">45% of total events</span>
                    </div>
                    <Progress value={45} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Tree Planting</span>
                      <span className="text-sm">28% of total events</span>
                    </div>
                    <Progress value={28} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Repair Cafés</span>
                      <span className="text-sm">18% of total events</span>
                    </div>
                    <Progress value={18} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">E-Waste Collection</span>
                      <span className="text-sm">9% of total events</span>
                    </div>
                    <Progress value={9} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Event Monitoring */}
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h3 className="text-sm">{event.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        Organized by {event.organizer} • {new Date(event.date).toLocaleDateString()}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs border-[var(--eco-green-200)]">
                          {event.category.replace('-', ' ')}
                        </Badge>
                        <Badge variant="secondary" className="text-xs bg-[var(--eco-green-100)] text-[var(--eco-green-700)]">
                          {event.participants} participants
                        </Badge>
                      </div>
                      <p className="text-xs text-[var(--eco-green-600)]">{event.impact}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}