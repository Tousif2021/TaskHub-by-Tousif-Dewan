
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
              <AvatarImage src={profile?.avatar_url || ""} alt="Profile picture" />
              <AvatarFallback>{getInitials()}</AvatarFallback>
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
            <h1 className="text-xl font-bold">{profileData.fullName}</h1>
            <p className="text-sm text-muted-foreground">Task Manager User</p>
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1" onClick={handleSaveProfile}>
                <Check className="h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" size="sm" className="gap-1" onClick={handleEditToggle}>
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" className="gap-1" onClick={handleEditToggle}>
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          )}
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
              {isEditing ? (
                <>
                  <div>
                    <Label htmlFor="fullName" className="text-sm font-medium mb-1">Full Name</Label>
                    <Input 
                      id="fullName" 
                      name="fullName" 
                      value={editData.fullName} 
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium mb-1">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      value={editData.email}
                      disabled={true}
                      className="mt-1 bg-muted"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <Label htmlFor="organization" className="text-sm font-medium mb-1">Organization</Label>
                    <Input 
                      id="organization" 
                      name="organization" 
                      value={editData.organization} 
                      onChange={handleInputChange}
                      placeholder="Enter your school or organization"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Joined</p>
                    <p className="text-primary">{profileData.joinedAt}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm font-medium mb-1">Full Name</p>
                    <p className="text-primary">{profileData.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Email</p>
                    <p className="text-primary">{profileData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Organization</p>
                    <p className="text-primary">{profileData.organization || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Joined</p>
                    <p className="text-primary">{profileData.joinedAt}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <Button 
          variant="destructive" 
          className="w-full"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Profile;
