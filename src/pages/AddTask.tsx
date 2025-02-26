
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Flag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";

const AddTask = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get the current user's session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error("Please login to create tasks");
      }

      if (!session) {
        throw new Error("Please login to create tasks");
      }

      const { error: insertError } = await supabase
        .from("tasks")
        .insert({
          title,
          description,
          due_date: dueDate,
          due_time: dueTime,
          priority,
          user_id: session.user.id,
          completed: false
        });

      if (insertError) {
        console.error("Insert error:", insertError);
        throw new Error(insertError.message);
      }

      toast.success("Task created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary pb-20">
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-fade-down">
          <h1 className="text-3xl font-semibold text-primary">Add New Task</h1>
          <p className="text-primary/60 mt-2">Create a new task with details</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-primary mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-primary/20 focus:outline-none focus:ring-2 focus:ring-accent/50"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-primary mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-primary/20 focus:outline-none focus:ring-2 focus:ring-accent/50"
              placeholder="Enter task description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-primary mb-2">
                Due Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
                <input
                  type="date"
                  id="dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-2 rounded-lg border border-primary/20 focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="dueTime" className="block text-sm font-medium text-primary mb-2">
                Due Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
                <input
                  type="time"
                  id="dueTime"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-2 rounded-lg border border-primary/20 focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Priority
            </label>
            <div className="flex gap-4">
              {["Low", "Medium", "High"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p as "Low" | "Medium" | "High")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    priority === p
                      ? "bg-accent text-white border-accent"
                      : "border-primary/20 text-primary hover:border-accent"
                  }`}
                >
                  <Flag className="w-4 h-4" />
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-2 rounded-lg border border-primary/20 text-primary hover:bg-primary/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
      <Navigation />
    </div>
  );
};

export default AddTask;
