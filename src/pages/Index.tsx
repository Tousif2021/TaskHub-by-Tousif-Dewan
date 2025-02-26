
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format, isBefore, isToday, addDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, Clock, FileText } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("due_date", { ascending: true })
        .order("due_time", { ascending: true });

      if (error) throw error;
      
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

  const { data: files = [] } = useQuery({
    queryKey: ["files"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("files")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      
      return data || [];
    },
  });

  const today = new Date();
  const upcomingTasks = tasks
    .filter(task => !task.completed)
    .filter(task => {
      const taskDate = new Date(task.dueDate);
      return isToday(taskDate) || 
        (isBefore(today, taskDate) && isBefore(taskDate, addDays(today, 7)));
    })
    .slice(0, 3);
    
  const completedTasksCount = tasks.filter(task => task.completed).length;
  const totalTasksCount = tasks.length;
  const completionRate = totalTasksCount > 0 
    ? Math.round((completedTasksCount / totalTasksCount) * 100) 
    : 0;

  return (
    <div className="min-h-screen p-6 pb-20">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's an overview of your tasks and files.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Task Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span>Total Tasks</span>
              <span className="font-medium">{totalTasksCount}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>Completed</span>
              <span className="font-medium">{completedTasksCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Completion Rate</span>
              <span className="font-medium">{completionRate}%</span>
            </div>
            <div className="w-full bg-secondary/30 rounded-full h-2.5 mt-4">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Files Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span>Total Files</span>
              <span className="font-medium">{files.length}</span>
            </div>
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => navigate('/files')}
              >
                <span>Manage Files</span>
                <FileText className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Upcoming Tasks</h2>
          <Button 
            variant="ghost" 
            className="text-primary"
            onClick={() => navigate('/task-preview')}
          >
            View all
          </Button>
        </div>

        {upcomingTasks.length === 0 ? (
          <div className="bg-secondary/20 rounded-lg p-4 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-muted-foreground">No upcoming tasks for the next 7 days. Good job!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingTasks.map(task => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium mb-1">{task.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{format(new Date(task.dueDate), "MMM d, yyyy")}</span>
                        </div>
                        {task.dueTime && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{task.dueTime}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                      task.priority === 'High' ? 'bg-red-500' : 
                      task.priority === 'Medium' ? 'bg-yellow-500' : 
                      'bg-green-500'
                    }`}>
                      {task.priority}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Files</h2>
          <Button 
            variant="ghost" 
            className="text-primary"
            onClick={() => navigate('/files')}
          >
            View all
          </Button>
        </div>

        {files.length === 0 ? (
          <div className="bg-secondary/20 rounded-lg p-4 text-center">
            <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">No files uploaded yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {files.slice(0, 3).map(file => (
              <div 
                key={file.id} 
                className="flex items-center p-3 rounded-lg border hover:bg-secondary/10 transition-colors cursor-pointer"
                onClick={() => navigate('/files')}
              >
                <div className="w-10 h-10 rounded bg-secondary/30 flex items-center justify-center mr-3">
                  {file.type.includes('image') ? '🖼️' : 
                   file.type.includes('pdf') ? '📄' :
                   file.type.includes('document') ? '📝' : '📁'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB · {format(new Date(file.created_at), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
