
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Dumbbell, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const WorkoutPlan = () => {
  const { userData, updateWorkoutPlan } = useUser();
  const [loading, setLoading] = useState(false);
  const [splitDialogOpen, setSplitDialogOpen] = useState(false);
  const [selectedSplit, setSelectedSplit] = useState("");
  const { toast } = useToast();
  
  if (!userData) return null;
  
  const workoutPlan = userData.workouts?.plan || {};
  const workoutSplit = workoutPlan.split || "Full Body";
  
  const dayNames = ["day1", "day2", "day3", "day4", "day5", "day6", "day7"];
  
  const handleUpdateSplit = async () => {
    if (!selectedSplit) {
      toast({
        title: "Selection required",
        description: "Please select a workout split",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      await updateWorkoutPlan(selectedSplit);
      toast({
        title: "Workout plan updated",
        description: `Your workout plan has been changed to ${selectedSplit}`,
      });
      setSplitDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update workout plan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Workout Plan</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Current split: <span className="font-medium">{workoutSplit}</span>
          </p>
        </div>
        
        <Dialog open={splitDialogOpen} onOpenChange={setSplitDialogOpen}>
          <DialogTrigger asChild>
            <Button>Change Split</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Workout Split</DialogTitle>
              <DialogDescription>
                Choose a workout split that fits your schedule and goals.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <Select value={selectedSplit} onValueChange={setSelectedSplit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select workout split" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Push/Pull/Legs">Push/Pull/Legs</SelectItem>
                  <SelectItem value="Upper/Lower">Upper/Lower</SelectItem>
                  <SelectItem value="Full Body">Full Body</SelectItem>
                </SelectContent>
              </Select>
              
              {selectedSplit && (
                <div className="mt-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-md text-sm">
                  <p className="font-medium mb-2">About {selectedSplit} split:</p>
                  {selectedSplit === "Push/Pull/Legs" && (
                    <p>Divides workouts into pushing movements, pulling movements, and leg exercises. Ideal for training 5-6 days per week.</p>
                  )}
                  {selectedSplit === "Upper/Lower" && (
                    <p>Alternates between upper body and lower body days. Great for training 4-5 days per week with good recovery.</p>
                  )}
                  {selectedSplit === "Full Body" && (
                    <p>Trains the entire body each session. Perfect for beginners or those training 3-4 days per week.</p>
                  )}
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setSplitDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateSplit} disabled={loading || !selectedSplit}>
                {loading ? "Updating..." : "Update Plan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calendar">Weekly View</TabsTrigger>
          <TabsTrigger value="list">Day by Day</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {dayNames.map((day, index) => {
              const dayData = workoutPlan[day] || {};
              const dayNumber = index + 1;
              const dayName = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][index];
              
              return (
                <Card key={day} className={`${dayData.name === "Rest" ? "bg-gray-50 dark:bg-gray-800/50" : ""} h-full`}>
                  <CardHeader className="pb-2">
                    <Badge variant="outline" className="w-fit mb-1">Day {dayNumber}</Badge>
                    <CardTitle className="text-sm">{dayName}</CardTitle>
                    <CardDescription className="font-medium text-base">{dayData.name || "Rest"}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="text-sm pt-0">
                    {dayData.exercises?.length > 0 ? (
                      <ul className="space-y-1">
                        {dayData.exercises.map((exercise, i) => (
                          <li key={i} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                            {exercise}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">Recovery day</p>
                    )}
                  </CardContent>
                  
                  {dayData.sets && (
                    <CardFooter className="pt-0 text-xs text-gray-500">
                      {dayData.sets} sets per exercise
                    </CardFooter>
                  )}
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="pt-4 space-y-4">
          {dayNames.map((day, index) => {
            const dayData = workoutPlan[day] || {};
            const dayNumber = index + 1;
            const dayName = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][index];
            
            return (
              <Card key={day}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                        {dayData.name === "Rest" ? (
                          <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <Dumbbell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{dayName}</CardTitle>
                        <CardDescription>{dayData.name || "Rest Day"}</CardDescription>
                      </div>
                    </div>
                    
                    {dayData.sets && (
                      <Badge variant="outline">{dayData.sets} sets</Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  {dayData.exercises?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {dayData.exercises.map((exercise, i) => (
                        <div key={i} className="flex items-center p-2 border rounded-md">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                          <span>{exercise}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Focus on recovery, mobility, and light activity today.</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">Science Behind Your Plan</h3>
        <p className="text-blue-700 dark:text-blue-400 text-sm">
          This program follows research-backed principles of training frequency and volume. 
          According to a meta-analysis by Schoenfeld et al. (2016), training each muscle 2-3 times 
          per week with adequate volume produces superior hypertrophy compared to once-weekly training.
        </p>
      </div>
    </div>
  );
};

export default WorkoutPlan;
