
import { useState, useEffect } from 'react';
import { LoginModal } from '@/components/LoginModal';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Home, LogOut, User } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { WorkoutTracker } from '@/components/WorkoutTracker';
import { MealLogger } from '@/components/MealLogger';
import { FavoritesSection } from '@/components/FavoritesSection';
import { TrainingSchedule } from '@/components/TrainingSchedule';
import { Home as HomePage } from '@/components/Home';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const { user, logout, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('fittrack-dark-mode');
    const isDark = saved === 'true';
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('fittrack-dark-mode', newMode.toString());
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast({
      title: `Switched to ${newMode ? 'dark' : 'light'} mode`,
      duration: 2000,
    });
  };

  const handleLogout = () => {
    logout();
    setActiveTab('home');
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  const navigateToTab = (tab: string) => {
    setActiveTab(tab);
  };

  // If not authenticated, show the login interface directly
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-background">
        {/* Dark mode toggle - positioned absolutely */}
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="h-9 w-9"
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Main login interface */}
        <div className="flex items-center justify-center min-h-screen p-4">
          <LoginModal isOpen={true} onClose={() => {}} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      {/* Header for authenticated users */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center space-x-4">
              <Button
                variant="ghost"
                className="flex items-center space-x-2 text-xl font-bold text-primary p-0 group"
                onClick={() => setActiveTab('home')}
              >
                <Logo size="md" />
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  FitTrack
                </span>
              </Button>
              <span className="text-sm text-muted-foreground hidden md:inline">
                Your Personal Fitness Companion
              </span>
            </div>
            
            {/* Mobile Layout - Centered */}
            <div className="sm:hidden flex-1 flex justify-center">
              <Button
                variant="ghost"
                className="flex items-center space-x-2 text-lg font-bold text-primary p-0 group"
                onClick={() => setActiveTab('home')}
              >
                <Logo size="sm" />
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  FitTrack
                </span>
              </Button>
            </div>
            
            {/* Right side controls */}
            <div className="flex items-center space-x-2">
              <div className="hidden sm:flex items-center space-x-2 mr-2">
                <User className="h-4 w-4" />
                <span className="text-sm text-muted-foreground">{user?.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-1"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="h-8 w-8 sm:h-9 sm:w-9"
                aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6 sm:mb-8 h-12 sm:h-10 bg-muted/50 backdrop-blur-sm">
            <TabsTrigger 
              value="home" 
              className="text-xs sm:text-sm p-2 sm:p-3"
            >
              <Home className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
              <span className="hidden sm:inline">Home</span>
            </TabsTrigger>
            <TabsTrigger 
              value="workouts" 
              className="text-xs sm:text-sm p-2 sm:p-3"
            >
              <span className="hidden sm:inline">Workouts</span>
              <span className="sm:hidden">Work</span>
            </TabsTrigger>
            <TabsTrigger 
              value="meals" 
              className="text-xs sm:text-sm p-2 sm:p-3"
            >
              Meals
            </TabsTrigger>
            <TabsTrigger 
              value="favorites" 
              className="text-xs sm:text-sm p-2 sm:p-3"
            >
              <span className="hidden sm:inline">Favorites</span>
              <span className="sm:hidden">Fav</span>
            </TabsTrigger>
            <TabsTrigger 
              value="schedule" 
              className="text-xs sm:text-sm p-2 sm:p-3"
            >
              <span className="hidden sm:inline">Schedule</span>
              <span className="sm:hidden">Sched</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home">
            <HomePage onNavigate={navigateToTab} />
          </TabsContent>

          <TabsContent value="workouts">
            <WorkoutTracker />
          </TabsContent>

          <TabsContent value="meals">
            <MealLogger />
          </TabsContent>

          <TabsContent value="favorites">
            <FavoritesSection />
          </TabsContent>

          <TabsContent value="schedule">
            <TrainingSchedule />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
