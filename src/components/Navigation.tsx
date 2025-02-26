import { Link, useLocation } from "react-router-dom";
import { Home, PlusCircle, Bell, FolderOpen, User } from "lucide-react";

export default function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t py-2 px-4 z-10">
      <div className="flex items-center justify-around max-w-xl mx-auto">
        <Link 
          to="/" 
          className={`flex flex-col items-center p-2 ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link 
          to="/reminders" 
          className={`flex flex-col items-center p-2 ${isActive('/reminders') ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <Bell className="h-6 w-6" />
          <span className="text-xs mt-1">Reminders</span>
        </Link>

        <Link 
          to="/task-preview" 
          className={`flex flex-col items-center p-2 ${isActive('/task-preview') ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <PlusCircle className="h-6 w-6" />
          <span className="text-xs mt-1">Task Preview</span>
        </Link>

        <Link 
          to="/files" 
          className={`flex flex-col items-center p-2 ${isActive('/files') ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <FolderOpen className="h-6 w-6" />
          <span className="text-xs mt-1">Files</span>
        </Link>

        <Link 
          to="/profile" 
          className={`flex flex-col items-center p-2 ${isActive('/profile') ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
}