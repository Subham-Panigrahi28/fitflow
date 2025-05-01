
import { useAuth } from "../contexts/AuthContext";
import { useUser } from "../contexts/UserContext";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import CoachChat from "../components/coach/CoachChat";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Coach = () => {
  const { currentUser } = useAuth();
  const { userData } = useUser();
  
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Loading...</h2>
          <p className="text-gray-600 dark:text-gray-400">Connecting to your fitness coach</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />
      
      <div className="flex-1 flex">
        <Sidebar />
        
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">AI Coach</h1>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
                Powered by Gemini AI
              </Badge>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Fitness Coach</CardTitle>
                <CardDescription>
                  Ask questions about workouts, nutrition, recovery, or any fitness topic
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <CoachChat />
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Workout Questions</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600 dark:text-gray-400">
                  <ul className="list-disc list-inside space-y-1">
                    <li>"What's the optimal rep range for hypertrophy?"</li>
                    <li>"How should I structure my push/pull/legs split?"</li>
                    <li>"What's the science behind progressive overload?"</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Nutrition Questions</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600 dark:text-gray-400">
                  <ul className="list-disc list-inside space-y-1">
                    <li>"How much protein do I need for muscle growth?"</li>
                    <li>"What's the ideal meal timing around workouts?"</li>
                    <li>"Are there any supplements worth taking?"</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Recovery Questions</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600 dark:text-gray-400">
                  <ul className="list-disc list-inside space-y-1">
                    <li>"How can I improve my sleep quality?"</li>
                    <li>"What's the best way to reduce muscle soreness?"</li>
                    <li>"How many rest days should I take per week?"</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">About Your AI Coach</h3>
              <p className="text-blue-700 dark:text-blue-400 text-sm">
                Your AI Coach provides science-backed fitness advice based on peer-reviewed research and best practices from 
                organizations like ACSM (American College of Sports Medicine) and ISSN (International Society of Sports Nutrition).
                All recommendations are tailored to your specific profile, goals, and current progress.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coach;
