import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Navigation from "@/components/Navigation";

interface TaskFormData {
  title: string;
  description: string;
  date?: Date;
}

const AddTask = () => {
  const [date, setDate] = useState<Date>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>();

  const onSubmit = (data: TaskFormData) => {
    // Here you would normally send data to your backend/API
    console.log({ ...data, date });

    // Show success message
    toast.success("Task added successfully!");

    // Navigate back to tasks overview
    navigate("/task-preview");
  };

  return (
    <div 
      className="min-h-screen p-6 pb-20"
    >
      <header className="mb-8">
        <h1 
          className="text-2xl font-bold text-primary"
        >
          Add New Task
        </h1>
      </header>

      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="space-y-6"
      >
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Task Title
          </label>
          <Input
            id="title"
            placeholder="Enter task title"
            {...register("title", { required: "Title is required" })}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <Textarea
            id="description"
            placeholder="Enter task description"
            {...register("description")}
            className="min-h-24 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Due Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button 
          type="submit" 
          className="w-full"
        >
          Add Task
        </Button>
      </form>

      <Navigation />
    </div>
  );
};

export default AddTask;