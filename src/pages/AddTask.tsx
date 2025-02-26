import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Navigation from "@/components/Navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface TaskFormData {
  title: string;
  description: string;
  date?: Date;
}

const AddTask = () => {
  const [date, setDate] = useState<Date>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>();

  const onSubmit = (data: TaskFormData) => {
    // Save task logic would go here
    console.log({ ...data, date });
    toast.success("Task added successfully!");
    reset();
    setDate(undefined);
  };

  return (
    <motion.div 
      className="min-h-screen p-6 pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <header className="mb-8">
        <motion.h1 
          className="text-2xl font-bold text-primary"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Add New Task
        </motion.h1>
      </header>

      <motion.form 
        onSubmit={handleSubmit(onSubmit)} 
        className="space-y-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
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
                className={cn(
                  "w-full justify-start text-left font-normal bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm",
                  !date && "text-muted-foreground"
                )}
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
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          Add Task
        </Button>
      </motion.form>

      <Navigation showBackButton={true} />
    </motion.div>
  );
};

export default AddTask;