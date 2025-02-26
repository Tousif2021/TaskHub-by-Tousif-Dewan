import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { format, isAfter, isBefore, isToday, addDays } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Clock, Calendar } from "lucide-react";

// Mock data structure
interface Reminder {
  id: string;
  title: string;
  description: string;
  date: Date;
  completed: boolean;
}

// For demo, using mock data
const mockReminders: Reminder[] = [
  {
    id: "1",
    title: "Project Deadline",
    description: "Complete the final report",
    date: addDays(new Date(), 2),
    completed: false,
  },
  {
    id: "2",
    title: "Team Meeting",
    description: "Weekly sprint planning",
    date: addDays(new Date(), 1),
    completed: false,
  },
  {
    id: "3",
    title: "Doctor Appointment",
    description: "Annual check-up",
    date: addDays(new Date(), 5),
    completed: false,
  },
  {
    id: "4",
    title: "Past Due Task",
    description: "This task is overdue",
    date: addDays(new Date(), -2),
    completed: false,
  },
  {
    id: "5",
    title: "Today's Task",
    description: "Due today",
    date: new Date(),
    completed: false,
  },
];

import { motion } from "framer-motion";

const Reminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders);
  const [filter, setFilter] = useState<"all" | "today" | "upcoming" | "overdue">("all");

  const toggleComplete = (id: string) => {
    setReminders(
      reminders.map((reminder) =>
        reminder.id === id
          ? { ...reminder, completed: !reminder.completed }
          : reminder
      )
    );
  };

  const filteredReminders = reminders.filter((reminder) => {
    if (filter === "all") return true;
    if (filter === "today") return isToday(reminder.date);
    if (filter === "upcoming") return isAfter(reminder.date, new Date()) && !isToday(reminder.date);
    if (filter === "overdue") return isBefore(reminder.date, new Date()) && !isToday(reminder.date);
    return true;
  });

  const getReminderStatus = (date: Date) => {
    if (isToday(date)) return "today";
    if (isBefore(date, new Date())) return "overdue";
    return "upcoming";
  };

  return (
    <motion.div 
      className="min-h-screen p-6 pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <header className="mb-8 border-b pb-4"> {/* Added border-b for visual separation */}
        <motion.h1 
          className="text-2xl font-bold text-primary flex items-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <button onClick={() => {/* Add navigation logic here */}}>Back</button> {/* Added back button */}
          <span className="ml-2">Reminders</span>
        </motion.h1>
      </header>

      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["all", "today", "upcoming", "overdue"].map((option) => (
            <motion.button
              key={option}
              onClick={() => setFilter(option as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                filter === option
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary/50 text-secondary-foreground hover:bg-secondary/80"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {filteredReminders.length > 0 ? (
          <motion.div className="space-y-4">
            {filteredReminders.map((reminder, index) => {
              const status = getReminderStatus(reminder.date);

              return (
                <motion.div
                  key={reminder.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`p-4 rounded-lg border ${
                    reminder.completed
                      ? "border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20"
                      : status === "overdue"
                      ? "border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10"
                      : status === "today"
                      ? "border-amber-200 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-900/10"
                      : "border-green-200 dark:border-green-900/30 bg-green-50/50 dark:bg-green-900/10"
                  } backdrop-blur-sm`}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      onClick={() => toggleComplete(reminder.id)}
                      className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full cursor-pointer flex items-center justify-center ${
                        reminder.completed
                          ? "bg-accent text-accent-foreground"
                          : "border-2 border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {reminder.completed && <Check className="w-3 h-3" />}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${reminder.completed ? "line-through text-gray-500" : ""}`}>
                        {reminder.title}
                      </h3>
                      <p className={`text-sm ${reminder.completed ? "line-through text-gray-400" : "text-gray-600 dark:text-gray-400"}`}>
                        {reminder.description}
                      </p>
                      <div className="mt-2 flex items-center text-xs">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${
                          status === "overdue"
                            ? "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                            : status === "today"
                            ? "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                            : "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                        }`}>
                          {status === "overdue" ? (
                            <Clock className="w-3 h-3" />
                          ) : (
                            <Calendar className="w-3 h-3" />
                          )}
                          {format(reminder.date, "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-500 dark:text-gray-400"
          >
            No reminders match your filter
          </motion.div>
        )}
      </AnimatePresence>

      <Navigation showBackButton={false} /> {/* Removed showBackButton from Navigation */}
    </motion.div>
  );
};

export default Reminders;