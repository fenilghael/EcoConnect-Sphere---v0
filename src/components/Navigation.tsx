import { Home, MapPin, Calendar, User, Trophy, Settings, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Badge } from './ui/badge';

interface NavigationProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  userRole?: 'citizen' | 'organizer' | 'moderator' | 'sponsor' | 'admin';
}

export function Navigation({ currentView, setCurrentView, userRole = 'citizen' }: NavigationProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'discover', label: 'Discover', icon: MapPin },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'badges', label: 'Badges', icon: Trophy },
  ];

  // Add role-specific items
  if (userRole === 'organizer') {
    navItems.push({ id: 'organizer', label: 'Console', icon: Calendar });
  }
  if (userRole === 'moderator' || userRole === 'admin') {
    navItems.push({ id: 'agency', label: 'Agency', icon: Settings });
  }

  const NavContent = () => (
    <div className="flex flex-col space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.id}
            variant={currentView === item.id ? "default" : "ghost"}
            className={`justify-start ${
              currentView === item.id 
                ? "bg-[var(--eco-green-600)] text-white hover:bg-[var(--eco-green-700)]" 
                : "hover:bg-[var(--eco-green-50)]"
            }`}
            onClick={() => setCurrentView(item.id)}
          >
            <Icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-[var(--eco-green-200)]">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <div className="w-8 h-8 bg-[var(--eco-green-600)] rounded-lg flex items-center justify-center mr-3">
              <span className="text-white">🌍</span>
            </div>
            <h1 className="text-xl">EcoConnect Sphere</h1>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            <NavContent />
          </nav>
          <div className="p-4">
            <div className="bg-[var(--eco-green-50)] rounded-lg p-3">
              <div className="flex items-center">
                <Badge variant="secondary" className="bg-[var(--eco-green-100)] text-[var(--eco-green-700)]">
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <div className="bg-white border-b border-[var(--eco-green-200)] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[var(--eco-green-600)] rounded-lg flex items-center justify-center mr-3">
              <span className="text-white">🌍</span>
            </div>
            <h1 className="text-lg">EcoConnect</h1>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="py-4">
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-[var(--eco-green-600)] rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white">🌍</span>
                    </div>
                    <h1 className="text-xl">EcoConnect Sphere</h1>
                  </div>
                  <Badge variant="secondary" className="bg-[var(--eco-green-100)] text-[var(--eco-green-700)]">
                    {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                  </Badge>
                </div>
                <NavContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
}