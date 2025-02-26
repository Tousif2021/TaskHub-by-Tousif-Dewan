
import { Home, FolderDot, Plus, Bell, User } from "lucide-react";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200 animate-slide-in">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          <NavItem icon={Home} label="Home" to="/" />
          <NavItem icon={FolderDot} label="Files" to="/files" />
          <NavItem icon={Plus} label="Add" to="/add" />
          <NavItem icon={Bell} label="Reminders" to="/reminders" />
          <NavItem icon={User} label="Profile" to="/profile" />
        </div>
      </div>
    </nav>
  );
};

const NavItem = ({ 
  icon: Icon, 
  label, 
  to 
}: { 
  icon: any; 
  label: string; 
  to: string;
}) => (
  <Link
    to={to}
    className="flex flex-col items-center gap-1 text-primary/60 hover:text-accent transition-colors duration-200"
  >
    <Icon className="w-6 h-6" />
    <span className="text-xs">{label}</span>
  </Link>
);

export default Navigation;
