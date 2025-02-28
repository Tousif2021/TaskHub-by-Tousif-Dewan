
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
    <div className="min-h-screen pb-24 bg-white/50 dark:bg-slate-900/50">
      <div className="p-8 space-y-8">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="flex flex-col items-center space-y-4 mb-8">
          <div className="relative">
            <Avatar className="h-28 w-28 border-2 border-white dark:border-gray-800 shadow-md">
              <AvatarImage src={profile?.avatar_url || ""} alt="Profile picture" />
              <AvatarFallback className="text-xl bg-accent/10 text-accent">{getInitials()}</AvatarFallback>
            </Avatar>
            <Button 
              variant="secondary" 
              size="icon" 
              className="absolute bottom-0 right-0 rounded-full h-9 w-9 shadow-sm hover:scale-105 transition-transform"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold">{profileData.fullName}</h1>
            <p className="text-sm text-muted-foreground">Task Manager User</p>
          </div>
          {isEditing ? (
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="gap-1 hover:bg-accent hover:text-white transition-colors" onClick={handleSaveProfile}>
                <Check className="h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" size="sm" className="gap-1 hover:bg-red-500 hover:text-white transition-colors" onClick={handleEditToggle}>
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" className="gap-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={handleEditToggle}>
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>

        <div className="space-y-8 max-w-xl mx-auto">
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/80 dark:bg-slate-800/80 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon className="h-5 w-5 text-accent" />
              ) : (
                <Sun className="h-5 w-5 text-amber-500" />
              )}
              <span className="font-medium">Dark Mode</span>
            </div>
            <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
          </div>

          <div className="rounded-lg border border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-slate-800/80 p-6 shadow-sm">
            <div className="space-y-5">
              {isEditing ? (
                <>
                  <div>
                    <Label htmlFor="fullName" className="text-sm font-medium mb-1.5 block">Full Name</Label>
                    <Input 
                      id="fullName" 
                      name="fullName" 
                      value={editData.fullName} 
                      onChange={handleInputChange}
                      className="border-gray-200 dark:border-gray-700 h-11 focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium mb-1.5 block">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      value={editData.email}
                      disabled={true}
                      className="bg-muted border-gray-200 dark:border-gray-700 h-11"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <Label htmlFor="organization" className="text-sm font-medium mb-1.5 block">Organization</Label>
                    <Input 
                      id="organization" 
                      name="organization" 
                      value={editData.organization} 
                      onChange={handleInputChange}
                      placeholder="Enter your school or organization"
                      className="border-gray-200 dark:border-gray-700 h-11 focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1.5">Joined</p>
                    <p className="text-primary bg-gray-50 dark:bg-gray-800/50 p-2 rounded">{profileData.joinedAt}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm font-medium mb-1.5">Full Name</p>
                    <p className="text-primary bg-gray-50 dark:bg-gray-800/50 p-2 rounded">{profileData.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1.5">Email</p>
                    <p className="text-primary bg-gray-50 dark:bg-gray-800/50 p-2 rounded">{profileData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1.5">Organization</p>
                    <p className="text-primary bg-gray-50 dark:bg-gray-800/50 p-2 rounded">{profileData.organization || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1.5">Joined</p>
                    <p className="text-primary bg-gray-50 dark:bg-gray-800/50 p-2 rounded">{profileData.joinedAt}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-xl mx-auto pt-2">
          <Button 
            variant="destructive" 
            className="w-full h-11 hover:bg-red-600 hover:scale-[1.01] transition-all font-medium"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="flex flex-col items-center mt-3 text-center pt-3 border-t border-gray-200 dark:border-gray-800 max-w-xl mx-auto">
          <div className="font-extrabold text-lg">
            <span className="text-[#1e40af]">Task</span>
            <span className="text-primary">Hub</span>
            <span className="text-xs ml-1 text-[#1e40af] font-medium align-top">®</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Managed by Tousif Dewan</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
