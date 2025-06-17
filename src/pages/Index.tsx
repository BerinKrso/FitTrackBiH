
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Home } from 'lucide-react';
import { WorkoutTracker } from '@/components/WorkoutTracker';
import { MealLogger } from '@/components/MealLogger';
import { FavoritesSection } from '@/components/FavoritesSection';
import { TrainingSchedule } from '@/components/TrainingSchedule';
import { Home as HomePage } from '@/components/Home';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
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

  const navigateToTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                variant="ghost"
                className="text-xl sm:text-2xl font-bold text-primary hover:bg-transparent p-0"
                onClick={() => setActiveTab('home')}
              >
                FitTrack
              </Button>
              <span className="text-xs sm:text-sm text-muted-foreground hidden md:inline">
                Your Personal Fitness Companion
              </span>
            </div>
            
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
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6 sm:mb-8 h-12 sm:h-10">
            <TabsTrigger value="home" className="text-xs sm:text-sm p-2 sm:p-3">
              <Home className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
              <span className="hidden sm:inline">Home</span>
            </TabsTrigger>
            <TabsTrigger value="workouts" className="text-xs sm:text-sm p-2 sm:p-3">
              <span className="hidden sm:inline">Workouts</span>
              <span className="sm:hidden">Work</span>
            </TabsTrigger>
            <TabsTrigger value="meals" className="text-xs sm:text-sm p-2 sm:p-3">
              Meals
            </TabsTrigger>
            <TabsTrigger value="favorites" className="text-xs sm:text-sm p-2 sm:p-3">
              <span className="hidden sm:inline">Favorites</span>
              <span className="sm:hidden">Fav</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="text-xs sm:text-sm p-2 sm:p-3">
              <span className="hidden sm:inline">Schedule</span>
              <span className="sm:hidden">Sched</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="animate-fade-in">
            <HomePage onNavigate={navigateToTab} />
          </TabsContent>

          <TabsContent value="workouts" className="animate-fade-in">
            <WorkoutTracker />
          </TabsContent>

          <TabsContent value="meals" className="animate-fade-in">
            <MealLogger />
          </TabsContent>

          <TabsContent value="favorites" className="animate-fade-in">
            <FavoritesSection />
          </TabsContent>

          <TabsContent value="schedule" className="animate-fade-in">
            <TrainingSchedule />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
