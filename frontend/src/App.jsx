import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { CreateStoryPage } from './pages/CreateStoryPage'; // To be created
import { StoryDetailPage } from './pages/StoryDetailPage'; // To be created
import { getToken } from './services/tokenService'; // To protect routes

// Basic ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  if (!getToken()) {
    // If no token, redirect to home page (which will show login/register)
    // Or, you could redirect to a dedicated /login page if you had one
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/create-story" 
          element={
            <ProtectedRoute>
              <CreateStoryPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/story/:storyId" 
          element={
            <ProtectedRoute>
              <StoryDetailPage />
            </ProtectedRoute>
          } 
        />
        {/* Add other routes here, e.g., a dedicated login page if needed */}
        {/* <Route path="*" element={<Navigate to="/" />} /> */} {/* Optional: Fallback for unknown paths */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
