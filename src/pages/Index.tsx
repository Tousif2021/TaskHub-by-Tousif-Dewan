
import { Link } from "react-router-dom";
import { Bell, FolderDot, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";

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

const Index = () => {
  const { user } = useAuth();

  return (
    <div 
      className="min-h-screen p-8 pb-24"
    >
      <header className="mb-10 flex justify-between items-center">
        <h1 
          className="text-2xl font-extrabold text-primary"
        >
          Task Manager
        </h1>
        
        {!user && (
          <Link to="/auth">
            <Button variant="default" size="sm" className="hover:scale-105 transition-transform">
              Login / Sign Up
            </Button>
          </Link>
        )}
      </header>

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
