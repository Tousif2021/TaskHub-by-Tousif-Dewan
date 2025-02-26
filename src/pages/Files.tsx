import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";

const Files = () => {
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
          My Files
        </motion.h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Your files content here */}
        <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm animate-fade-up">
          No files yet
        </div>
      </div>

      <Navigation showBackButton={true} />
    </motion.div>
  );
};

export default Files;