
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Calendar, Clock, Flag, CheckCircle, Circle, Search, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth-provider";
import { supabase } from "@/integrations/supabase/client";
import { format, isToday, isTomorrow, isThisWeek, isAfter } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  due_date: string;
  due_time: string;
  completed: boolean;
}

const Reminders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tasks from Supabase
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .eq("user_id", user.id)
          .order("due_date", { ascending: true })
          .order("due_time", { ascending: true });
        
        if (error) throw error;
        setTasks(data || []);
        setFilteredTasks(data || []);
      } catch (error: any) {
        console.error("Error fetching tasks:", error);
        toast({
          title: "Error fetching tasks",
          description: error.message || "Could not fetch your tasks",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
  }, [user]);

  // Filter tasks based on search query and selected filter
  useEffect(() => {
    if (!tasks.length) return;
    
    let result = [...tasks];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(query) || 
        (task.description && task.description.toLowerCase().includes(query))
      );
    }
    
    // Apply time filter
    switch (selectedFilter) {
      case "today":
        result = result.filter(task => isToday(new Date(task.due_date)));
        break;
      case "tomorrow":
        result = result.filter(task => isTomorrow(new Date(task.due_date)));
        break;
      case "thisWeek":
        result = result.filter(task => 
          isThisWeek(new Date(task.due_date)) && 
          isAfter(new Date(task.due_date), new Date())
        );
        break;
      case "completed":
        result = result.filter(task => task.completed);
        break;
      case "pending":
        result = result.filter(task => !task.completed);
        break;
      // "all" filter doesn't need special handling
    }
    
    setFilteredTasks(result);
  }, [searchQuery, selectedFilter, tasks]);

  // Toggle task completion
  const toggleTaskCompletion = async (taskId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ completed: !currentStatus })
        .eq("id", taskId);
      
      if (error) throw error;
      
      // Update local state to reflect the change
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, completed: !currentStatus } : task
      ));
      
      toast({
        title: !currentStatus ? "Task completed" : "Task marked incomplete",
        description: "Task status updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating task:", error);
      toast({
        title: "Error updating task",
        description: error.message || "Could not update task status",
        variant: "destructive"
      });
    }
  };

  // Render priority badge
  const renderPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">High</Badge>;
      case "Medium":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Medium</Badge>;
      case "Low":
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Low</Badge>;
      default:
        return null;
    }
  };

  // Group tasks by date
  const groupTasksByDate = (tasks: Task[]) => {
    const groups: { [key: string]: Task[] } = {};
    
    tasks.forEach(task => {
      const dateStr = task.due_date;
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(task);
    });
    
    return groups;
  };

  // Format date for display
  const formatDateHeading = (dateStr: string) => {
    const date = new Date(dateStr);
    
    if (isToday(date)) {
      return "Today";
    } else if (isTomorrow(date)) {
      return "Tomorrow";
    } else {
      return format(date, "EEEE, MMMM d, yyyy");
    }
  };

  const taskGroups = groupTasksByDate(filteredTasks);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="container mx-auto px-5 py-8 pb-24"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/">
            <Button variant="ghost" size="icon" className="mr-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Reminders</h1>
        </div>
        <Link to="/add">
          <Button variant="default" size="sm" className="gap-1">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </Link>
      </div>

      <div className="mb-6 space-y-4">
        {/* Search box */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search tasks..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("all")}
          >
            All
          </Button>
          <Button
            variant={selectedFilter === "today" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("today")}
          >
            Today
          </Button>
          <Button
            variant={selectedFilter === "tomorrow" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("tomorrow")}
          >
            Tomorrow
          </Button>
          <Button
            variant={selectedFilter === "thisWeek" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("thisWeek")}
          >
            This Week
          </Button>
          <Button
            variant={selectedFilter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("pending")}
          >
            Pending
          </Button>
          <Button
            variant={selectedFilter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("completed")}
          >
            Completed
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50/50 dark:bg-gray-800/20 rounded-lg">
          {searchQuery || selectedFilter !== "all" ? (
            <p className="text-muted-foreground">No tasks match your search or filter.</p>
          ) : (
            <div className="space-y-3">
              <p className="text-muted-foreground">You don't have any tasks yet.</p>
              <Link to="/add">
                <Button variant="default" size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Create your first task
                </Button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(taskGroups).map(([date, tasks]) => (
            <div key={date} className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {formatDateHeading(date)}
              </h2>
              <div className="space-y-3">
                {tasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`p-4 rounded-lg border ${task.completed 
                      ? "bg-gray-50/70 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700" 
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm"}`}
                  >
                    <div className="flex items-start gap-3">
                      <button 
                        onClick={() => toggleTaskCompletion(task.id, task.completed)}
                        className="mt-0.5 flex-shrink-0 text-gray-400 hover:text-accent transition-colors"
                      >
                        {task.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </button>
                      
                      <div className="flex-1 space-y-2">
                        <div className={`flex items-start justify-between ${task.completed ? "text-gray-500 dark:text-gray-400" : ""}`}>
                          <h3 className={`font-medium ${task.completed ? "line-through" : ""}`}>
                            {task.title}
                          </h3>
                          {renderPriorityBadge(task.priority)}
                        </div>
                        
                        {task.description && (
                          <p className={`text-sm text-gray-600 dark:text-gray-400 ${task.completed ? "line-through opacity-70" : ""}`}>
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {format(new Date(task.due_date), "MMM d, yyyy")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {task.due_time ? format(new Date(`2000-01-01T${task.due_time}`), "h:mm a") : "No time"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Reminders;
