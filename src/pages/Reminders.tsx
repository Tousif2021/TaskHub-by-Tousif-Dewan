
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { format, isAfter, isBefore, isToday, addDays } from "date-fns";
import { Check, Clock, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Interface for reminder structure
interface Reminder {
  id: string;
  title: string;
  description: string;
  date: Date;
  completed: boolean;
}

const Reminders = () => {
  const [filter, setFilter] = useState<"all" | "today" | "upcoming" | "overdue">("all");

  // Convert tasks to reminders format
  const { data: reminders = [], isLoading, refetch } = useQuery({
    queryKey: ["reminders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("due_date", { ascending: true });

      if (error) throw error;
      
      return (data || []).map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description || "",
        date: new Date(task.due_date),
        completed: task.completed || false,
      }));
    },
  });

  const toggleComplete = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ completed })
        .eq("id", id);

      if (error) throw error;
      refetch();
      toast.success(completed ? "Reminder completed!" : "Reminder uncompleted");
    } catch (error) {
      console.error("Error updating reminder:", error);
      toast.error("Failed to update reminder");
    }
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
      className="min-h-screen p-8 pb-24"
    >
      <header className="mb-8 border-b pb-4 border-gray-200 dark:border-gray-800">
        <h1 
          className="text-2xl font-bold text-primary flex items-center"
        >
          <span>Reminders</span>
        </h1>
      </header>

      <div className="mb-6">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {["all", "today", "upcoming", "overdue"].map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option as any)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === option
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "bg-secondary/50 text-secondary-foreground hover:bg-secondary"
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 max-w-3xl mx-auto">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading reminders...
          </div>
        ) : filteredReminders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No reminders found
          </div>
        ) : (
          filteredReminders.map((reminder) => {
            const status = getReminderStatus(reminder);
            
            return (
              <div
                key={reminder.id}
                className={`p-5 rounded-lg border ${
                  reminder.completed
                    ? "border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20"
                    : status === "overdue"
                    ? "border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10"
                    : status === "today"
                    ? "border-amber-200 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-900/10"
                    : "border-green-200 dark:border-green-900/30 bg-green-50/50 dark:bg-green-900/10"
                } backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300`}
              >
                <div className="flex items-start gap-4">
                  <div 
                    onClick={() => toggleComplete(reminder.id, !reminder.completed)}
                    className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full cursor-pointer flex items-center justify-center transition-colors ${
                      reminder.completed
                        ? "bg-accent text-accent-foreground shadow-sm"
                        : "border-2 border-gray-300 dark:border-gray-600 hover:border-accent"
                    }`}
                  >
                    {reminder.completed && <Check className="w-3 h-3" />}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`font-bold text-base ${reminder.completed ? "line-through text-muted-foreground" : ""}`}>
                      {reminder.title}
                    </h3>
                    
                    {reminder.description && (
                      <p className={`text-sm mt-2 ${reminder.completed ? "line-through text-muted-foreground" : "text-muted-foreground"}`}>
                        {reminder.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center text-xs text-muted-foreground gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{format(reminder.date, "MMM d, yyyy")}</span>
                      </div>
                      
                      {status === "today" && !reminder.completed && (
                        <div className="flex items-center text-xs text-amber-500 dark:text-amber-400 gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Today</span>
                        </div>
                      )}
                      
                      {status === "overdue" && (
                        <div className="flex items-center text-xs text-red-500 dark:text-red-400 gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5" />
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
