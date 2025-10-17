import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { EventDiscovery } from './components/EventDiscovery';
import { EventDetail } from './components/EventDetail';
import { UserProfile } from './components/UserProfile';
import { OrganizerConsole } from './components/OrganizerConsole';
import { AgencyDashboard } from './components/AgencyDashboard';
import { BadgesScreen } from './components/BadgesScreen';
import { AuthModal } from './components/AuthModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Loader2, LogOut } from 'lucide-react';

function AppContent() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // Update user role based on authenticated user
  const userRole = user?.role || 'citizen';

  // Handle logout with loading state
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Skip to main content button for accessibility
  const skipToMain = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard setCurrentView={setCurrentView} />;
      case 'discover':
        return (
          <EventDiscovery 
            setCurrentView={setCurrentView} 
            setSelectedEvent={setSelectedEvent}
          />
        );
      case 'event-detail':
        return (
          <EventDetail 
            event={selectedEvent} 
            setCurrentView={setCurrentView}
          />
        );
      case 'profile':
        return <UserProfile userRole={userRole} />;
      case 'badges':
        return <BadgesScreen />;
      case 'organizer':
        return <OrganizerConsole />;
      case 'agency':
        return <AgencyDashboard />;
      default:
        return <Dashboard setCurrentView={setCurrentView} />;
    }
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--eco-green-50)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[var(--eco-green-600)]" />
          <p className="text-[var(--eco-green-700)]">Loading EcoConnect Sphere...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--eco-green-50)] font-sans">
      {/* Skip to main content button for accessibility */}
      <button
        onClick={skipToMain}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[var(--eco-green-600)] text-white px-4 py-2 rounded-lg z-50"
      >
        Skip to main content
      </button>

      {/* Authentication Button */}
      <div className="fixed top-4 right-4 z-40 bg-white rounded-lg shadow-lg p-2">
        {isAuthenticated ? (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-[var(--eco-green-700)]">
              Welcome, {user?.name}
            </span>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center space-x-1 text-xs bg-[var(--eco-green-600)] text-white px-3 py-1 rounded hover:bg-[var(--eco-green-700)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <LogOut className="h-3 w-3" />
              )}
              <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="text-xs bg-[var(--eco-green-600)] text-white px-3 py-1 rounded hover:bg-[var(--eco-green-700)]"
          >
            Login / Register
          </button>
        )}
      </div>

      <div className="flex h-screen">
        {/* Navigation */}
        <Navigation 
          currentView={currentView} 
          setCurrentView={setCurrentView}
          userRole={userRole}
        />

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          <main 
            id="main-content"
            className="h-full overflow-y-auto"
            tabIndex={-1}
          >
            <div className="p-6 lg:p-8">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}