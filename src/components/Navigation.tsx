import { useLocation, Link } from "react-router-dom";
import { Home, Plus, Bell, User, FolderDot } from "lucide-react";

interface NavigationProps {
  showBackButton?: boolean;
}

const Navigation = ({ showBackButton = false }: NavigationProps) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-md w-full py-4 px-6"> {/* Modified class for bottom positioning */}
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
        icon={Plus} 
        label="Tasks" 
        to="/tasks" 
        active={isActive('/tasks') || isActive('/add')} 
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

export default Navigation;