import { useLocation, Link } from "react-router-dom";
import { Home, List, Bell, User, FolderDot } from "lucide-react";

interface NavigationProps {
  showBackButton?: boolean;
}

const NavItem = ({ 
  icon: Icon, 
  label, 
  to,
  active
}: { 
  icon: any; 
  label: string; 
  to: string;
  active: boolean;
}) => (
  <Link
    to={to}
    className={`flex flex-col items-center gap-1 transition-all duration-300 ${
      active 
        ? "text-accent scale-110" 
        : "text-primary/60 hover:text-accent hover:scale-105"
    }`}
  >
    <div>
      <Icon className="w-6 h-6" />
    </div>
    <span 
      className="text-xs font-medium"
    >
      {label}
    </span>
  </Link>
);

const Navigation = ({ showBackButton = false }: NavigationProps) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-around items-center py-4 px-6 bg-background/80 backdrop-blur-md border-t">
      <NavItem 
        icon={Home} 
        label="Home" 
        to="/"
        active={isActive('/')}
      />
      <NavItem 
        icon={FolderDot} 
        label="Files" 
        to="/files"
        active={isActive('/files')}
      />
      <NavItem 
        icon={List} 
        label="Task Preview" 
        to="/tasks"
        active={isActive('/tasks')}
      />
      <NavItem 
        icon={Bell} 
        label="Reminders" 
        to="/reminders" 
        active={isActive('/reminders')} 
      />
      <NavItem 
        icon={User} 
        label="Profile" 
        to="/profile" 
        active={isActive('/profile')} 
      />
    </nav>
  );
};

export default Navigation;