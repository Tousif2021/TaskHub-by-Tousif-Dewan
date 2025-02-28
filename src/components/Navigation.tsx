
import { useLocation, Link } from "react-router-dom";
import { Home, List, Bell, User, FolderDot } from "lucide-react";

interface NavigationProps {
  showBackButton?: boolean;
}

const NavItem = ({ 
  icon: Icon, 
  to,
  active
}: { 
  icon: any; 
  to: string;
  active: boolean;
}) => (
  <Link
    to={to}
    className="relative flex items-center justify-center h-full flex-1"
  >
    <div 
      className={`
        flex items-center justify-center w-full h-full
        ${active ? 'bg-[#F1F1F1] dark:bg-slate-800' : 'bg-transparent'}
        relative transition-all duration-300 ease-in-out
      `}
    >
      <Icon 
        className={`w-5 h-5 transition-colors duration-300 ease-in-out ${
          active 
            ? "text-[#1e40af]" 
            : "text-primary/60 hover:text-[#1e40af]"
        }`} 
      />
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1e40af] transition-all duration-300 ease-in-out"></div>
      )}
    </div>
  </Link>
);

const Navigation = ({ showBackButton = false }: NavigationProps) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-between items-stretch h-14 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 z-50 shadow-[0_-1px_5px_rgba(0,0,0,0.05)] dark:shadow-[0_-1px_5px_rgba(0,0,0,0.2)]">
      <NavItem 
        icon={Home} 
        to="/"
        active={isActive('/')}
      />
      <NavItem 
        icon={FolderDot} 
        to="/files"
        active={isActive('/files')}
      />
      <NavItem 
        icon={List} 
        to="/tasks"
        active={isActive('/tasks')}
      />
      <NavItem 
        icon={Bell} 
        to="/reminders" 
        active={isActive('/reminders')} 
      />
      <NavItem 
        icon={User} 
        to="/profile" 
        active={isActive('/profile')} 
      />
    </nav>
  );
};

export default Navigation;
