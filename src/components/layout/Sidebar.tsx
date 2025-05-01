
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { 
  Home, 
  Dumbbell, 
  Weight, 
  User, 
  MessageSquare, 
  ChevronRight, 
  ChevronLeft 
} from "lucide-react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { userData } = useUser();

  const navItems = [
    {
      label: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      href: "/dashboard"
    },
    {
      label: "Workouts",
      icon: <Dumbbell className="h-5 w-5" />,
      href: "/workouts"
    },
    {
      label: "Diet",
      icon: <Weight className="h-5 w-5" />,
      href: "/diet"
    },
    {
      label: "Coach",
      icon: <MessageSquare className="h-5 w-5" />,
      href: "/coach"
    },
    {
      label: "Profile",
      icon: <User className="h-5 w-5" />,
      href: "/profile"
    }
  ];

  return (
    <div 
      className={`${
        collapsed ? 'w-16' : 'w-64'
      } min-h-screen bg-gray-50 dark:bg-gray-900 shadow-lg transition-all duration-300 ease-in-out`}
    >
      <div className="px-4 py-5 flex justify-between items-center">
        {!collapsed && (
          <Link to="/dashboard" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-400 bg-clip-text text-transparent">
            FitFlow
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>
      
      {/* User stats */}
      {!collapsed && userData && (
        <div className="px-4 py-3 border-t border-b border-gray-200 dark:border-gray-700 mb-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">Current streak</div>
          <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
            {userData.gamification?.streak?.current || 0} days
          </div>
          
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Science points</div>
          <div className="text-lg font-semibold text-green-600 dark:text-green-400">
            {userData.gamification?.sciencePoints || 0} pts
          </div>
        </div>
      )}
      
      {/* Navigation */}
      <nav className="mt-5">
        <ul>
          {navItems.map((item) => (
            <li key={item.href} className="mb-1">
              <Link
                to={item.href}
                className={`flex items-center px-4 py-3 ${
                  location.pathname === item.href
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                } rounded-lg transition-all`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="ml-4">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Flow Meter (simplified when collapsed) */}
      {userData && (
        <div className={`px-4 ${collapsed ? 'py-2' : 'py-4'} mt-auto mb-4`}>
          {!collapsed && <div className="text-sm font-medium mb-1">Flow Meter</div>}
          <div className="bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-green-400 h-full transition-all duration-500 ease-out"
              style={{ 
                width: `${userData.gamification?.streak?.current 
                  ? Math.min(userData.gamification.streak.current * 14.3, 100) 
                  : 0}%` 
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
