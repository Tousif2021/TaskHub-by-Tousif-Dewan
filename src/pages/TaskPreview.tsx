
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar, Clock, Flag, ChevronLeft, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TaskPreview() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "active">("all");
  
  const { data: tasks = [], refetch, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("due_date", { ascending: true })
        .order("due_time", { ascending: true });

      if (error) throw error;
      
      // Map the database response to Task interface
      return (data || []).map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description || "",
        dueDate: item.due_date,
        dueTime: item.due_time,
        priority: item.priority as "Low" | "Medium" | "High",
        completed: item.completed || false,
      }));
    },
  });

  const filteredTasks = tasks.filter(task => {
    if (filterStatus === "all") return true;
    if (filterStatus === "completed") return task.completed;
    if (filterStatus === "active") return !task.completed;
    return true;
  });

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ completed: !completed })
        .eq("id", taskId);

      if (error) throw error;
      refetch();
      toast.success(!completed ? "Task completed!" : "Task marked as active");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

      if (error) throw error;
      refetch();
      toast.success("Task deleted");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-green-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="min-h-screen p-6 pb-20">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-primary">Task Preview</h1>
        </div>
        <Select 
          value={filterStatus} 
          onValueChange={(value: "all" | "completed" | "active") => setFilterStatus(value)}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full"></div>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <div className="h-12 w-12 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
            <Calendar className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No tasks found</h3>
          <p className="text-muted-foreground mb-4">
            {filterStatus === "all" 
              ? "Start by adding your first task!" 
              : `No ${filterStatus} tasks found.`}
          </p>
          <Button onClick={() => navigate("/add-task")} className="bg-primary text-white hover:bg-primary/90">
            Add New Task
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <Card 
              key={task.id} 
              className={`transition-opacity ${task.completed ? 'opacity-60' : ''}`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className={task.completed ? "line-through text-muted-foreground" : ""}>
                    {task.title}
                  </CardTitle>
                  <Badge className={`${getPriorityColor(task.priority)} text-white`}>
                    {task.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                {task.description && (
                  <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                )}
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{format(new Date(task.dueDate), "MMM d, yyyy")}</span>
                  </div>
                  {task.dueTime && (
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{task.dueTime}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 pt-0 border-t px-6 py-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleComplete(task.id, task.completed)}
                >
                  <Check className={`h-4 w-4 mr-1 ${task.completed ? "text-green-500" : ""}`} />
                  {task.completed ? "Completed" : "Mark Complete"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(task.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
