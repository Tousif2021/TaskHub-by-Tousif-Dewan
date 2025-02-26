
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { format, isAfter, isBefore, isToday, parseISO } from "date-fns";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/task";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const TaskPreview = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'today' | 'past'>('upcoming');
  
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("due_date", { ascending: true });
      
      if (error) {
        throw error;
      }
      
      return data.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description || "",
        dueDate: task.due_date,
        dueTime: task.due_time,
        priority: task.priority,
        completed: task.completed || false,
      })) as Task[];
    },
  });
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading tasks...</div>;
  }
  
  if (error) {
    return <div className="text-red-500 p-4">Error loading tasks: {(error as Error).message}</div>;
  }
  
  const today = new Date();
  
  const filteredTasks = tasks.filter(task => {
    const taskDate = parseISO(task.dueDate);
    
    switch(filter) {
      case 'upcoming':
        return isAfter(taskDate, today) && !isToday(taskDate);
      case 'today':
        return isToday(taskDate);
      case 'past':
        return isBefore(taskDate, today) && !isToday(taskDate);
      default:
        return true;
    }
  });
  
  // Group tasks by date
  const groupedTasks = filteredTasks.reduce((groups, task) => {
    if (!groups[task.dueDate]) {
      groups[task.dueDate] = [];
    }
    groups[task.dueDate].push(task);
    return groups;
  }, {} as Record<string, Task[]>);
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 flex items-center border-b">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')}
          className="mr-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Task Preview</h1>
      </header>
      
      <div className="flex-1 p-4 pb-20">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <Button 
            variant={filter === 'all' ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={filter === 'upcoming' ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </Button>
          <Button 
            variant={filter === 'today' ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilter('today')}
          >
            Today
          </Button>
          <Button 
            variant={filter === 'past' ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter('past')}
          >
            Past
          </Button>
        </div>
        
        {Object.keys(groupedTasks).length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No {filter} tasks found
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {Object.entries(groupedTasks).map(([date, tasksForDate]) => (
              <div key={date} className="space-y-2">
                <h3 className="font-medium text-sm text-muted-foreground">
                  {format(parseISO(date), "EEEE, MMMM d, yyyy")}
                </h3>
                <div className="space-y-2">
                  {tasksForDate.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`p-4 rounded-lg border ${
                        task.priority === "High" 
                          ? "border-l-4 border-l-red-500" 
                          : task.priority === "Medium"
                          ? "border-l-4 border-l-yellow-500"
                          : "border-l-4 border-l-green-500"
                      }`}
                      onClick={() => navigate(`/add?id=${task.id}`)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-base">{task.title}</h3>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <div className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                          {task.dueTime}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
      
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-0 left-0 right-0 border-t bg-background"
      >
        <Navigation />
      </motion.div>
    </div>
  );
};

export default TaskPreview;
