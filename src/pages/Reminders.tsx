
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { format, isAfter, isBefore, isToday, addDays } from "date-fns";
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
    description: "Annual checkup",
    date: addDays(new Date(), -1),
    completed: true,
  },
  {
    id: "4",
    title: "Pay Bills",
    description: "Electricity and water",
    date: new Date(),
    completed: false,
  },
];

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

  const getFilteredReminders = () => {
    return reminders.filter((reminder) => {
      if (filter === "all") return true;
      if (filter === "today") return isToday(reminder.date);
      if (filter === "upcoming") return isAfter(reminder.date, new Date()) && !isToday(reminder.date);
      if (filter === "overdue") return isBefore(reminder.date, new Date()) && !isToday(reminder.date) && !reminder.completed;
      return true;
    });
  };

  const getReminderStatus = (reminder: Reminder) => {
    if (reminder.completed) return "completed";
    if (isBefore(reminder.date, new Date()) && !isToday(reminder.date)) return "overdue";
    if (isToday(reminder.date)) return "today";
    return "upcoming";
  };

  const filteredReminders = getFilteredReminders();

  return (
    <div 
      className="min-h-screen p-6 pb-20"
    >
      <header className="mb-8 border-b pb-4">
        <h1 
          className="text-2xl font-bold text-primary flex items-center"
        >
          <span className="ml-2">Reminders</span>
        </h1>
      </header>

      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["all", "today", "upcoming", "overdue"].map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                filter === option
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary/50 text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredReminders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No reminders found
          </div>
        ) : (
          filteredReminders.map((reminder, index) => {
            const status = getReminderStatus(reminder);
            
            return (
              <div
                key={reminder.id}
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
                    <h3 className={`font-medium ${reminder.completed ? "line-through text-muted-foreground" : ""}`}>
                      {reminder.title}
                    </h3>
                    
                    {reminder.description && (
                      <p className={`text-sm mt-1 ${reminder.completed ? "line-through text-muted-foreground" : "text-muted-foreground"}`}>
                        {reminder.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center text-xs text-muted-foreground gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{format(reminder.date, "MMM d, yyyy")}</span>
                      </div>
                      
                      {status === "today" && !reminder.completed && (
                        <div className="flex items-center text-xs text-amber-500 dark:text-amber-400 gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Today</span>
                        </div>
                      )}
                      
                      {status === "overdue" && (
                        <div className="flex items-center text-xs text-red-500 dark:text-red-400 gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Overdue</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      </div>
  );
};

export default Reminders;
