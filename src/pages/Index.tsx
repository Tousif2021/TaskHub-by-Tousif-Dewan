import { Link } from "react-router-dom";
import { Bell, FolderDot, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

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
        className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-md transition-all duration-300"
      >
        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center mb-4`}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  </div>
);

const Index = () => {
  return (
    <div 
      className="min-h-screen p-6 pb-20"
    >
      <header className="mb-8 flex justify-between items-center">
        <h1 
          className="text-2xl font-bold text-primary"
        >
          Task Manager
        </h1>
        <Link to="/previous">
          <Button variant="ghost">Back</Button>
        </Link>
      </header>

      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <MenuItem 
          to="/files"
          icon={FolderDot}
          title="Files"
          description="Access your documents"
          color="bg-blue-500/10 text-blue-600 dark:text-blue-400"
        />

        <MenuItem 
          to="/task-preview"
          icon={Plus}
          title="Task Preview"
          description="Preview your added tasks"
          color="bg-green-500/10 text-green-600 dark:text-green-400"
        />

        <MenuItem 
          to="/reminders"
          icon={Bell}
          title="Reminders"
          description="Manage your notifications"
          color="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />

        <MenuItem 
          to="/profile"
          icon={User}
          title="Profile"
          description="View your account"
          color="bg-purple-500/10 text-purple-600 dark:text-purple-400"
        />
      </div>

      <Navigation />
    </div>
  );
};

export default Index;