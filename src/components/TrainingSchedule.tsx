
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CalendarIcon, Plus, Trash2, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ScheduledWorkout {
  id: string;
  date: string;
  workoutName: string;
  notes?: string;
  createdAt: string;
}

export const TrainingSchedule = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [scheduledWorkouts, setScheduledWorkouts] = useState<ScheduledWorkout[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    workoutName: '',
    notes: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('fittrack-schedule');
    if (saved) {
      setScheduledWorkouts(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fittrack-schedule', JSON.stringify(scheduledWorkouts));
  }, [scheduledWorkouts]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.workoutName.trim() || !selectedDate) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newScheduledWorkout: ScheduledWorkout = {
      id: Date.now().toString(),
      date: selectedDate.toISOString().split('T')[0],
      workoutName: formData.workoutName.trim(),
      notes: formData.notes.trim(),
      createdAt: new Date().toISOString()
    };

    setScheduledWorkouts(prev => [...prev, newScheduledWorkout]);
    setFormData({ workoutName: '', notes: '' });
    setIsDialogOpen(false);

    toast({
      title: "Workout scheduled!",
      description: `${newScheduledWorkout.workoutName} has been scheduled for ${selectedDate.toLocaleDateString()}.`,
    });
  };

  const deleteScheduledWorkout = (id: string) => {
    const workout = scheduledWorkouts.find(w => w.id === id);
    setScheduledWorkouts(prev => prev.filter(workout => workout.id !== id));
    
    if (workout) {
      toast({
        title: "Scheduled workout deleted",
        description: `${workout.workoutName} has been removed from your schedule.`,
      });
    }
  };

  const getWorkoutsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return scheduledWorkouts.filter(workout => workout.date === dateString);
  };

  const getSelectedDateWorkouts = () => {
    if (!selectedDate) return [];
    return getWorkoutsForDate(selectedDate);
  };

  const hasWorkoutOnDate = (date: Date) => {
    return getWorkoutsForDate(date).length > 0;
  };

  const selectedDateWorkouts = getSelectedDateWorkouts();
  const upcomingWorkouts = scheduledWorkouts
    .filter(workout => new Date(workout.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="animate-scale-in bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="h-6 w-6 text-purple-600" />
              <h2 className="text-2xl font-bold">Training Schedule</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Plan your workouts and stay consistent with your fitness goals
            </p>
            <Badge variant="outline" className="text-sm">
              {scheduledWorkouts.length} workouts scheduled
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card className="animate-fade-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Workout Calendar
              </CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="btn-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Workout
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Schedule Workout</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="selectedDate">Selected Date</Label>
                      <Input
                        id="selectedDate"
                        value={selectedDate?.toLocaleDateString() || ''}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="workoutName">Workout Name *</Label>
                      <Input
                        id="workoutName"
                        value={formData.workoutName}
                        onChange={(e) => setFormData(prev => ({ ...prev, workoutName: e.target.value }))}
                        placeholder="e.g., Leg Day, Cardio, Upper Body"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="notes">Notes (optional)</Label>
                      <Input
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="e.g., Focus on squats and deadlifts"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1 btn-primary">
                        Schedule Workout
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className={cn("w-full pointer-events-auto")}
              modifiers={{
                hasWorkout: (date) => hasWorkoutOnDate(date)
              }}
              modifiersStyles={{
                hasWorkout: {
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                  borderRadius: '50%'
                }
              }}
            />
            <div className="mt-4 text-sm text-muted-foreground">
              <p>• Blue dates have scheduled workouts</p>
              <p>• Click a date to view or add workouts</p>
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Workouts */}
        <div className="space-y-4">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>
                {selectedDate
                  ? `Workouts for ${selectedDate.toLocaleDateString()}`
                  : 'Select a date'
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateWorkouts.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No workouts scheduled for this date</p>
                  <p className="text-sm">Click "Add Workout" to schedule one!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateWorkouts.map((workout) => (
                    <Card key={workout.id} className="card-hover">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">
                              {workout.workoutName}
                            </h3>
                            {workout.notes && (
                              <p className="text-sm text-muted-foreground">
                                {workout.notes}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteScheduledWorkout(workout.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive ml-2"
                            aria-label="Delete scheduled workout"
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

          {/* Upcoming Workouts */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Upcoming Workouts</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingWorkouts.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No upcoming workouts scheduled</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingWorkouts.map((workout) => (
                    <div
                      key={workout.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{workout.workoutName}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(workout.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {new Date(workout.date).toLocaleDateString() === new Date().toLocaleDateString()
                          ? 'Today'
                          : new Date(workout.date) < new Date(Date.now() + 86400000)
                          ? 'Tomorrow'
                          : 'Upcoming'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
