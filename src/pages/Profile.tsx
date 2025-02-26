import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, LogOut, Moon, Sun, UserCircle } from "lucide-react";

const Profile = () => {
  return (
    <motion.div 
      className="min-h-screen p-6 pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <header className="mb-8">
        <motion.h1 
          className="text-2xl font-bold text-primary"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          My Profile
        </motion.h1>
      </header>

      <motion.div 
        className="flex flex-col items-center gap-4 mb-8"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Avatar className="w-24 h-24 border-4 border-accent/20">
          <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
          <AvatarFallback className="bg-accent/10 text-accent-foreground text-xl">
            <UserCircle className="w-12 h-12" />
          </AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold">John Doe</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">john.doe@example.com</p>
      </motion.div>

      <motion.div 
        className="space-y-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <Button variant="ghost" className="w-full justify-start py-6 h-auto">
              <Settings className="mr-3 h-5 w-5 text-gray-500" />
              <span>Settings</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start py-6 h-auto">
              <Moon className="mr-3 h-5 w-5 text-gray-500" />
              <span>Dark Mode</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start py-6 h-auto text-red-500 hover:text-red-600 hover:bg-red-50/50 dark:hover:bg-red-900/20">
              <LogOut className="mr-3 h-5 w-5" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </motion.div>

      <Navigation showBackButton={true} />
    </motion.div>
  );
};

export default Profile;