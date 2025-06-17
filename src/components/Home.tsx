
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dumbbell, 
  UtensilsCrossed, 
  Star, 
  Calendar,
  TrendingUp,
  Clock,
  Target,
  ChevronRight,
  Activity
} from 'lucide-react';

interface HomeProps {
  onNavigate: (tab: string) => void;
}

export const Home = ({ onNavigate }: HomeProps) => {
  const [todayCalories, setTodayCalories] = useState(0);
  const [todayWorkouts, setTodayWorkouts] = useState(0);
  const [upcomingSchedules, setUpcomingSchedules] = useState<any[]>([]);

  useEffect(() => {
    // Get today's calories from meals
    const savedMeals = localStorage.getItem('fittrack-meals');
    if (savedMeals) {
      const meals = JSON.parse(savedMeals);
      const today = new Date().toISOString().split('T')[0];
      const todayMeals = meals.filter((meal: any) => meal.date === today);
      const calories = todayMeals.reduce((total: number, meal: any) => total + meal.calories, 0);
      setTodayCalories(calories);
    }

    // Get today's completed workouts
    const savedWorkouts = localStorage.getItem('fittrack-workouts');
    if (savedWorkouts) {
      const workouts = JSON.parse(savedWorkouts);
      const today = new Date().toISOString().split('T')[0];
      const todayCompleted = workouts.filter((workout: any) => 
        workout.completed && workout.date === today
      );
      setTodayWorkouts(todayCompleted.length);
    }

    // Get upcoming schedules
    const savedSchedules = localStorage.getItem('fittrack-schedules');
    if (savedSchedules) {
      const schedules = JSON.parse(savedSchedules);
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      
      const upcoming = schedules.filter((schedule: any) => {
        const scheduleDate = new Date(schedule.date);
        return scheduleDate >= today && scheduleDate <= nextWeek;
      }).slice(0, 3);
      
      setUpcomingSchedules(upcoming);
    }
  }, []);

  const quickActions = [
    {
      title: 'Start Workout',
      description: 'Track your exercise session',
      icon: Dumbbell,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
      action: () => onNavigate('workouts')
    },
    {
      title: 'Log Meal',
      description: 'Record your nutrition',
      icon: UtensilsCrossed,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
      action: () => onNavigate('meals')
    },
    {
      title: 'View Favorites',
      description: 'Your saved items',
      icon: Star,
      color: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
      hoverColor: 'hover:from-yellow-600 hover:to-yellow-700',
      action: () => onNavigate('favorites')
    },
    {
      title: 'Schedule',
      description: 'Plan your training',
      icon: Calendar,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700',
      action: () => onNavigate('schedule')
    }
  ];

  const stats = [
    {
      title: 'Today\'s Calories',
      value: todayCalories.toLocaleString(),
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950'
    },
    {
      title: 'Workouts Done',
      value: todayWorkouts.toString(),
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950'
    }
  ];

  return (
    <div className="space-y-6 pb-8 px-2 sm:px-0">
      {/* Welcome Section */}
      <div className="text-center py-6 sm:py-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-shift">
          Welcome to FitTrack
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          Your fitness journey starts here
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="spotify-card overflow-hidden border-0 shadow-lg">
            <CardContent className="spotify-card-content p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-2 sm:p-3 rounded-full ${stat.bgColor} self-end sm:self-center transition-all duration-300 group-hover:scale-110`}>
                  <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="spotify-card border-0 shadow-lg">
        <CardHeader className="spotify-card-content pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="spotify-card-content pt-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                className="h-auto p-4 sm:p-6 flex flex-col items-center gap-2 sm:gap-3 hover:scale-105 transition-all duration-300 border border-border hover:border-primary/20 hover:bg-accent/5 group"
                onClick={action.action}
              >
                <div className={`p-3 sm:p-4 rounded-full ${action.color} ${action.hoverColor} text-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                  <action.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-xs sm:text-sm mb-1">{action.title}</p>
                  <p className="text-xs text-muted-foreground hidden sm:block">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Schedules */}
      {upcomingSchedules.length > 0 && (
        <Card className="spotify-card border-0 shadow-lg">
          <CardHeader className="spotify-card-content pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
              Upcoming Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="spotify-card-content pt-0">
            <div className="space-y-3">
              {upcomingSchedules.map((schedule, index) => (
                <div key={index} className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm sm:text-base">{schedule.workout}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {new Date(schedule.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">Scheduled</Badge>
                </div>
              ))}
              
              <Button
                variant="ghost"
                className="w-full justify-between text-sm hover:scale-105 transition-all duration-300"
                onClick={() => onNavigate('schedule')}
              >
                View all schedules
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity Placeholder */}
      <Card className="spotify-card border-0 shadow-lg">
        <CardHeader className="spotify-card-content pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
            Keep Going!
          </CardTitle>
        </CardHeader>
        <CardContent className="spotify-card-content pt-0">
          <div className="text-center py-6 sm:py-8">
            <div className="bg-gradient-to-br from-primary/10 to-blue-600/10 rounded-full p-4 sm:p-6 w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 flex items-center justify-center hover:scale-110 transition-all duration-300">
              <Target className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              Start tracking your fitness journey today
            </p>
            <Button onClick={() => onNavigate('workouts')} className="btn-primary text-sm sm:text-base">
              Begin Your First Workout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
