import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { LoginForm } from '@/components/LoginForm';
import { RegisterForm } from '@/components/RegisterForm';
import { StoryList } from '@/components/StoryList';
// CreateStoryForm is now rendered via CreateStoryPage through routing
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { getToken, removeToken } from '../../services/tokenService';
import { toast } from "sonner";

export function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!getToken());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    // No need to setViewMode, navigation handles views
  };

  const handleLogout = () => {
    removeToken();
    setIsAuthenticated(false);
    navigate('/'); // Navigate to home after logout, which will show login forms
    toast.info("You have been logged out.");
  };

  // handleStorySaved is removed as CreateStoryPage will handle navigation

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="p-4 border-b flex justify-between items-center">
        <h1 className="text-2xl font-bold">Educational Platform</h1>
        {isAuthenticated && (
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/create-story')} variant="default">
              Create New Story
            </Button>
            <Button onClick={handleLogout} variant="destructive">Logout</Button>
          </div>
        )}
      </header>
      <main className="p-4">
        {!isAuthenticated ? (
          <div className="flex flex-wrap justify-center items-start gap-8">
            <RegisterForm />
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          </div>
        ) : (
          <div className="mt-8">
            {/* StoryList is always shown when authenticated and on the home page */}
            {/* Key can be simplified or removed if StoryList handles its own data fetching updates adequately */}
            <StoryList key={isAuthenticated.toString()} /> 
          </div>
        )}
      </main>
      <Toaster />
    </div>
  );
}
