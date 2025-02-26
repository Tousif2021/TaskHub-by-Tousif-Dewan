
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar, Clock, Flag, Printer, Edit, Trash2, Check } from "lucide-react";
import { Task } from "@/types/task";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const TaskList = () => {
  const [showCompleted, setShowCompleted] = useState(false);

  const { data: tasks = [], refetch } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("due_date", { ascending: true })
        .order("due_time", { ascending: true });

      if (error) throw error;
      
      // Map the database response to our Task interface
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

  const handleComplete = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ completed })
        .eq("id", taskId);

      if (error) throw error;
      refetch();
      toast.success(completed ? "Task completed!" : "Task uncompleted");
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
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredTasks = tasks.filter((task) => task.completed === showCompleted);
  const groupedTasks = filteredTasks.reduce((groups, task) => {
    const date = task.dueDate;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
    return groups;
  }, {} as Record<string, Task[]>);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <div className="animate-fade-down">
        <h2 className="text-3xl font-semibold text-primary mb-2">Tasks</h2>
        <p className="text-primary/60">Manage your daily tasks efficiently</p>
      </div>
      
      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className="text-primary hover:text-accent transition-colors"
        >
          Show {showCompleted ? "active" : "completed"} tasks
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/20 text-primary hover:bg-primary/5 transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print List
        </button>
      </div>
      
      <div className="grid gap-8">
        {Object.entries(groupedTasks).map(([date, dateTasks]) => (
          <div key={date} className="space-y-4">
            <h3 className="text-lg font-medium text-primary">
              {format(new Date(date), "EEEE, MMMM d, yyyy")}
            </h3>
            <div className="grid gap-4">
              {dateTasks.map((task) => (
                <div
                  key={task.id}
                  className="group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 animate-fade-up"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-primary">{task.title}</h3>
                      <p className="text-primary/60">{task.description}</p>
                      <div className="flex gap-4 text-sm text-primary/60">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(task.dueDate), "MMM dd, yyyy")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {task.dueTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <Flag className="w-4 h-4" />
                          {task.priority}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleComplete(task.id, !task.completed)}
                        className={`p-2 rounded-full ${
                          task.completed
                            ? "bg-accent/10 text-accent"
                            : "bg-primary/10 text-primary"
                        } hover:bg-accent/20 transition-colors`}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {}} // Edit functionality coming soon
                        className="p-2 text-primary/40 hover:text-accent transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="p-2 text-primary/40 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {filteredTasks.length === 0 && (
          <div className="text-center py-12 bg-white/50 rounded-lg animate-fade-up">
            <p className="text-primary/60">
              {showCompleted
                ? "No completed tasks yet"
                : "No active tasks. Create your first task to get started!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
