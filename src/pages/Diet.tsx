
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useUser } from "../contexts/UserContext";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import DietPlan from "../components/diet/DietPlan";
import DietLogger from "../components/diet/DietLogger";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, ClipboardCheck } from "lucide-react";

const Diet = () => {
  const [activeTab, setActiveTab] = useState("log");
  const { currentUser } = useAuth();
  const { userData } = useUser();
  
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Loading...</h2>
          <p className="text-gray-600 dark:text-gray-400">Fetching your nutrition data</p>
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
            <h1 className="text-3xl font-bold mb-6">Nutrition</h1>
            
            <Tabs 
              defaultValue={activeTab} 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
                <TabsTrigger value="log" className="flex items-center">
                  <ClipboardCheck className="h-4 w-4 mr-2" />
                  Log Meals
                </TabsTrigger>
                <TabsTrigger value="plan" className="flex items-center">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Meal Plan
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="log" className="pt-2">
                <DietLogger />
              </TabsContent>
              
              <TabsContent value="plan" className="pt-2">
                <DietPlan />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diet;
