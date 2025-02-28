
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useReactToPrint } from "react-to-print";
import { ChevronLeft, Printer, Search, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  details: string;
  date: string;
  priority: string;
  category: string;
}

// Define the task type as it comes from the database
interface TaskFromDB {
  id: string;
  title: string;
  description: string | null;
  due_date: string;
  due_time: string;
  priority: string;
  completed: boolean | null;
  user_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  category: string | null;
}

const TaskPreview = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const printRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Properly configure the print hook
  const handlePrint = useReactToPrint({
    documentTitle: "Task List",
    // Use contentRef instead of content
    contentRef: printRef,
    onAfterPrint: () => {
      console.log("Print completed successfully");
    },
  });

  // Create a separate handler function to use with the button's onClick
  const onPrintButtonClick = () => {
    if (printRef.current) {
      handlePrint();
    } else {
      toast({
        title: "Print Error",
        description: "Unable to print the task list. Please try again.",
        variant: "destructive"
      });
    }
  };

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["task-preview"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .order("due_date", { ascending: true });

        if (error) {
          console.error("Error fetching tasks:", error);
          toast({
            title: "Error fetching tasks",
            description: error.message,
            variant: "destructive"
          });
          throw error;
        }
        
        console.log("Fetched tasks:", data);
        
        return (data || []).map((task: TaskFromDB) => ({
          id: task.id,
          title: task.title,
          details: task.description || "",
          date: task.due_date,
          priority: task.priority.toLowerCase(),
          category: task.category || "Personal",
        }));
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        return [];
      }
    },
    // Refresh data every 10 seconds
    refetchInterval: 10000,
    // Always fetch fresh data when component mounts
    refetchOnMount: true,
    // Refresh when window regains focus
    refetchOnWindowFocus: true,
  });

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300 font-medium";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300 font-medium";
      case "low":
        return "bg-green-100 text-green-800 border-green-300 font-medium";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300 font-medium";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Work":
        return "bg-blue-100 text-blue-800";
      case "Personal":
        return "bg-purple-100 text-purple-800";
      case "School":
        return "bg-amber-100 text-amber-800";
      case "Health":
        return "bg-green-100 text-green-800";
      case "Shopping":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="container mx-auto px-5 py-8 pb-24"
    >
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <Button variant="ghost" size="icon" className="mr-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Task List</h1>
        </div>
        <div className="flex gap-2">
          <Link to="/add">
            <Button 
              variant="default" 
              size="sm" 
              className="h-9 mr-1 gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onPrintButtonClick}
            className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Printer className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="pl-10 h-12 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-accent/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div ref={printRef} className="space-y-4 mt-6 max-w-3xl mx-auto">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading tasks...
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-8 flex flex-col items-center">
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "No tasks found. Try a different search term." : "No tasks found. Add your first task!"}
            </p>
            {!searchTerm && (
              <Link to="/add">
                <Button 
                  variant="default" 
                  className="gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add New Task
                </Button>
              </Link>
            )}
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div 
              key={task.id} 
              className="p-5 rounded-lg card-glass hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold">{task.title}</h3>
                <div className="flex gap-2">
                  <Badge className={getCategoryColor(task.category)}>
                    {task.category}
                  </Badge>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{task.details}</p>
              <div className="text-xs text-muted-foreground">
                Due: {new Date(task.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default TaskPreview;
