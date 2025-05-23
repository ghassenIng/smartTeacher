import React from 'react';
import { CreateStoryForm } from '../components/CreateStoryForm'; // Adjusted path
import { useNavigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner"; // Assuming Toaster is globally available or add here

export function CreateStoryPage() {
  const navigate = useNavigate();

  const handleStorySaved = (newStoryId) => {
    // If newStoryId is available and you want to navigate to the detail page:
    // navigate(`/story/${newStoryId}`);
    // For now, navigate to home/story list
    navigate('/'); 
  };

  return (
    <div className="container mx-auto p-4">
      {/* You might want a header or back button here */}
      <CreateStoryForm onStorySaved={handleStorySaved} />
      {/* Toaster might be better placed in App.jsx or a layout component if not already there */}
      {/* <Toaster />  */}
    </div>
  );
}
