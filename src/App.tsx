
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider, ProtectedRoute } from "@/components/auth-provider";
import Index from "./pages/Index";
import Files from "./pages/Files";
import AddTask from "./pages/AddTask";
import TaskPreview from "./pages/TaskPreview";
import Reminders from "./pages/Reminders";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";
import "./App.css";

// Create a new queryClient instance with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000
    }
  }
});

// AnimatedRoutes component to handle page transitions
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/auth" element={<Auth />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/files" 
          element={
            <ProtectedRoute>
              <Files />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/add" 
          element={
            <ProtectedRoute>
              <AddTask />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tasks" 
          element={
            <ProtectedRoute>
              <TaskPreview />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reminders" 
          element={
            <ProtectedRoute>
              <Reminders />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simple initialization to ensure app loads properly
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    // Add Capacitor-specific initialization if needed
    const checkPlatform = async () => {
      try {
        if (window.Capacitor) {
          console.log("Running on Capacitor");
          // Initialize any native plugins here
        } else {
          console.log("Running on web");
        }
      } catch (error) {
        console.error("Platform check error:", error);
      }
    };
    
    checkPlatform();
    
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <Navigation />
              <AnimatedRoutes />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
