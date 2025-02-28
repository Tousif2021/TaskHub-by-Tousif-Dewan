
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, CalendarIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/hooks/use-toast";

const AddTask = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create tasks",
        variant: "destructive"
      });
      return;
    }
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive"
      });
      return;
    }
    
    if (!date) {
      toast({
        title: "Error",
        description: "Due date is required",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format the date as YYYY-MM-DD for Supabase
      const formattedDate = format(date, "yyyy-MM-dd");
      
      // Default time to noon if not specified
      const formattedTime = "12:00:00";
      
      // Make sure priority is capitalized as per database constraint
      const { error } = await supabase
        .from("tasks")
        .insert([
          {
            title,
            description: details,
            priority, // Now using capitalized values: "Low", "Medium", "High"
            due_date: formattedDate,
            due_time: formattedTime,
            user_id: user.id,
            completed: false
          }
        ]);
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Task created successfully",
      });
      
      // Navigate to reminders page to see the task
      navigate("/reminders");
    } catch (error: any) {
      console.error("Error creating task:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create task",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="container mx-auto px-5 py-8 pb-24"
    >
      <div className="mb-8 flex items-center">
        <Link to="/">
          <Button variant="ghost" size="icon" className="mr-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Add New Task</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-base">Task Title</Label>
          <Input
            id="title"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="h-12 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-accent/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="details" className="text-base">Task Details</Label>
          <Textarea
            id="details"
            placeholder="Enter task details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="min-h-[120px] border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-accent/20"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-base">Priority Level</Label>
          <RadioGroup value={priority} onValueChange={setPriority} className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Low" id="low" className="text-green-600" />
              <Label htmlFor="low" className="text-green-600 font-medium">Low</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Medium" id="medium" className="text-yellow-600" />
              <Label htmlFor="medium" className="text-yellow-600 font-medium">Medium</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="High" id="high" className="text-red-600" />
              <Label htmlFor="high" className="text-red-600 font-medium">High</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label className="text-base">Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-12 border-gray-200 dark:border-gray-700",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-gray-200 dark:border-gray-700 shadow-lg">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="rounded-md"
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 text-base font-medium hover:scale-[1.02] transition-transform bg-accent"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Task"}
        </Button>
      </form>
    </motion.div>
  );
};

export default AddTask;
