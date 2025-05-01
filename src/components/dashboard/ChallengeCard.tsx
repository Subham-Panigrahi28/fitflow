
import { useUser } from "../../contexts/UserContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Weight, History, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ChallengeCard = () => {
  const { userData, completeChallenge, generateWeeklyChallenges } = useUser();
  const { toast } = useToast();
  
  if (!userData) return null;
  
  const challenges = userData.gamification?.challenges || {};
  
  const handleCompleteChallenge = async (type: string) => {
    try {
      await completeChallenge(type);
      toast({
        title: "Challenge completed",
        description: "You've earned 3 Science Points!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete challenge",
        variant: "destructive",
      });
    }
  };
  
  const handleNewChallenges = async () => {
    try {
      await generateWeeklyChallenges();
      toast({
        title: "New challenges generated",
        description: "Your weekly challenges have been updated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate challenges",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Weekly Challenges</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleNewChallenges}
          >
            New Set
          </Button>
        </div>
        <CardDescription>Complete these to earn Science Points</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
              <Dumbbell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-sm font-medium">{challenges.strength || "Add weight to your lifts"}</div>
          </div>
          
          <Button 
            size="sm" 
            variant={challenges.strength_completed ? "ghost" : "outline"}
            onClick={() => handleCompleteChallenge("strength")}
            disabled={challenges.strength_completed}
            className={challenges.strength_completed ? "text-green-600" : ""}
          >
            {challenges.strength_completed ? (
              <Check className="h-4 w-4" />
            ) : (
              "Complete"
            )}
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
              <Weight className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-sm font-medium">{challenges.nutrition || "Hit your protein target"}</div>
          </div>
          
          <Button 
            size="sm" 
            variant={challenges.nutrition_completed ? "ghost" : "outline"}
            onClick={() => handleCompleteChallenge("nutrition")}
            disabled={challenges.nutrition_completed}
            className={challenges.nutrition_completed ? "text-green-600" : ""}
          >
            {challenges.nutrition_completed ? (
              <Check className="h-4 w-4" />
            ) : (
              "Complete"
            )}
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full">
              <History className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-sm font-medium">{challenges.recovery || "Get 7+ hours sleep"}</div>
          </div>
          
          <Button 
            size="sm" 
            variant={challenges.recovery_completed ? "ghost" : "outline"}
            onClick={() => handleCompleteChallenge("recovery")}
            disabled={challenges.recovery_completed}
            className={challenges.recovery_completed ? "text-green-600" : ""}
          >
            {challenges.recovery_completed ? (
              <Check className="h-4 w-4" />
            ) : (
              "Complete"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChallengeCard;
