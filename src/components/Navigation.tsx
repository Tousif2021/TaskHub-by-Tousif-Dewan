
import { Home, FolderDot, Plus, Bell, User, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Navigation = ({ showBackButton = false }: { showBackButton?: boolean }) => {
  const location = useLocation();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {showBackButton ? (
            <Link
              to="/"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-accent hover:text-accent/80 transition-colors duration-200"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
          ) : null}
          
          <NavItem icon={Home} label="Home" to="/" active={location.pathname === "/"} />
          <NavItem icon={FolderDot} label="Files" to="/files" active={location.pathname === "/files"} />
          <NavItem icon={Plus} label="Add" to="/add" active={location.pathname === "/add"} />
          <NavItem icon={Bell} label="Reminders" to="/reminders" active={location.pathname === "/reminders"} />
          <NavItem icon={User} label="Profile" to="/profile" active={location.pathname === "/profile"} />
        </div>
      </div>
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
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Icon className="w-6 h-6" />
    </motion.div>
    <motion.span 
      className="text-xs font-medium"
      animate={{ opacity: active ? 1 : 0.8 }}
      transition={{ duration: 0.2 }}
    >
      {label}
    </motion.span>
  </Link>
);

export default Navigation;
