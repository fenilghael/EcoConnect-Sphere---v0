import { useState } from 'react';
import { MapPin, Calendar, Users, Filter, Map, List, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from './ui/sheet';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface EventDiscoveryProps {
  setCurrentView: (view: string) => void;
  setSelectedEvent?: (event: any) => void;
}

export function EventDiscovery({ setCurrentView, setSelectedEvent }: EventDiscoveryProps) {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');

  const events = [
    {
      id: 1,
      title: "Community Beach Cleanup",
      date: "2024-10-15",
      time: "9:00 AM - 12:00 PM",
      location: "Sunset Beach",
      organizer: "Green Ocean Initiative",
      participants: 45,
      capacity: 50,
      category: "cleanup",
      image: "https://images.unsplash.com/photo-1758599668932-484f54cdf48f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBjbGVhbnVwJTIwZW52aXJvbm1lbnR8ZW58MXx8fHwxNzU5NDc0NDAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      distance: "2.5 km",
      accessibility: ["wheelchair-accessible", "public-transport"],
      tags: ["beach", "plastic", "ocean-conservation"]
    },
    {
      id: 2,
      title: "Urban Tree Planting",
      date: "2024-10-18",
      time: "8:00 AM - 11:00 AM",
      location: "Central Park",
      organizer: "City Green Team",
      participants: 28,
      capacity: 30,
      category: "tree-planting",
      image: "https://images.unsplash.com/photo-1633975531445-94aa5f8d5a26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVlJTIwcGxhbnRpbmclMjB2b2x1bnRlZXJzfGVufDF8fHx8MTc1OTQwMzI4MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      distance: "1.2 km",
      accessibility: ["wheelchair-accessible"],
      tags: ["trees", "air-quality", "urban-forestry"]
    },
    {
      id: 3,
      title: "Repair Café Workshop",
      date: "2024-10-20",
      time: "2:00 PM - 6:00 PM",
      location: "Community Center",
      organizer: "Fix-It Collective",
      participants: 15,
      capacity: 20,
      category: "repair",
      image: "https://images.unsplash.com/photo-1677742331762-4bdcff04ddfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXBhaXIlMjBjYWZlJTIwc3VzdGFpbmFiaWxpdHl8ZW58MXx8fHwxNzU5NDc0NDA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      distance: "3.1 km",
      accessibility: ["wheelchair-accessible", "sign-language"],
      tags: ["repair", "electronics", "sustainability"]
    },
    {
      id: 4,
      title: "E-Waste Collection Drive",
      date: "2024-10-22",
      time: "10:00 AM - 4:00 PM",
      location: "School Parking Lot",
      organizer: "TechRecycle",
      participants: 12,
      capacity: 25,
      category: "e-waste",
      image: "https://images.unsplash.com/photo-1637681262973-a516e647e826?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXN0ZSUyMGNvbGxlY3Rpb24lMjByZWN5Y2xpbmd8ZW58MXx8fHwxNzU5NDc0NDA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      distance: "4.2 km",
      accessibility: ["wheelchair-accessible"],
      tags: ["electronics", "recycling", "technology"]
    }
  ];

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3">Category</h3>
        <div className="space-y-2">
          {['cleanup', 'tree-planting', 'repair', 'e-waste'].map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox id={category} />
              <label htmlFor={category} className="text-sm capitalize">
                {category.replace('-', ' ')}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3">Distance</h3>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select distance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1km">Within 1 km</SelectItem>
            <SelectItem value="5km">Within 5 km</SelectItem>
            <SelectItem value="10km">Within 10 km</SelectItem>
            <SelectItem value="any">Any distance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="mb-3">Date Range</h3>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This week</SelectItem>
            <SelectItem value="month">This month</SelectItem>
            <SelectItem value="future">Anytime</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="mb-3">Accessibility</h3>
        <div className="space-y-2">
          {['wheelchair-accessible', 'public-transport', 'sign-language'].map((accessibility) => (
            <div key={accessibility} className="flex items-center space-x-2">
              <Checkbox id={accessibility} />
              <label htmlFor={accessibility} className="text-sm capitalize">
                {accessibility.replace('-', ' ')}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const handleEventClick = (event: any) => {
    if (setSelectedEvent) {
      setSelectedEvent(event);
      setCurrentView('event-detail');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl">Discover Events</h1>
          <p className="text-muted-foreground">Find sustainability initiatives in your community</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'bg-[var(--eco-green-600)] hover:bg-[var(--eco-green-700)]' : ''}
          >
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('map')}
            className={viewMode === 'map' ? 'bg-[var(--eco-green-600)] hover:bg-[var(--eco-green-700)]' : ''}
          >
            <Map className="h-4 w-4 mr-2" />
            Map
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="border-[var(--eco-green-200)] hover:bg-[var(--eco-green-50)]">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Events</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterPanel />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Content */}
      <div className="flex gap-6">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block w-64 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-5 w-5 text-[var(--eco-green-600)]" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FilterPanel />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {viewMode === 'map' ? (
            <Card className="h-96">
              <CardContent className="p-0 h-full">
                <div className="w-full h-full bg-[var(--eco-green-50)] rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Map className="h-16 w-16 text-[var(--eco-green-600)] mx-auto mb-4" />
                    <h3 className="text-lg mb-2">Interactive Map View</h3>
                    <p className="text-muted-foreground">Map integration would show event locations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <Card key={event.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleEventClick(event)}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <ImageWithFallback
                        src={event.image}
                        alt={event.title}
                        className="w-full sm:w-32 h-32 object-cover rounded-lg"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="text-lg">{event.title}</h3>
                            <p className="text-sm text-muted-foreground">by {event.organizer}</p>
                          </div>
                          <Badge variant="secondary" className="w-fit bg-[var(--eco-green-100)] text-[var(--eco-green-700)]">
                            {event.category.replace('-', ' ')}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4" />
                            {new Date(event.date).toLocaleDateString()} • {event.time}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="mr-1 h-4 w-4" />
                            {event.location} • {event.distance}
                          </div>
                          <div className="flex items-center">
                            <Users className="mr-1 h-4 w-4" />
                            {event.participants}/{event.capacity} participants
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {event.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs border-[var(--eco-green-200)]">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {event.accessibility.map((feature) => (
                            <Badge key={feature} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                              ♿ {feature.replace('-', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}