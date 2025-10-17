import { useState } from 'react';
import { MapPin, Calendar, Users, Share2, Heart, ChevronLeft, QrCode, AlertTriangle, Accessibility } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface EventDetailProps {
  event?: any;
  setCurrentView: (view: string) => void;
}

export function EventDetail({ event, setCurrentView }: EventDetailProps) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isWaitlisted, setIsWaitlisted] = useState(false);

  // Default event data if none provided
  const defaultEvent = {
    id: 1,
    title: "Community Beach Cleanup",
    date: "2024-10-15",
    time: "9:00 AM - 12:00 PM",
    location: "Sunset Beach",
    address: "1234 Ocean Drive, Sunset Beach, CA 90210",
    organizer: "Green Ocean Initiative",
    organizerAvatar: "",
    participants: 45,
    capacity: 50,
    waitlist: 5,
    category: "cleanup",
    image: "https://images.unsplash.com/photo-1758599668932-484f54cdf48f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBjbGVhbnVwJTIwZW52aXJvbm1lbnR8ZW58MXx8fHwxNzU5NDc0NDAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Join us for a community beach cleanup to protect our marine environment. We'll provide all necessary equipment including gloves, trash bags, and picker tools. This is a family-friendly event suitable for all ages.",
    requirements: [
      "Wear comfortable clothing and closed-toe shoes",
      "Bring water and sun protection",
      "Participants under 16 must be accompanied by an adult"
    ],
    accessibility: ["wheelchair-accessible", "public-transport"],
    safetyNotes: [
      "First aid station will be available on-site",
      "Event may be cancelled in case of severe weather",
      "Please inform organizers of any medical conditions"
    ],
    tags: ["beach", "plastic", "ocean-conservation"],
    equipment: ["Provided: gloves, trash bags, picker tools", "Bring: water bottle, sun hat"],
    schedule: [
      { time: "9:00 AM", activity: "Registration and check-in" },
      { time: "9:15 AM", activity: "Safety briefing and group assignments" },
      { time: "9:30 AM", activity: "Beach cleanup begins" },
      { time: "11:30 AM", activity: "Cleanup wrap-up and waste sorting" },
      { time: "12:00 PM", activity: "Community celebration and group photo" }
    ]
  };

  const eventData = event || defaultEvent;
  const spotsAvailable = eventData.capacity - eventData.participants;

  const handleRegistration = () => {
    if (spotsAvailable > 0) {
      setIsRegistered(true);
    } else {
      setIsWaitlisted(true);
    }
  };

  const QRCodeModal = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-[var(--eco-green-200)] hover:bg-[var(--eco-green-50)]">
          <QrCode className="h-4 w-4 mr-2" />
          Check-in QR
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Event Check-in</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-48 h-48 bg-[var(--eco-green-50)] border-2 border-dashed border-[var(--eco-green-300)] rounded-lg flex items-center justify-center">
            <div className="text-center">
              <QrCode className="h-16 w-16 text-[var(--eco-green-600)] mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">QR Code would appear here</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm">Show this QR code to event organizers for check-in</p>
            <p className="text-xs text-muted-foreground mt-1">Code: ECO-{eventData.id}-{new Date().getTime().toString().slice(-6)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => setCurrentView('discover')}
        className="hover:bg-[var(--eco-green-50)]"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back to Events
      </Button>

      {/* Event Header */}
      <div className="relative">
        <ImageWithFallback
          src={eventData.image}
          alt={eventData.title}
          className="w-full h-64 sm:h-80 object-cover rounded-xl"
        />
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Info */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="secondary" className="bg-[var(--eco-green-100)] text-[var(--eco-green-700)]">
                {eventData.category.replace('-', ' ')}
              </Badge>
              {eventData.accessibility.map((feature: string) => (
                <Badge key={feature} variant="secondary" className="bg-blue-50 text-blue-700">
                  <Accessibility className="h-3 w-3 mr-1" />
                  {feature.replace('-', ' ')}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl mb-2">{eventData.title}</h1>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                {new Date(eventData.date).toLocaleDateString()} • {eventData.time}
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                {eventData.location}
              </div>
            </div>
          </div>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>About This Event</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{eventData.description}</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2">What to Bring & Wear</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {eventData.requirements?.map((req: string, index: number) => (
                      <li key={index}>• {req}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-2">Equipment</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {eventData.equipment?.map((item: string, index: number) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Event Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {eventData.schedule?.map((item: any, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="text-sm bg-[var(--eco-green-100)] text-[var(--eco-green-700)] px-2 py-1 rounded">
                      {item.time}
                    </div>
                    <p className="text-sm flex-1">{item.activity}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Safety Information */}
          {eventData.safetyNotes && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <strong>Safety Information:</strong>
                  {eventData.safetyNotes.map((note: string, index: number) => (
                    <div key={index}>• {note}</div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Map */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-3">
                <p className="text-sm">{eventData.address}</p>
              </div>
              <div className="w-full h-48 bg-[var(--eco-green-50)] border border-[var(--eco-green-200)] rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-[var(--eco-green-600)] mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Interactive map would appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Registration Card */}
          <Card>
            <CardHeader>
              <CardTitle>Registration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Participants:</span>
                <span>{eventData.participants}/{eventData.capacity}</span>
              </div>
              
              {spotsAvailable > 0 ? (
                <div className="text-sm text-[var(--eco-green-600)]">
                  {spotsAvailable} spots available
                </div>
              ) : (
                <div className="text-sm text-orange-600">
                  Full • {eventData.waitlist} on waitlist
                </div>
              )}

              <Separator />

              {isRegistered ? (
                <div className="space-y-3">
                  <div className="text-center p-3 bg-[var(--eco-green-50)] rounded-lg">
                    <p className="text-sm text-[var(--eco-green-700)]">✓ You're registered!</p>
                  </div>
                  <QRCodeModal />
                  <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
                    Cancel Registration
                  </Button>
                </div>
              ) : isWaitlisted ? (
                <div className="space-y-3">
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-700">You're on the waitlist</p>
                  </div>
                  <Button variant="outline" className="w-full border-orange-200 text-orange-600 hover:bg-orange-50">
                    Leave Waitlist
                  </Button>
                </div>
              ) : (
                <Button 
                  className="w-full bg-[var(--eco-green-600)] hover:bg-[var(--eco-green-700)]"
                  onClick={handleRegistration}
                >
                  {spotsAvailable > 0 ? 'Register Now' : 'Join Waitlist'}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Organizer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Organizer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3 mb-4">
                <Avatar>
                  <AvatarImage src={eventData.organizerAvatar} />
                  <AvatarFallback className="bg-[var(--eco-green-100)] text-[var(--eco-green-700)]">
                    {eventData.organizer.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p>{eventData.organizer}</p>
                  <p className="text-sm text-muted-foreground">Event Organizer</p>
                </div>
              </div>
              <Button variant="outline" className="w-full border-[var(--eco-green-200)] hover:bg-[var(--eco-green-50)]">
                View Profile
              </Button>
            </CardContent>
          </Card>

          {/* Event Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {eventData.tags?.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="border-[var(--eco-green-200)]">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}