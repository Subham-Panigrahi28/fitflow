
import { useAuth } from "../contexts/AuthContext";
import { useUser } from "../contexts/UserContext";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import ProfileForm from "../components/profile/ProfileForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { LogOut, Trophy, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const { userData } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };
  
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Loading...</h2>
          <p className="text-gray-600 dark:text-gray-400">Fetching your profile</p>
        </div>
      </div>
    );
  }
  
  const profile = userData.profile || {};
  const streak = userData.gamification?.streak || {};
  const sciencePoints = userData.gamification?.sciencePoints || 0;
  
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />
      
      <div className="flex-1 flex">
        <Sidebar />
        
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
            
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Your basic account details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium">{profile.email || currentUser?.email}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">Member Since</div>
                      <div className="font-medium">
                        {currentUser?.metadata?.creationTime
                          ? new Date(currentUser.metadata.creationTime).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>Your fitness journey progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        <span className="font-medium">Current Streak</span>
                      </div>
                      <span className="font-semibold">{streak.current || 0} days</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Award className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">Longest Streak</span>
                      </div>
                      <span className="font-semibold">{streak.longest || 0} days</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016a11.955 11.955 0 01-8.618 3.508 11.955 11.955 0 01-8.618-3.508A8.958 8.958 0 0112 4c1.73 0 3.36.44 4.797 1.222" />
                        </svg>
                        <span className="font-medium">Science Points</span>
                      </div>
                      <span className="font-semibold">{sciencePoints} points</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <ProfileForm />
            
            <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="text-red-800 dark:text-red-300">Account Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700 dark:text-red-400 text-sm">
                  Be careful with the actions below. Logging out will end your current session.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="destructive" 
                  className="w-full md:w-auto"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
