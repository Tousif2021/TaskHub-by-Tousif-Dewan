
import { useState } from "react";
import { Task } from "@/types/task";
import { format } from "date-fns";
import { Calendar, Clock, Flag } from "lucide-react";

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <div className="animate-fade-down">
        <h2 className="text-3xl font-semibold text-primary mb-2">Tasks</h2>
        <p className="text-primary/60">Manage your daily tasks efficiently</p>
      </div>
      
      <div className="grid gap-4">
        {tasks.length === 0 ? (
          <div className="text-center py-12 bg-secondary/50 rounded-lg animate-fade-up">
            <p className="text-primary/60">No tasks yet. Create your first task to get started!</p>
          </div>
        ) : (
          tasks.map((task) => (
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
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      // Handle edit
                    }}
                    className="text-primary/60 hover:text-accent transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
