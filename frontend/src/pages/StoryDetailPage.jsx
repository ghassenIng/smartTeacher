import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { fetchStoryById, updateStoryById, generateStoryImage, generateStoryColoringPage } from '../../services/api'; // Import generateStoryColoringPage
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

export function StoryDetailPage() {
  const { storyId } = useParams();
  const navigate = useNavigate();

  const [story, setStory] = useState(null);
  const [editableTitle, setEditableTitle] = useState('');
  const [editableContent, setEditableContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [storyImageUrl, setStoryImageUrl] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(false);
  
  const [coloringImageUrl, setColoringImageUrl] = useState('');
  const [isColoringImageLoading, setIsColoringImageLoading] = useState(false);

  useEffect(() => {
    const loadStory = async () => {
      setIsLoading(true);
      setStoryImageUrl(''); 
      setColoringImageUrl(''); // Reset coloring page URL
      try {
        const fetchedStory = await fetchStoryById(storyId);
        setStory(fetchedStory);
        setEditableTitle(fetchedStory.title);
        setEditableContent(fetchedStory.content);
      } catch (error) {
        toast.error("Failed to fetch story details.");
        // Optionally navigate back or show an error message
        // navigate('/'); 
      } finally {
        setIsLoading(false);
      }
    };
    if (storyId) {
      loadStory();
    }
  }, [storyId]);

  const handleSaveChanges = async () => {
    if (!editableTitle.trim() || !editableContent.trim()) {
      toast.error("Title and content cannot be empty.");
      return;
    }
    setIsSaving(true);
    try {
      const updatedStory = await updateStoryById(storyId, editableTitle, editableContent);
      setStory(updatedStory); // Update story state with the response
      setEditableTitle(updatedStory.title); // Ensure local state matches saved state
      setEditableContent(updatedStory.content);
      toast.success("Story updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.detail || error.message || "Failed to update story.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    // Simple browser print. More sophisticated PDF generation would require a library.
    // Temporarily hide non-story elements for better print layout
    const appHeader = document.querySelector('header'); // Assuming a main header
    const storyDetailHeader = document.getElementById('story-detail-header');
    const storyDetailButtons = document.getElementById('story-detail-buttons');
    
    if(appHeader) appHeader.style.display = 'none';
    if(storyDetailHeader) storyDetailHeader.style.display = 'none';
    if(storyDetailButtons) storyDetailButtons.style.display = 'none';
    
    window.print();
    
    if(appHeader) appHeader.style.display = ''; // Restore display
    if(storyDetailHeader) storyDetailHeader.style.display = '';
    if(storyDetailButtons) storyDetailButtons.style.display = '';
  };

  if (isLoading) {
    return <div className="container mx-auto p-4 text-center">Loading story details...</div>;
  }

  if (!story) {
    return <div className="container mx-auto p-4 text-center">Story not found or access denied.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div id="story-detail-header" className="mb-6">
        <Button onClick={() => navigate('/')} variant="outline" className="mb-4 mr-4">&larr; Back to Stories</Button>
        <h1 className="text-3xl font-bold break-words">{story.title}</h1> 
        {/* Display original title, editable one is in the form */}
      </div>

      <Tabs defaultValue="storyText" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4" id="story-detail-buttons"> 
          {/* Updated grid-cols to 3 for three tabs */}
          <TabsTrigger value="storyText">نص القصة (Story Text)</TabsTrigger>
          <TabsTrigger value="storyImage">🖼️ صورة القصة (Story Image)</TabsTrigger>
          <TabsTrigger value="storyColoring">🎨 تلوين القصة (Story Coloring)</TabsTrigger>
        </TabsList>

        <TabsContent value="storyText">
          <Card>
            <CardHeader>
              <CardTitle>Edit Story</CardTitle>
              <CardDescription>Make changes to your story's title and content below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="editableStoryTitle" className="text-sm font-medium">Title</label>
                <Input
                  id="editableStoryTitle"
                  value={editableTitle}
                  onChange={(e) => setEditableTitle(e.target.value)}
                  placeholder="Story Title"
                  className="text-lg"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="editableStoryContent" className="text-sm font-medium">Content</label>
                <Textarea
                  id="editableStoryContent"
                  value={editableContent}
                  onChange={(e) => setEditableContent(e.target.value)}
                  placeholder="Once upon a time..."
                  rows={15}
                  className="min-h-[300px] text-base"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2" id="story-detail-buttons">
              <Button onClick={handlePrint} variant="outline">Print to PDF</Button>
              <Button onClick={handleSaveChanges} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        </TabsContent>
        
        <TabsContent value="storyImage">
          <Card>
            <CardHeader>
              <CardTitle>Story Image</CardTitle>
              <CardDescription>Generate or view the image for your story.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex flex-col items-center justify-center min-h-[300px]">
              {isImageLoading && <p>Generating image, please wait...</p>}
              {!isImageLoading && storyImageUrl && (
                <div className="w-full max-w-lg aspect-video relative my-4"> {/* Adjust max-w as needed */}
                  <img 
                    src={storyImageUrl} 
                    alt="Generated Story Illustration" 
                    className="rounded-md object-contain w-full h-full shadow-md" 
                  />
                </div>
              )}
              {!isImageLoading && !storyImageUrl && (
                <p className="text-center text-muted-foreground py-8">
                  No image generated yet. Click the button below to generate one.
                </p>
              )}
               <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
                <Button onClick={handleGenerateImage} disabled={isImageLoading || !story}>
                  {isImageLoading ? "Generating..." : "توليد صورة (Generate Image)"}
                </Button>
                {storyImageUrl && !isImageLoading && (
                  <Button onClick={handleDownloadImage} variant="outline">
                    تحميل الصورة (Download Image)
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* Toaster is likely in App.jsx or HomePage.jsx, ensure it's available */}
    </div>
  );
}
