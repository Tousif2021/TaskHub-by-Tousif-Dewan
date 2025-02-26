import { useNavigate } from "react-router-dom";
import { ChevronLeft, Camera, Edit, Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import Navigation from "@/components/Navigation";

const Profile = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen pb-20">
      <div className="p-4 space-y-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="flex flex-col items-center space-y-3 mb-8">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src="https://github.com/shadcn.png" alt="Profile picture" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Button 
              variant="secondary" 
              size="icon" 
              className="absolute bottom-0 right-0 rounded-full h-8 w-8"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold">Jane Doe</h1>
            <p className="text-sm text-muted-foreground">Product Designer</p>
          </div>
          <Button variant="outline" size="sm" className="gap-1">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {theme === 'dark' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
              <span>Dark Mode</span>
            </div>
            <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Full Name</p>
                <p className="text-primary">Jane Doe</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Email</p>
                <p className="text-primary">jane.doe@example.com</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Joined</p>
                <p className="text-primary">April 2023</p>
              </div>
            </div>
          </div>
        </div>

        <Button 
          variant="destructive" 
          className="w-full"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Profile;