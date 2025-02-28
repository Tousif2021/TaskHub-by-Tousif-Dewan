
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, CalendarIcon, Plus, Check } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const AddTask = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState("Personal");
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Predefined categories
  const categories = ["Work", "Personal", "School", "Health", "Shopping"];

  const handleCategorySelect = (selected: string) => {
    if (selected === "Custom") {
      setShowCustomInput(true);
      setCustomCategory("");
    } else {
      setCategory(selected);
      setShowCustomInput(false);
    }
  };

  const handleCustomCategorySubmit = () => {
    if (customCategory.trim()) {
      setCategory(customCategory.trim());
      setShowCustomInput(false);
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "Work":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "Personal":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "School":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "Health":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Shopping":
        return "bg-pink-100 text-pink-800 hover:bg-pink-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

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
            completed: false,
            category: category
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
          <Label className="text-base">Category</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {showCustomInput ? (
              <div className="flex w-full">
                <Input
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter custom category"
                  className="rounded-r-none border-r-0 h-10"
                />
                <Button 
                  type="button" 
                  onClick={handleCustomCategorySubmit}
                  className="rounded-l-none h-10 bg-accent"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                {categories.map((cat) => (
                  <Badge
                    key={cat}
                    className={cn(
                      "cursor-pointer py-1.5 px-3 text-sm font-medium transition-colors",
                      getCategoryColor(cat),
                      category === cat ? "ring-2 ring-offset-2 ring-accent" : ""
                    )}
                    onClick={() => handleCategorySelect(cat)}
                  >
                    {cat}
                  </Badge>
                ))}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Badge
                      className="cursor-pointer py-1.5 px-3 text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" /> More
                    </Badge>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => handleCategorySelect("Custom")}>
                      Add Custom Category
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
          {!showCustomInput && (
            <div className="text-xs text-muted-foreground">
              Selected: <span className="font-medium">{category}</span>
            </div>
          )}
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
                <CalendarIcon className="mr-2 h-4 w-4 text-accent" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-gray-200 dark:border-gray-700 rounded-lg shadow-xl">
              <div className="p-4 bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] rounded-t-lg border-b border-white/10">
                <h3 className="font-medium text-center text-white text-base">
                  {date ? format(date, "MMMM yyyy") : "Select Date"}
                </h3>
              </div>
              <div className="p-2 bg-gradient-to-b from-[#F1F0FB] to-white dark:from-gray-800 dark:to-gray-900">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="rounded-b-lg"
                />
              </div>
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
