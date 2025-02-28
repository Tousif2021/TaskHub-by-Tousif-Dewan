
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, FolderDot, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { isToday, isFuture, format } from "date-fns";

interface MenuItemProps {
  to: string;
  icon: any;
  title: string;
  description: string;
  color: string;
}

const MenuItem = ({ to, icon: Icon, title, description, color }: MenuItemProps) => (
  <div>
    <Link to={to}>
      <div 
        className="p-5 rounded-lg border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] h-full"
      >
        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center mb-3`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  </div>
);

// Array of motivational quotes
const motivationalQuotes = [
  "Dream big!",
  "Stay focused.",
  "Embrace the day.",
  "Keep pushing forward.",
  "Make it happen.",
  "Believe in yourself.",
  "Take the leap.",
  "Seize the moment.",
  "Just do it.",
  "Rise and shine.",
  "Achieve greatness today.",
  "Stay determined.",
  "Unleash your potential."
];

const Index = () => {
  const { user, profile } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [quote, setQuote] = useState("");
  const [taskStats, setTaskStats] = useState({
    todayTasks: 0,
    upcomingTasks: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Get random motivational quote
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setQuote(motivationalQuotes[randomIndex]);
  }, []);
  
  // Extract first name from full name
  useEffect(() => {
    if (profile && profile.full_name) {
      const nameParts = profile.full_name.split(" ");
      setFirstName(nameParts[0]);
    }
  }, [profile]);
  
  // Fetch task statistics
  useEffect(() => {
    const fetchTaskStats = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .eq("user_id", user.id);
        
        if (error) {
          console.error("Error fetching tasks:", error);
          setIsLoading(false);
          return;
        }
        
        // Count today's and upcoming tasks
        let todayCount = 0;
        let upcomingCount = 0;
        
        if (data && data.length > 0) {
          data.forEach(task => {
            if (!task.completed) {
              const taskDate = new Date(task.due_date);
              if (isToday(taskDate)) {
                todayCount++;
              } else if (isFuture(taskDate) && !isToday(taskDate)) {
                upcomingCount++;
              }
            }
          });
        }
        
        setTaskStats({
          todayTasks: todayCount,
          upcomingTasks: upcomingCount
        });
      } catch (err) {
        console.error("Failed to fetch task statistics:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTaskStats();
  }, [user]);

  return (
    <div 
      className="min-h-screen p-8 pb-24"
    >
      <header className="mb-10 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-extrabold">
            <span className="text-[#1e40af]">Task</span>
            <span className="text-primary">Hub</span>
            <span className="text-xs ml-1 text-[#1e40af] font-medium align-top">®</span>
          </h1>
          <div className="ml-2 px-1.5 py-0.5 bg-[#1e40af]/10 rounded text-[10px] text-[#1e40af] font-medium uppercase tracking-wider">
            Beta
          </div>
        </div>
        
        {!user && (
          <Link to="/auth">
            <Button variant="default" size="sm" className="hover:scale-105 transition-transform">
              Login / Sign Up
            </Button>
          </Link>
        )}
      </header>

      {user && !isLoading && (
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="bg-white/80 dark:bg-slate-800/80 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Welcome back, {firstName || "User"}!
            </h2>
            <p className="text-accent dark:text-accent/80 font-medium mt-1">{quote}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <div className="flex-1 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
                <h3 className="text-sm text-blue-700 dark:text-blue-300 font-medium">Due Today</h3>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                    {taskStats.todayTasks}
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 text-sm mb-0.5">
                    task{taskStats.todayTasks !== 1 ? 's' : ''}
                  </span>
                </div>
                <Link to="/reminders">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 text-blue-600 dark:text-blue-400 px-0 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  >
                    View all
                  </Button>
                </Link>
              </div>
              
              <div className="flex-1 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-900/30">
                <h3 className="text-sm text-amber-700 dark:text-amber-300 font-medium">Upcoming</h3>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-3xl font-bold text-amber-700 dark:text-amber-300">
                    {taskStats.upcomingTasks}
                  </span>
                  <span className="text-amber-600 dark:text-amber-400 text-sm mb-0.5">
                    task{taskStats.upcomingTasks !== 1 ? 's' : ''}
                  </span>
                </div>
                <Link to="/reminders">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 text-amber-600 dark:text-amber-400 px-0 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                  >
                    View all
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {user && isLoading && (
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="bg-white/80 dark:bg-slate-800/80 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Welcome back, {firstName || "User"}!
            </h2>
            <p className="text-accent dark:text-accent/80 font-medium mt-1">{quote}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg animate-pulse">
                <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              
              <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg animate-pulse">
                <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
      >
        <MenuItem 
          to="/add"
          icon={Plus}
          title="Add Task"
          description="Create a new task"
          color="bg-green-500/15 text-green-600 dark:text-green-400"
        />

        <MenuItem 
          to="/files"
          icon={FolderDot}
          title="Files"
          description="Access your documents"
          color="bg-blue-500/15 text-blue-600 dark:text-blue-400"
        />

        <MenuItem 
          to="/reminders"
          icon={Bell}
          title="Reminders"
          description="Manage your notifications"
          color="bg-amber-500/15 text-amber-600 dark:text-amber-400"
        />

        <MenuItem 
          to="/profile"
          icon={User}
          title="Profile"
          description="View your account"
          color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
        />
      </div>
    </div>
  );
};

export default Index;
