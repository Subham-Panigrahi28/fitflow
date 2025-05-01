
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, X, Dumbbell } from "lucide-react";
import { format } from "date-fns";

const WorkoutLogger = () => {
  const { userData, logWorkout } = useUser();
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exercises, setExercises] = useState([{ name: "", sets: "", reps: "", weight: "" }]);
  const { toast } = useToast();
  
  if (!userData) return null;
  
  const workoutLogs = userData.workouts?.logs || {};
  
  // Today's planned workout
  const workoutPlan = userData.workouts?.plan || {};
  const dayOfWeek = new Date().getDay(); // 0 = Sunday, 1 = Monday, ...
  const workoutDay = `day${dayOfWeek === 0 ? 7 : dayOfWeek}`; // Map Sunday to day7
  const todaysWorkout = workoutPlan[workoutDay] || { name: "Rest", exercises: [] };
  
  const handleAddExercise = () => {
    setExercises([...exercises, { name: "", sets: "", reps: "", weight: "" }]);
  };
  
  const handleRemoveExercise = (index) => {
    const newExercises = [...exercises];
    newExercises.splice(index, 1);
    setExercises(newExercises);
  };
  
  const handleExerciseChange = (index, field, value) => {
    const newExercises = [...exercises];
    newExercises[index][field] = value;
    setExercises(newExercises);
  };
  
  const handleUseTemplate = () => {
    if (todaysWorkout.exercises?.length > 0) {
      setExercises(
        todaysWorkout.exercises.map(exercise => ({
          name: exercise,
          sets: todaysWorkout.sets?.toString() || "3",
          reps: "8-12",
          weight: ""
        }))
      );
    }
  };
  
  const handleSubmit = async () => {
    // Validate
    const isValid = exercises.every(ex => ex.name && ex.sets && ex.reps);
    
    if (!isValid || exercises.length === 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all exercise fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const workoutData = {
        date: format(new Date(), "yyyy-MM-dd"),
        name: todaysWorkout.name || "Custom Workout",
        exercises: exercises.map(ex => ({
          name: ex.name,
          sets: parseInt(ex.sets),
          reps: ex.reps,
          weight: ex.weight ? parseFloat(ex.weight) : 0
        }))
      };
      
      await logWorkout(workoutData);
      
      toast({
        title: "Workout logged",
        description: "Your workout has been recorded successfully",
      });
      
      setExercises([{ name: "", sets: "", reps: "", weight: "" }]);
      setShowDialog(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log workout",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Get recent logs
  const recentLogs = Object.keys(workoutLogs)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .slice(0, 5)
    .map(date => ({
      date,
      ...workoutLogs[date]
    }));
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Log Your Workout</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Today's plan: <span className="font-medium">{todaysWorkout.name || "Rest"}</span>
          </p>
        </div>
        
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button>Log Workout</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Log Your Workout</DialogTitle>
              <DialogDescription>
                Record your exercises, sets, reps and weights.
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex justify-end">
              {todaysWorkout.exercises?.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mb-2"
                  onClick={handleUseTemplate}
                >
                  Use Today's Plan
                </Button>
              )}
            </div>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {exercises.map((exercise, index) => (
                <Card key={index} className="relative">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-sm">Exercise {index + 1}</CardTitle>
                      {exercises.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 absolute top-2 right-2"
                          onClick={() => handleRemoveExercise(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`exercise-${index}`}>Exercise Name</Label>
                      <Input
                        id={`exercise-${index}`}
                        value={exercise.name}
                        onChange={(e) => handleExerciseChange(index, "name", e.target.value)}
                        placeholder="e.g. Bench Press"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`sets-${index}`}>Sets</Label>
                        <Input
                          id={`sets-${index}`}
                          type="number"
                          value={exercise.sets}
                          onChange={(e) => handleExerciseChange(index, "sets", e.target.value)}
                          placeholder="3"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`reps-${index}`}>Reps</Label>
                        <Input
                          id={`reps-${index}`}
                          value={exercise.reps}
                          onChange={(e) => handleExerciseChange(index, "reps", e.target.value)}
                          placeholder="8-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`weight-${index}`}>Weight (kg)</Label>
                        <Input
                          id={`weight-${index}`}
                          type="number"
                          value={exercise.weight}
                          onChange={(e) => handleExerciseChange(index, "weight", e.target.value)}
                          placeholder="Optional"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={handleAddExercise}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Exercise
              </Button>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : "Save Workout"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent Workouts</h3>
        
        {recentLogs.length > 0 ? (
          <div className="space-y-4">
            {recentLogs.map((log, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                      <Dumbbell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle>{log.name}</CardTitle>
                      <CardDescription>
                        {new Date(log.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid gap-2">
                    {log.exercises?.map((exercise, i) => (
                      <div key={i} className="flex justify-between items-center p-2 border rounded-md">
                        <div className="font-medium">{exercise.name}</div>
                        <div className="text-gray-600 text-sm">
                          {exercise.sets} sets × {exercise.reps} reps
                          {exercise.weight > 0 && ` @ ${exercise.weight}kg`}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Dumbbell className="h-10 w-10 mx-auto mb-3 text-gray-400" />
            <p className="text-lg font-medium">No workouts logged yet</p>
            <p className="text-sm mt-1">Start logging your workouts to track progress</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutLogger;
