
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { WorkoutTracker } from '@/components/WorkoutTracker';
import { MealLogger } from '@/components/MealLogger';
import { FavoritesSection } from '@/components/FavoritesSection';
import { TrainingSchedule } from '@/components/TrainingSchedule';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('workouts');
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

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">FitTrack</h1>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Your Personal Fitness Companion
              </span>
            </div>
            
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
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="workouts" className="text-xs sm:text-sm">
              Workouts
            </TabsTrigger>
            <TabsTrigger value="meals" className="text-xs sm:text-sm">
              Meals
            </TabsTrigger>
            <TabsTrigger value="favorites" className="text-xs sm:text-sm">
              Favorites
            </TabsTrigger>
            <TabsTrigger value="schedule" className="text-xs sm:text-sm">
              Schedule
            </TabsTrigger>
          </TabsList>

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
