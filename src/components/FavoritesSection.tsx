
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Trash2, Heart, Utensils, Dumbbell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Workout } from './WorkoutTracker';
import { Meal } from './MealLogger';

export const FavoritesSection = () => {
  const [favoriteWorkouts, setFavoriteWorkouts] = useState<Workout[]>([]);
  const [favoriteMeals, setFavoriteMeals] = useState<Meal[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load workouts and filter favorites
    const savedWorkouts = localStorage.getItem('fittrack-workouts');
    if (savedWorkouts) {
      const workouts = JSON.parse(savedWorkouts);
      setFavoriteWorkouts(workouts.filter((w: Workout) => w.favorite));
    }

    // Load meals and filter favorites
    const savedMeals = localStorage.getItem('fittrack-meals');
    if (savedMeals) {
      const meals = JSON.parse(savedMeals);
      setFavoriteMeals(meals.filter((m: Meal) => m.favorite));
    }
  }, []);

  // Listen for storage changes to update favorites in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      const savedWorkouts = localStorage.getItem('fittrack-workouts');
      if (savedWorkouts) {
        const workouts = JSON.parse(savedWorkouts);
        setFavoriteWorkouts(workouts.filter((w: Workout) => w.favorite));
      }

      const savedMeals = localStorage.getItem('fittrack-meals');
      if (savedMeals) {
        const meals = JSON.parse(savedMeals);
        setFavoriteMeals(meals.filter((m: Meal) => m.favorite));
      }
    };

    // Set up polling to check for changes
    const interval = setInterval(handleStorageChange, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const removeFavoriteWorkout = (id: string) => {
    const savedWorkouts = localStorage.getItem('fittrack-workouts');
    if (savedWorkouts) {
      const workouts = JSON.parse(savedWorkouts);
      const updatedWorkouts = workouts.map((w: Workout) =>
        w.id === id ? { ...w, favorite: false } : w
      );
      localStorage.setItem('fittrack-workouts', JSON.stringify(updatedWorkouts));
      setFavoriteWorkouts(updatedWorkouts.filter((w: Workout) => w.favorite));
      
      const workout = workouts.find((w: Workout) => w.id === id);
      if (workout) {
        toast({
          title: "Removed from favorites",
          description: `${workout.exerciseName} has been removed from your favorites.`,
        });
      }
    }
  };

  const removeFavoriteMeal = (id: string) => {
    const savedMeals = localStorage.getItem('fittrack-meals');
    if (savedMeals) {
      const meals = JSON.parse(savedMeals);
      const updatedMeals = meals.map((m: Meal) =>
        m.id === id ? { ...m, favorite: false } : m
      );
      localStorage.setItem('fittrack-meals', JSON.stringify(updatedMeals));
      setFavoriteMeals(updatedMeals.filter((m: Meal) => m.favorite));
      
      const meal = meals.find((m: Meal) => m.id === id);
      if (meal) {
        toast({
          title: "Removed from favorites",
          description: `${meal.mealName} has been removed from your favorites.`,
        });
      }
    }
  };

  const totalFavorites = favoriteWorkouts.length + favoriteMeals.length;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="animate-scale-in bg-gradient-to-r from-pink-100 to-red-100 dark:from-pink-900/20 dark:to-red-900/20">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="h-6 w-6 text-red-500" />
              <h2 className="text-2xl font-bold">Your Favorites</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Quick access to your most loved workouts and meals
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Dumbbell className="h-4 w-4 text-fittrack-blue" />
                <span>{favoriteWorkouts.length} workouts</span>
              </div>
              <div className="flex items-center gap-1">
                <Utensils className="h-4 w-4 text-fittrack-green" />
                <span>{favoriteMeals.length} meals</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {totalFavorites === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground">
              Start adding workouts and meals to your favorites by clicking the star icon!
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="workouts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="workouts" className="flex items-center gap-2">
              <Dumbbell className="h-4 w-4" />
              Workouts ({favoriteWorkouts.length})
            </TabsTrigger>
            <TabsTrigger value="meals" className="flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              Meals ({favoriteMeals.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workouts" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  Favorite Workouts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favoriteWorkouts.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No favorite workouts yet. Add some from the Workouts tab!</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {favoriteWorkouts.map((workout) => (
                      <Card key={workout.id} className="card-hover">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg">{workout.exerciseName}</h3>
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                {workout.completed && (
                                  <Badge variant="secondary" className="bg-fittrack-green text-white">
                                    Completed
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-muted-foreground">
                                {workout.sets > 0 && <span>Sets: {workout.sets}</span>}
                                {workout.reps > 0 && <span>Reps: {workout.reps}</span>}
                                {workout.weight > 0 && <span>Weight: {workout.weight}kg</span>}
                                {workout.duration > 0 && <span>Duration: {workout.duration}min</span>}
                              </div>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFavoriteWorkout(workout.id)}
                              className="h-8 w-8 text-destructive hover:text-destructive ml-4"
                              aria-label="Remove from favorites"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meals" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  Favorite Meals
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favoriteMeals.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No favorite meals yet. Add some from the Meals tab!</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {favoriteMeals.map((meal) => (
                      <Card key={meal.id} className="card-hover">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg">{meal.mealName}</h3>
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              </div>
                              
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <Badge variant="outline" className="font-medium">
                                  {meal.calories} calories
                                </Badge>
                                <span>{new Date(meal.date).toLocaleDateString()}</span>
                                <span>{meal.time}</span>
                              </div>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFavoriteMeal(meal.id)}
                              className="h-8 w-8 text-destructive hover:text-destructive ml-4"
                              aria-label="Remove from favorites"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
