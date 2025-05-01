
import { useUser } from "../../contexts/UserContext";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const FlowMeter = () => {
  const { userData } = useUser();
  
  if (!userData) return null;
  
  const streak = userData.gamification?.streak?.current || 0;
  const progress = Math.min(streak * 14.3, 100);
  const daysToUnlock = 7 - streak;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Flow Meter</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-64 text-sm">
                  Log activity for 7 consecutive days to unlock your Weekly Progress Report
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>
          {streak >= 7 
            ? "Congratulations! Report unlocked" 
            : `${daysToUnlock} more day${daysToUnlock !== 1 ? 's' : ''} to unlock report`}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <Progress value={progress} className="h-2" />
          
          <div className="flex justify-between text-xs text-gray-500">
            <div>0 days</div>
            <div>7 days</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlowMeter;
