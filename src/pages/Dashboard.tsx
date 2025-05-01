
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useUser } from "../contexts/UserContext";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import FlowMeter from "../components/dashboard/FlowMeter";
import WeightChart from "../components/dashboard/WeightChart";
import ChallengeCard from "../components/dashboard/ChallengeCard";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Activity, 
  Dumbbell, 
  Weight, 
  Trophy, 
  Calendar,
  ArrowRight,
  CheckIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { userData } = useUser();
  const navigate = useNavigate();
  
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Loading...</h2>
          <p className="text-gray-600 dark:text-gray-400">Fetching your fitness data</p>
        </div>
      </div>
    );
  }
  
  const profile = userData.profile || {};
  const calculated = profile.calculated || {};
  const macros = calculated.macros || {};
  const streak = userData.gamification?.streak?.current || 0;
  const sciencePoints = userData.gamification?.sciencePoints || 0;
  
  // Check if workout was logged today
  const workoutLogs = userData.workouts?.logs || {};
  const today = format(new Date(), "yyyy-MM-dd");
  const workoutLoggedToday = workoutLogs[today] !== undefined;
  
  // Check if diet was logged today
  const dietLogs = userData.diet?.logs || {};
  const dietLoggedToday = dietLogs[today] !== undefined;
  
  // Get today's workout plan
  const workoutPlan = userData.workouts?.plan || {};
  const dayOfWeek = new Date().getDay(); // 0 = Sunday, 1 = Monday, ...
  const workoutDay = `day${dayOfWeek === 0 ? 7 : dayOfWeek}`; // Map Sunday to day7
  const todaysWorkout = workoutPlan[workoutDay] || { name: "Rest", exercises: [] };
  
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />
      
      <div className="flex-1 flex">
        <Sidebar />
        
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Welcome and Stats */}
            <div className="flex flex-col md:flex-row gap-6">
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Welcome back, {profile.name}</CardTitle>
                  <CardDescription>
                    {streak > 0 ? (
                      <>
                        <span className="font-medium text-blue-600">{streak} day streak!</span> Keep going!
                      </>
                    ) : (
                      "Let's start building healthy habits!"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Daily Calorie Target</div>
                      <div className="text-2xl font-bold">{calculated.dailyCalorieTarget || 0} kcal</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Protein Target</div>
                      <div className="text-2xl font-bold">{macros.protein || 0}g</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Daily Progress</div>
                    <Progress value={(workoutLoggedToday ? 50 : 0) + (dietLoggedToday ? 50 : 0)} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-2 gap-4 md:w-1/3">
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm text-blue-600 dark:text-blue-400">Streak</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 p-4">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{streak}</div>
                    <div className="text-sm text-blue-600/70 dark:text-blue-400/70">days</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm text-green-600 dark:text-green-400">Science Pts</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 p-4">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">{sciencePoints}</div>
                    <div className="text-sm text-green-600/70 dark:text-green-400/70">points</div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Today's Plan and Challenges */}
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-2/3 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">Today's Workout: {todaysWorkout.name}</CardTitle>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-600"
                        onClick={() => navigate("/workouts")}
                      >
                        <span>View Plan</span>
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {todaysWorkout.exercises?.length > 0 ? (
                      <div className="space-y-2">
                        {todaysWorkout.exercises.map((exercise, index) => (
                          <div key={index} className="flex items-center p-2 border rounded-lg">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                              <Dumbbell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <div className="font-medium">{exercise}</div>
                              <div className="text-sm text-gray-500">
                                {todaysWorkout.sets || 3} sets
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <p>Rest day - focus on recovery!</p>
                      </div>
                    )}
                    
                    {!workoutLoggedToday && todaysWorkout.exercises?.length > 0 && (
                      <Button 
                        className="w-full mt-4" 
                        onClick={() => navigate("/workouts")}
                      >
                        Log Today's Workout
                      </Button>
                    )}
                    
                    {workoutLoggedToday && (
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mt-4 flex items-center justify-center text-green-600">
                        <Check className="h-5 w-5 mr-2" />
                        <span>Workout logged for today!</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Key Stats</CardTitle>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Activity className="h-6 w-6 text-blue-600 mb-2" />
                        <div className="text-sm text-gray-500">BMR</div>
                        <div className="font-semibold">{Math.round(calculated.maintenanceCalories / 1.2)} kcal</div>
                      </div>
                      
                      <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Weight className="h-6 w-6 text-green-600 mb-2" />
                        <div className="text-sm text-gray-500">Current</div>
                        <div className="font-semibold">{profile.weight} kg</div>
                      </div>
                      
                      <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Trophy className="h-6 w-6 text-orange-600 mb-2" />
                        <div className="text-sm text-gray-500">Goal</div>
                        <div className="font-semibold">{profile.goal}</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <div className="text-sm font-medium">Daily Macros</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-lg p-2 bg-blue-50 dark:bg-blue-900/20">
                          <div className="text-sm text-gray-600 dark:text-gray-400">Protein</div>
                          <div className="font-semibold">{macros.protein}g</div>
                        </div>
                        <div className="rounded-lg p-2 bg-green-50 dark:bg-green-900/20">
                          <div className="text-sm text-gray-600 dark:text-gray-400">Carbs</div>
                          <div className="font-semibold">{macros.carbs}g</div>
                        </div>
                        <div className="rounded-lg p-2 bg-yellow-50 dark:bg-yellow-900/20">
                          <div className="text-sm text-gray-600 dark:text-gray-400">Fat</div>
                          <div className="font-semibold">{macros.fat}g</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <WeightChart />
              </div>
              
              <div className="lg:w-1/3 space-y-6">
                <FlowMeter />
                <ChallengeCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Create Check icon component when CheckIcon is not available from lucide-react
const Check = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20 6L9 17l-5-5"></path>
  </svg>
);

export default Dashboard;
