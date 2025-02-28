
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
        ? "text-[#0EA5E9] font-medium" 
        : "text-primary/60 hover:text-[#0EA5E9]"
    }`}
  >
    <div className={`w-7 h-7 flex items-center justify-center ${
      active ? 'bg-[#F1F1F1] dark:bg-slate-800 rounded-md' : ''
    }`}>
      <Icon className="w-5 h-5" />
    </div>
    <span 
      className={`text-[10px] font-medium ${active ? 'opacity-100' : 'opacity-80'}`}
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
    <nav className="fixed bottom-0 left-0 right-0 flex justify-around items-center py-4 px-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.2)]">
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
        label="Tasks" 
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
