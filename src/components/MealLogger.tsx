
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, Star, Plus, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface Meal {
  id: string;
  mealName: string;
  calories: number;
  date: string;
  time: string;
  favorite: boolean;
  createdAt: string;
}

export const MealLogger = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [formData, setFormData] = useState({
    mealName: '',
    calories: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
  });
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('fittrack-meals');
    if (saved) {
      setMeals(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fittrack-meals', JSON.stringify(meals));
  }, [meals]);

  const getTodayCalories = () => {
    const today = new Date().toISOString().split('T')[0];
    return meals
      .filter(meal => meal.date === today)
      .reduce((total, meal) => total + meal.calories, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.mealName.trim()) {
      toast({
        title: "Please enter a meal name",
        variant: "destructive",
      });
      return;
    }

    const newMeal: Meal = {
      id: Date.now().toString(),
      mealName: formData.mealName.trim(),
      calories: parseInt(formData.calories) || 0,
      date: formData.date,
      time: formData.time,
      favorite: false,
      createdAt: new Date().toISOString()
    };

    setMeals(prev => [newMeal, ...prev]);
    setFormData(prev => ({
      ...prev,
      mealName: '',
      calories: ''
    }));

    toast({
      title: "Meal logged successfully!",
      description: `${newMeal.mealName} (${newMeal.calories} cal) has been added to your meal log.`,
    });
  };

  const toggleFavorite = (id: string) => {
    setMeals(prev => prev.map(meal => 
      meal.id === id 
        ? { ...meal, favorite: !meal.favorite }
        : meal
    ));

    const meal = meals.find(m => m.id === id);
    if (meal) {
      toast({
        title: meal.favorite ? "Removed from favorites" : "Added to favorites",
        description: `${meal.mealName} ${meal.favorite ? 'removed from' : 'added to'} your favorites.`,
      });
    }
  };

  const deleteMeal = (id: string) => {
    const meal = meals.find(m => m.id === id);
    setMeals(prev => prev.filter(meal => meal.id !== id));
    
    if (meal) {
      toast({
        title: "Meal deleted",
        description: `${meal.mealName} has been removed from your meal log.`,
      });
    }
  };

  const todayCalories = getTodayCalories();

  return (
    <div className="space-y-6">
      {/* Daily Calorie Summary */}
      <Card className="animate-scale-in bg-gradient-to-r from-fittrack-blue/10 to-fittrack-green/10">
        <CardContent className="p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Today's Calories</h2>
            <div className="text-4xl font-bold text-fittrack-blue mb-2">
              {todayCalories.toLocaleString()}
            </div>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Add Meal Form */}
      <Card className="animate-scale-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Log New Meal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label htmlFor="mealName">Meal Name *</Label>
                <Input
                  id="mealName"
                  value={formData.mealName}
                  onChange={(e) => setFormData(prev => ({ ...prev, mealName: e.target.value }))}
                  placeholder="e.g., Grilled Chicken Salad"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="calories">Calories *</Label>
                <Input
                  id="calories"
                  type="number"
                  min="0"
                  value={formData.calories}
                  onChange={(e) => setFormData(prev => ({ ...prev, calories: e.target.value }))}
                  placeholder="350"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              
              <div className="sm:col-span-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Log Meal
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Meals List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Meals ({meals.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {meals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No meals logged yet. Start tracking your nutrition above!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {meals.map((meal) => (
                <Card key={meal.id} className="card-hover">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{meal.mealName}</h3>
                          {meal.favorite && (
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-2">
                          <Badge variant="outline" className="font-medium">
                            {meal.calories} calories
                          </Badge>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(meal.date).toLocaleDateString()}
                          </span>
                          <span>{meal.time}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFavorite(meal.id)}
                          className="h-8 w-8"
                          aria-label={meal.favorite ? "Remove from favorites" : "Add to favorites"}
                        >
                          <Star className={`h-4 w-4 ${meal.favorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMeal(meal.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          aria-label="Delete meal"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
