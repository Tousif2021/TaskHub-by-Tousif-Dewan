//components/theme-provider.tsx
import { createContext, useState, useContext } from 'react';

export const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};


//App.tsx (Assumed structure, needs to be adapted to the actual App.tsx)
import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Profile from './Profile';


function App() {
  return (
      <Router>
        <ThemeProvider>
          <Routes>
            <Route path="/profile" element={<Profile />} />
            {/* Add other routes here */}
          </Routes>
        </ThemeProvider>
      </Router>
  );
}

export default App;

//Profile.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Camera, Edit, Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import Navigation from "@/components/Navigation";

const Profile = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(theme === "dark");

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    setIsDarkMode(newTheme === "dark");
  };

  return (
    <div className="min-h-screen p-6 pb-20">
      <header className="mb-8 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-primary">Profile</h1>
      </header>

      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <Avatar className="w-24 h-24 border-4 border-background">
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Button 
            size="icon" 
            className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
            variant="outline"
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-4 text-center">
          <h2 className="text-xl font-bold">Jane Doe</h2>
          <p className="text-sm text-muted-foreground">jane.doe@example.com</p>
        </div>

        <Button 
          variant="outline" 
          size="sm"
          className="mt-4"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Settings</h3>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {isDarkMode ? (
                  <Moon className="h-5 w-5 mr-3 text-primary" />
                ) : (
                  <Sun className="h-5 w-5 mr-3 text-primary" />
                )}
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Toggle dark theme</p>
                </div>
              </div>
              <Switch 
                checked={isDarkMode} 
                onCheckedChange={toggleTheme} 
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Account</h3>

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

      <Navigation />
    </div>
  );
};

export default Profile;