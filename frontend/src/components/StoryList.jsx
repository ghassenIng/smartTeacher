import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // For "View Story" button
import { fetchStories } from '../../services/api';
import { toast } from "sonner";

export function StoryList() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Keep error state for conditional rendering

  useEffect(() => {
    const getStories = async () => {
      try {
        const fetchedStories = await fetchStories();
        setStories(fetchedStories);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch stories.");
        toast.error(err.message || "Failed to fetch stories.");
        setLoading(false);
      }
    };
    getStories();
  }, []);

  if (loading) return <p className="text-center">Loading stories...</p>;
  // Error state is now handled by toast, but you could still have a specific UI for it
  if (error && stories.length === 0) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Stories</h2>
      {stories.length === 0 ? (
        <p>No stories available yet. Create one to get started!</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <Card key={story.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="truncate">{story.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {story.content}
                </p>
              </CardContent>
              <div className="p-4 pt-0"> {/* CardFooter could also be used */}
                <Link to={`/story/${story.id}`}>
                  <Button className="w-full">View Story</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
