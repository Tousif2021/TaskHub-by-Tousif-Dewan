
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Camera, Edit, Moon, Sun, LogOut, Check, X } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const { user, profile, signOut } = useAuth();

  // Profile data state
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    organization: "",
    joinedAt: ""
  });
  
  // Temporary state for editing
  const [editData, setEditData] = useState({...profileData});

  // Update profile data when auth profile loads
  useEffect(() => {
    if (profile && user) {
      const formattedDate = new Date(profile.joined_at || user.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      });
      
      setProfileData({
        fullName: profile.full_name || 'Anonymous User',
        email: user.email || '',
        organization: profile.organization || '',
        joinedAt: formattedDate
      });
      
      setEditData({
        fullName: profile.full_name || 'Anonymous User',
        email: user.email || '',
        organization: profile.organization || '',
        joinedAt: formattedDate
      });
    }
  }, [profile, user]);

  // Handle edit toggle
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing, revert changes
      setEditData({...profileData});
    }
    setIsEditing(!isEditing);
  };

  // Handle save profile
  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editData.fullName,
          organization: editData.organization,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);
      
      if (error) throw error;
      
      setProfileData({...editData});
      setIsEditing(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "There was an error updating your profile.",
        variant: "destructive",
      });
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!profileData.fullName) return "U";
    return profileData.fullName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen pb-16 bg-white/50 dark:bg-slate-900/50">
      <div className="p-4 space-y-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="flex flex-col items-center space-y-2 mb-3">
          <div className="relative">
            <Avatar className="h-20 w-20 border-2 border-white dark:border-gray-800 shadow-md">
              <AvatarImage src={profile?.avatar_url || ""} alt="Profile picture" />
              <AvatarFallback className="text-lg bg-accent/10 text-accent">{getInitials()}</AvatarFallback>
            </Avatar>
            <Button 
              variant="secondary" 
              size="icon" 
              className="absolute bottom-0 right-0 rounded-full h-7 w-7 shadow-sm hover:scale-105 transition-transform"
            >
              <Camera className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-lg font-bold">{profileData.fullName}</h1>
            <p className="text-xs text-muted-foreground">Task Manager User</p>
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1 h-8 text-xs hover:bg-accent hover:text-white transition-colors" onClick={handleSaveProfile}>
                <Check className="h-3.5 w-3.5" />
                Save
              </Button>
              <Button variant="outline" size="sm" className="gap-1 h-8 text-xs hover:bg-red-500 hover:text-white transition-colors" onClick={handleEditToggle}>
                <X className="h-3.5 w-3.5" />
                Cancel
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" className="gap-1 h-8 text-xs hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={handleEditToggle}>
              <Edit className="h-3.5 w-3.5" />
              Edit Profile
            </Button>
          )}
        </div>

        <div className="space-y-3 max-w-xl mx-auto">
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/80 dark:bg-slate-800/80 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              {theme === 'dark' ? (
                <Moon className="h-4 w-4 text-accent" />
              ) : (
                <Sun className="h-4 w-4 text-amber-500" />
              )}
              <span className="text-sm font-medium">Dark Mode</span>
            </div>
            <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
          </div>

          <div className="rounded-lg border border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-slate-800/80 p-4 shadow-sm">
            <div className="space-y-3">
              {isEditing ? (
                <>
                  <div>
                    <Label htmlFor="fullName" className="text-xs font-medium mb-1 block">Full Name</Label>
                    <Input 
                      id="fullName" 
                      name="fullName" 
                      value={editData.fullName} 
                      onChange={handleInputChange}
                      className="border-gray-200 dark:border-gray-700 h-9 text-sm focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-xs font-medium mb-1 block">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      value={editData.email}
                      disabled={true}
                      className="bg-muted border-gray-200 dark:border-gray-700 h-9 text-sm"
                    />
                    <p className="text-[10px] text-muted-foreground mt-0.5">Email cannot be changed</p>
                  </div>
                  <div>
                    <Label htmlFor="organization" className="text-xs font-medium mb-1 block">Organization</Label>
                    <Input 
                      id="organization" 
                      name="organization" 
                      value={editData.organization} 
                      onChange={handleInputChange}
                      placeholder="Enter your school or organization"
                      className="border-gray-200 dark:border-gray-700 h-9 text-sm focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-1">Joined</p>
                    <p className="text-primary text-sm bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded">{profileData.joinedAt}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-xs font-medium mb-1">Full Name</p>
                    <p className="text-primary text-sm bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded">{profileData.fullName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-1">Email</p>
                    <p className="text-primary text-sm bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded">{profileData.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-1">Organization</p>
                    <p className="text-primary text-sm bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded">{profileData.organization || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-1">Joined</p>
                    <p className="text-primary text-sm bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded">{profileData.joinedAt}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-xl mx-auto pt-1">
          <Button 
            variant="destructive" 
            className="w-full h-9 text-sm hover:bg-red-600 transition-all font-medium"
            onClick={signOut}
          >
            <LogOut className="h-3.5 w-3.5 mr-1.5" />
            Sign Out
          </Button>
        </div>

        <div className="flex flex-col items-center mt-2 text-center pt-2 border-t border-gray-200 dark:border-gray-800 max-w-xl mx-auto">
          <div className="font-extrabold text-base">
            <span className="text-[#1e40af]">Task</span>
            <span className="text-primary">Hub</span>
            <span className="text-[10px] ml-0.5 text-[#1e40af] font-medium align-top">®</span>
          </div>
          <p className="text-xs text-muted-foreground">Managed by Tousif Dewan</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
