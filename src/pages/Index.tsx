
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FileText, 
  FolderOpen, 
  ChevronRight,
  CheckCircle,
  CheckSquare,
  CalendarClock,
  Calendar,
  Clock,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { format, isToday, isBefore, addDays } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// MenuItem component
const MenuItem = ({ to, icon: Icon, title, description, color }) => {
  const navigate = useNavigate();
  
  return (
    <Card 
      className="group relative overflow-hidden transition-all hover:shadow-md cursor-pointer"
      onClick={() => navigate(to)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className={`rounded-full p-2 ${color}`}>
            <Icon className="h-4 w-4" />
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </div>
        <div className="mt-3">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

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

  // Get today's tasks
  const todayTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    return isToday(taskDate);
  }).slice(0, 3);

  // Get upcoming tasks
  const upcomingTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    const today = new Date();
    return (
      !isToday(taskDate) && 
      (isBefore(today, taskDate) && isBefore(taskDate, addDays(today, 7)));
    })
    .slice(0, 3);

  const completedTasksCount = tasks.filter(task => task.completed).length;
  const totalTasksCount = tasks.length;
  const completionRate = totalTasksCount > 0 
    ? Math.round((completedTasksCount / totalTasksCount) * 100) 
    : 0;

  // Dashboard stats
  const stats = [
    { 
      title: "Completion Rate", 
      value: `${completionRate}%`, 
      icon: CheckCircle,
      description: `${completedTasksCount} / ${totalTasksCount} tasks completed`,
      color: "text-green-500"
    },
    { 
      title: "Today's Tasks", 
      value: todayTasks.length.toString(), 
      icon: Calendar,
      description: "Tasks due today",
      color: "text-blue-500"
    },
    { 
      title: "Upcoming Tasks", 
      value: upcomingTasks.length.toString(), 
      icon: Clock,
      description: "Due in the next 7 days",
      color: "text-orange-500"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="container pb-20"
    >
      <header className="py-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your personal task management system
        </p>
      </header>

      <section>
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={cn("h-4 w-4", stat.color)} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground pt-1">
                  {stat.description}
                </p>
                {stat.title === "Completion Rate" && (
                  <Progress 
                    value={completionRate} 
                    className="h-2 mt-2" 
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <MenuItem 
            to="/files"
            icon={FolderOpen}
            title="Files"
            description="Manage your documents & media"
            color="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          />

          <MenuItem 
            to="/add"
            icon={Plus}
            title="Add Task"
            description="Create a new task or reminder"
            color="bg-purple-500/10 text-purple-600 dark:text-purple-400"
          />

          <MenuItem 
            to="/reminders"
            icon={CalendarClock}
            title="Reminders"
            description="View your scheduled reminders"
            color="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          />
        </div>
      </section>

      {(todayTasks.length > 0 || upcomingTasks.length > 0) && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Task Overview</h2>
          
          {todayTasks.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                Today's Tasks
              </h3>
              <div className="space-y-3">
                {todayTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}
          
          {upcomingTasks.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-orange-500" />
                Upcoming Tasks
              </h3>
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {files.length > 0 && (
        <section className="mt-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Files</h2>
            <Button 
              variant="ghost" 
              className="text-sm"
              onClick={() => navigate("/files")}
            >
              View all
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {files.slice(0, 3).map((file) => (
              <FileItem key={file.id} file={file} />
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}

const TaskItem = ({ task }) => {
  const priorityColors = {
    Low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    Medium: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    High: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div 
              className={cn(
                "mt-0.5 rounded-full p-1", 
                task.completed 
                  ? "bg-green-500/20 text-green-600" 
                  : "bg-gray-200 text-gray-500"
              )}
            >
              <CheckSquare className="h-4 w-4" />
            </div>
            <div>
              <h4 className={cn(
                "font-medium",
                task.completed && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h4>
              {task.description && (
                <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                  {task.description}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Badge className={priorityColors[task.priority]}>
              {task.priority}
            </Badge>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(task.dueDate), "MMM d")}
                    {task.dueTime && `, ${task.dueTime}`}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  Due date
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const FileItem = ({ file }) => {
  const navigate = useNavigate();
  const fileTypeIcons = {
    pdf: "bg-red-100 text-red-800",
    doc: "bg-blue-100 text-blue-800",
    docx: "bg-blue-100 text-blue-800",
    xls: "bg-green-100 text-green-800",
    xlsx: "bg-green-100 text-green-800",
    jpg: "bg-purple-100 text-purple-800",
    jpeg: "bg-purple-100 text-purple-800",
    png: "bg-purple-100 text-purple-800",
  };
  
  const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
  };
  
  const extension = getFileExtension(file.name);
  const fileTypeClass = fileTypeIcons[extension] || "bg-gray-100 text-gray-800";
  
  return (
    <Card 
      className="overflow-hidden hover:shadow-md cursor-pointer"
      onClick={() => navigate(`/files/${file.id}`)}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className={`rounded p-1.5 ${fileTypeClass}`}>
            <FileText className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate">{file.name}</h4>
            <p className="text-xs text-muted-foreground">
              {format(new Date(file.created_at), "MMM d, yyyy")}
              {file.size && ` • ${Math.round(file.size / 1024)} KB`}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
};
