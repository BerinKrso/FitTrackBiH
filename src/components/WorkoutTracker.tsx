
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Star, Plus, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface Workout {
  id: string;
  exerciseName: string;
  sets: number;
  reps: number;
  weight: number;
  duration: number;
  completed: boolean;
  favorite: boolean;
  createdAt: string;
}

export const WorkoutTracker = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [formData, setFormData] = useState({
    exerciseName: '',
    sets: '',
    reps: '',
    weight: '',
    duration: ''
  });
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('fittrack-workouts');
    if (saved) {
      setWorkouts(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fittrack-workouts', JSON.stringify(workouts));
  }, [workouts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.exerciseName.trim()) {
      toast({
        title: "Please enter an exercise name",
        variant: "destructive",
      });
      return;
    }

    const newWorkout: Workout = {
      id: Date.now().toString(),
      exerciseName: formData.exerciseName.trim(),
      sets: parseInt(formData.sets) || 0,
      reps: parseInt(formData.reps) || 0,
      weight: parseFloat(formData.weight) || 0,
      duration: parseInt(formData.duration) || 0,
      completed: false,
      favorite: false,
      createdAt: new Date().toISOString()
    };

    setWorkouts(prev => [newWorkout, ...prev]);
    setFormData({
      exerciseName: '',
      sets: '',
      reps: '',
      weight: '',
      duration: ''
    });

    toast({
      title: "Workout added successfully!",
      description: `${newWorkout.exerciseName} has been added to your workout list.`,
    });
  };

  const toggleComplete = (id: string) => {
    setWorkouts(prev => prev.map(workout => 
      workout.id === id 
        ? { ...workout, completed: !workout.completed }
        : workout
    ));
    
    const workout = workouts.find(w => w.id === id);
    if (workout) {
      toast({
        title: workout.completed ? "Workout marked as active" : "Workout completed!",
        description: `${workout.exerciseName} ${workout.completed ? 'is now active' : 'has been completed'}.`,
      });
    }
  };

  const toggleFavorite = (id: string) => {
    setWorkouts(prev => prev.map(workout => 
      workout.id === id 
        ? { ...workout, favorite: !workout.favorite }
        : workout
    ));

    const workout = workouts.find(w => w.id === id);
    if (workout) {
      toast({
        title: workout.favorite ? "Removed from favorites" : "Added to favorites",
        description: `${workout.exerciseName} ${workout.favorite ? 'removed from' : 'added to'} your favorites.`,
      });
    }
  };

  const deleteWorkout = (id: string) => {
    const workout = workouts.find(w => w.id === id);
    setWorkouts(prev => prev.filter(workout => workout.id !== id));
    
    if (workout) {
      toast({
        title: "Workout deleted",
        description: `${workout.exerciseName} has been removed from your workout list.`,
      });
    }
  };

  const filteredWorkouts = workouts.filter(workout => {
    if (filter === 'active') return !workout.completed;
    if (filter === 'completed') return workout.completed;
    return true;
  });

  return (
    <div className="space-y-6">
      <Card className="animate-scale-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Workout
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label htmlFor="exerciseName">Exercise Name *</Label>
                <Input
                  id="exerciseName"
                  value={formData.exerciseName}
                  onChange={(e) => setFormData(prev => ({ ...prev, exerciseName: e.target.value }))}
                  placeholder="e.g., Push-ups, Bench Press"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="sets">Sets</Label>
                <Input
                  id="sets"
                  type="number"
                  min="0"
                  value={formData.sets}
                  onChange={(e) => setFormData(prev => ({ ...prev, sets: e.target.value }))}
                  placeholder="3"
                />
              </div>
              
              <div>
                <Label htmlFor="reps">Reps</Label>
                <Input
                  id="reps"
                  type="number"
                  min="0"
                  value={formData.reps}
                  onChange={(e) => setFormData(prev => ({ ...prev, reps: e.target.value }))}
                  placeholder="12"
                />
              </div>
              
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  placeholder="20.5"
                />
              </div>
              
              <div>
                <Label htmlFor="duration">Duration (min)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="0"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="30"
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Workout
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Workouts ({filteredWorkouts.length})</CardTitle>
          <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {filteredWorkouts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No workouts found. Add your first workout above!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredWorkouts.map((workout) => (
                <Card key={workout.id} className={`card-hover ${workout.completed ? 'bg-green-50 dark:bg-green-950/20' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{workout.exerciseName}</h3>
                          {workout.completed && (
                            <Badge variant="secondary" className="bg-fittrack-green text-white">
                              <Check className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                          {workout.favorite && (
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-muted-foreground">
                          {workout.sets > 0 && <span>Sets: {workout.sets}</span>}
                          {workout.reps > 0 && <span>Reps: {workout.reps}</span>}
                          {workout.weight > 0 && <span>Weight: {workout.weight}kg</span>}
                          {workout.duration > 0 && <span>Duration: {workout.duration}min</span>}
                        </div>
                        
                        <p className="text-xs text-muted-foreground mt-2">
                          Added {new Date(workout.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`complete-${workout.id}`}
                            checked={workout.completed}
                            onCheckedChange={() => toggleComplete(workout.id)}
                            aria-label="Mark as complete"
                          />
                          <Label 
                            htmlFor={`complete-${workout.id}`}
                            className="text-sm cursor-pointer"
                          >
                            Complete
                          </Label>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFavorite(workout.id)}
                          className="h-8 w-8"
                          aria-label={workout.favorite ? "Remove from favorites" : "Add to favorites"}
                        >
                          <Star className={`h-4 w-4 ${workout.favorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteWorkout(workout.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          aria-label="Delete workout"
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
