
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useUser } from "../contexts/UserContext";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import WorkoutPlan from "../components/workouts/WorkoutPlan";
import WorkoutLogger from "../components/workouts/WorkoutLogger";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dumbbell, ClipboardCheck } from "lucide-react";

const Workouts = () => {
  const [activeTab, setActiveTab] = useState("plan");
  const { currentUser } = useAuth();
  const { userData } = useUser();
  
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Loading...</h2>
          <p className="text-gray-600 dark:text-gray-400">Fetching your workout data</p>
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
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Workouts</h1>
            
            <Tabs 
              defaultValue={activeTab} 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
                <TabsTrigger value="plan" className="flex items-center">
                  <Dumbbell className="h-4 w-4 mr-2" />
                  Workout Plan
                </TabsTrigger>
                <TabsTrigger value="log" className="flex items-center">
                  <ClipboardCheck className="h-4 w-4 mr-2" />
                  Log Workout
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="plan" className="pt-2">
                <WorkoutPlan />
              </TabsContent>
              
              <TabsContent value="log" className="pt-2">
                <WorkoutLogger />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workouts;
