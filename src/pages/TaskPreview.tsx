import { useNavigate } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { useState } from "react";

// Mock data
const mockTasks = [
  {
    date: "Today",
    tasks: [
      {
        id: "1",
        title: "Finish Project Proposal",
        description: "Complete the first draft of the Q3 marketing proposal",
        dueTime: "10:00 AM",
        completed: false
      },
      {
        id: "2",
        title: "Team Check-in",
        description: "Weekly sync with design and development teams",
        dueTime: "2:30 PM",
        completed: true
      }
    ]
  },
  {
    date: "Tomorrow",
    tasks: [
      {
        id: "3",
        title: "Review Analytics",
        description: "Go through last week's performance metrics",
        dueTime: "11:00 AM",
        completed: false
      }
    ]
  },
  {
    date: "Next Week",
    tasks: [
      {
        id: "4",
        title: "Quarterly Planning",
        description: "Prepare Q4 roadmap and objectives",
        dueTime: "All day",
        completed: false
      },
      {
        id: "5",
        title: "Client Presentation",
        description: "Present the new feature set to ABC Corp",
        dueTime: "3:00 PM",
        completed: false
      }
    ]
  }
];

const TaskPreview = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(mockTasks);

  const toggleTaskCompletion = (taskId: string) => {
    const updatedTasks = tasks.map(dateGroup => ({
      ...dateGroup,
      tasks: dateGroup.tasks.map(task => 
        task.id === taskId ? {...task, completed: !task.completed} : task
      )
    }));

    setTasks(updatedTasks);
  };

  return (
    <div className="min-h-screen p-6 pb-20">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">
          Task Preview
        </h1>
        <Button onClick={() => navigate('/add-task')} variant="outline">
          Add New Task
        </Button>
      </header>

      <div className="space-y-8">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-muted-foreground">No tasks found</h3>
            <p className="text-sm text-muted-foreground mt-2">Create a new task to get started</p>
            <Button onClick={() => navigate('/add-task')} className="mt-4">
              Add Task
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {tasks.map((dateGroup, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">{dateGroup.date}</h2>
                </div>

                <div className="space-y-3">
                  {dateGroup.tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-lg border ${
                        task.completed 
                          ? 'border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20' 
                          : 'border-blue-200 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10'
                      } cursor-pointer`}
                      onClick={() => toggleTaskCompletion(task.id)}
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
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t bg-background">
        <Navigation />
      </div>
    </div>
  );
};

export default TaskPreview;