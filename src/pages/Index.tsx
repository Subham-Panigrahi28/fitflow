
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, Dumbbell, Weight } from "lucide-react";

const Index = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-green-500 to-orange-500 bg-clip-text text-transparent">
              Science-Backed Fitness,<br />Personalized For You
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto">
              Data-driven workout plans and nutrition advice based on the latest research in exercise science and nutrition.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg h-14">
                <Link to="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg h-14">
                <Link to="/login">
                  Log In
                </Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="flex flex-col md:flex-row justify-center gap-8 py-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">97%</div>
                <div className="text-gray-600 dark:text-gray-400">User Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">30+</div>
                <div className="text-gray-600 dark:text-gray-400">Research Studies</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-500">25k+</div>
                <div className="text-gray-600 dark:text-gray-400">Active Users</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Science-Driven Features</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 w-14 h-14 rounded-lg mb-4 flex items-center justify-center">
                  <Activity className="text-blue-600 dark:text-blue-400 h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Research-Backed Metrics</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Using the validated Mifflin-St Jeor equation to calculate your metabolic rate with precision.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 w-14 h-14 rounded-lg mb-4 flex items-center justify-center">
                  <Dumbbell className="text-green-600 dark:text-green-400 h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Periodized Workout Plans</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Training programs built using evidence-based principles of progressive overload and periodization.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
                <div className="bg-orange-100 dark:bg-orange-900/30 p-3 w-14 h-14 rounded-lg mb-4 flex items-center justify-center">
                  <Weight className="text-orange-600 dark:text-orange-400 h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">ISSN-Guided Nutrition</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Macro recommendations based on International Society of Sports Nutrition guidelines for optimal body composition.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to transform your fitness journey?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">
              Join thousands who have achieved their fitness goals with our science-based approach.
            </p>
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg h-14">
              <Link to="/signup">
                Start Your Free Account
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="py-8 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2024 FitFlow. All rights reserved.</p>
            <p className="mt-2 text-sm">Based on research from ACSM, ISSN, and NSCA</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
