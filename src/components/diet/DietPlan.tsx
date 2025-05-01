
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const DietPlan = () => {
  const { userData, updateDietPlan } = useUser();
  const [loading, setLoading] = useState(false);
  const [activeDay, setActiveDay] = useState("monday");
  const { toast } = useToast();
  
  if (!userData) return null;
  
  const profile = userData.profile || {};
  const calculated = profile.calculated || {};
  const macros = calculated.macros || {};
  const dietPlan = userData.diet?.plan || {};
  
  const handleGeneratePlan = async () => {
    try {
      setLoading(true);
      await updateDietPlan();
      toast({
        title: "Diet plan updated",
        description: "Your personalized meal plan has been generated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate diet plan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Days of the week
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const dayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Meal Plan</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Daily target: <span className="font-medium">{calculated.dailyCalorieTarget} kcal</span> with <span className="font-medium">{macros.protein}g protein</span>
          </p>
        </div>
        
        <Button onClick={handleGeneratePlan} disabled={loading}>
          {loading ? "Generating..." : "Regenerate Plan"}
        </Button>
      </div>
      
      <div className="space-y-6">
        <Tabs defaultValue={activeDay} value={activeDay} onValueChange={setActiveDay}>
          <TabsList className="flex w-full overflow-x-auto hide-scrollbar mb-4">
            {days.map((day, index) => (
              <TabsTrigger 
                key={day} 
                value={day}
                className="flex-1"
              >
                {dayLabels[index]}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {days.map((day) => (
            <TabsContent key={day} value={day}>
              <div className="space-y-4">
                {Object.keys(dietPlan).length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {dietPlan[day]?.meals?.map((meal, index) => (
                        <Card key={index} className="h-full">
                          <CardHeader className="pb-2">
                            <Badge variant="outline" className="w-fit mb-1">{meal.name}</Badge>
                            <CardTitle className="text-base">{meal.description}</CardTitle>
                          </CardHeader>
                          
                          <CardContent className="pt-0">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-sm">
                                <span className="text-gray-500">Calories:</span> 
                                <span className="font-medium ml-1">{meal.calories}</span>
                              </div>
                              <div className="text-sm">
                                <span className="text-gray-500">Protein:</span> 
                                <span className="font-medium ml-1">{meal.protein}g</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )) || <p>No meals planned for this day</p>}
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">Nutrition Science Insight</h3>
                      <p className="text-green-700 dark:text-green-400 text-sm">
                        Your plan follows the International Society of Sports Nutrition guidelines, with {macros.protein}g protein 
                        (based on {profile.goal === "Bulk" ? "1.8" : "2.2"}g/kg bodyweight), optimal for {profile.goal.toLowerCase()}ing phase.
                        Meal timing is strategically designed around your workout schedule for maximum nutrients utilization.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">No meal plan generated yet</p>
                    <Button onClick={handleGeneratePlan} disabled={loading}>
                      {loading ? "Generating..." : "Generate Meal Plan"}
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">Nutrition Guidelines</Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Science-Backed Nutrition Guidelines</DialogTitle>
            <DialogDescription>
              Key principles based on peer-reviewed research
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <h4 className="font-medium mb-1">Protein Requirements</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                The International Society of Sports Nutrition recommends 1.6-2.2g/kg of body weight for active individuals. 
                Higher protein intake (2.2g/kg+) may be beneficial during caloric deficits to preserve lean mass.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">Meal Frequency</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Research suggests consuming protein at 3-4 hour intervals (4-5 meals) maximizes muscle protein synthesis.
                The "anabolic window" post-workout is less rigid than previously thought, with benefits seen within a ~4-6 hour window.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">Carbohydrate Timing</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                For performance optimization, studies support consuming carbohydrates 3-4 hours pre-workout.
                Post-exercise carbohydrate intake accelerates glycogen replenishment at a rate of ~5-7g/kg/24hr.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DietPlan;
