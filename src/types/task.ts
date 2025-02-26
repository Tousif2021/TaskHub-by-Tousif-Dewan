
export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  priority: "Low" | "Medium" | "High";
  completed: boolean;
}
