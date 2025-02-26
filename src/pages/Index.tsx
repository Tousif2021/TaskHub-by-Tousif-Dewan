
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { FolderDot, Plus, Bell, User } from "lucide-react";

const Index = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="min-h-screen p-6 pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <header className="mb-8">
        <motion.h1 
          className="text-2xl font-bold text-primary"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Task Manager
        </motion.h1>
        <motion.p
          className="text-muted-foreground mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Organize your tasks efficiently
        </motion.p>
      </header>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <MenuItem 
          to="/files"
          icon={FolderDot}
          title="Files"
          description="Access your documents"
          color="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          variants={item}
        />
        
        <MenuItem 
          to="/add"
          icon={Plus}
          title="Add Task"
          description="Create a new task"
          color="bg-green-500/10 text-green-600 dark:text-green-400"
          variants={item}
        />
        
        <MenuItem 
          to="/reminders"
          icon={Bell}
          title="Reminders"
          description="Manage your notifications"
          color="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          variants={item}
        />
        
        <MenuItem 
          to="/profile"
          icon={User}
          title="Profile"
          description="View your account"
          color="bg-purple-500/10 text-purple-600 dark:text-purple-400"
          variants={item}
        />
      </motion.div>

      <Navigation />
    </motion.div>
  );
};

interface MenuItemProps {
  to: string;
  icon: any;
  title: string;
  description: string;
  color: string;
  variants: any;
}

const MenuItem = ({ to, icon: Icon, title, description, color, variants }: MenuItemProps) => (
  <motion.div variants={variants}>
    <Link to={to}>
      <motion.div 
        className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-md transition-all duration-300"
        whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        whileTap={{ scale: 0.98 }}
      >
        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center mb-4`}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </motion.div>
    </Link>
  </motion.div>
);

export default Index;
