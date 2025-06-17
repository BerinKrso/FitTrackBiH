
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
      action: () => onNavigate('workouts')
    },
    {
      title: 'Log Meal',
      description: 'Record your nutrition',
      icon: UtensilsCrossed,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      action: () => onNavigate('meals')
    },
    {
      title: 'View Favorites',
      description: 'Your saved items',
      icon: Star,
      color: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
      action: () => onNavigate('favorites')
    },
    {
      title: 'Schedule',
      description: 'Plan your training',
      icon: Calendar,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
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
    <div className="space-y-8 pb-8">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Welcome to FitTrack
        </h1>
        <p className="text-muted-foreground text-lg">
          Your fitness journey starts here
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                className="h-auto p-6 flex flex-col items-center gap-3 hover:scale-105 transition-all duration-300 border border-border hover:border-primary/20"
                onClick={action.action}
              >
                <div className={`p-4 rounded-full ${action.color} text-white`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <p className="font-semibold mb-1">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Schedules */}
      {upcomingSchedules.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingSchedules.map((schedule, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{schedule.workout}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(schedule.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">Scheduled</Badge>
                </div>
              ))}
              
              <Button
                variant="ghost"
                className="w-full justify-between"
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
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Keep Going!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="bg-gradient-to-br from-primary/10 to-blue-600/10 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <p className="text-muted-foreground mb-4">
              Start tracking your fitness journey today
            </p>
            <Button onClick={() => onNavigate('workouts')} className="btn-primary">
              Begin Your First Workout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
