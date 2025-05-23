import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getAISuggestions, saveStory } from '../../services/api'; // Import saveStory

export function CreateStoryForm({ onStorySaved }) { // Accept onStorySaved prop
  const [topic, setTopic] = useState('');
  const [heroName, setHeroName] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  
  const [suggestedTitle, setSuggestedTitle] = useState(''); // Keep for displaying AI suggestion
  const [suggestedDraft, setSuggestedDraft] = useState(''); // Keep for displaying AI suggestion
  
  const [editableTitle, setEditableTitle] = useState('');
  const [editableDraft, setEditableDraft] = useState('');
  
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isSavingStory, setIsSavingStory] = useState(false);


  const handleGetSuggestions = async () => {
    if (!topic || !heroName || !ageGroup) {
      toast.error("Please fill in all fields for suggestions.");
      return;
    }
    setIsLoadingSuggestions(true);
    setSuggestedTitle(''); 
    setSuggestedDraft('');
    setEditableTitle(''); 
    setEditableDraft('');
    
    try {
      const response = await getAISuggestions(topic, heroName, ageGroup);
      setSuggestedTitle(response.suggested_title);
      setSuggestedDraft(response.suggested_draft);
      setEditableTitle(response.suggested_title);
      setEditableDraft(response.suggested_draft);
      toast.success("Suggestions received! You can now edit them below.");
    } catch (error) {
      toast.error(error.response?.data?.detail || error.message || "Failed to get suggestions.");
      setEditableTitle("Error: Could not fetch title.");
      setEditableDraft("Error: Could not fetch draft. " + (error.response?.data?.detail || error.message));
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleSaveStory = async () => {
    if (!editableTitle.trim() || !editableDraft.trim()) {
      toast.error("Story title and draft cannot be empty.");
      return;
    }
    setIsSavingStory(true);
    try {
      await saveStory(editableTitle, editableDraft);
      toast.success("Story saved successfully!");
      // Clear all form fields
      setTopic('');
      setHeroName('');
      setAgeGroup('');
      setSuggestedTitle('');
      setSuggestedDraft('');
      setEditableTitle('');
      setEditableDraft('');
      if (onStorySaved) {
        onStorySaved(); // Notify parent to change view
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || error.message || "Failed to save story.");
    } finally {
      setIsSavingStory(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto my-8">
      <CardHeader>
        <CardTitle>Create a New Story</CardTitle>
        <CardDescription>Fill in the details for AI suggestions, or write your own story directly.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Inputs for AI Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Story Topic (for AI)</Label>
            <Input 
              id="topic" 
              placeholder="e.g., A magical adventure" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heroName">Hero's Name (for AI)</Label>
            <Input 
              id="heroName" 
              placeholder="e.g., Alex" 
              value={heroName}
              onChange={(e) => setHeroName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ageGroup">Target Age Group (for AI)</Label>
            <Input 
              id="ageGroup" 
              placeholder="e.g., 3-5" 
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={handleGetSuggestions} disabled={isLoadingSuggestions} className="w-full">
          {isLoadingSuggestions ? "Getting Suggestions..." : "Get Story Suggestions"}
        </Button>

        {/* Editable Title and Draft Fields */}
        <div className="space-y-2 pt-4">
          <Label htmlFor="editableTitle" className="text-lg font-semibold">Story Title</Label>
          <Input 
            id="editableTitle" 
            placeholder="Enter your story title here"
            value={editableTitle}
            onChange={(e) => setEditableTitle(e.target.value)}
            className="text-base"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="editableDraft" className="text-lg font-semibold">Story Draft</Label>
          <Textarea 
            id="editableDraft" 
            placeholder="Write your story here..."
            value={editableDraft}
            onChange={(e) => setEditableDraft(e.target.value)}
            rows={12}
            className="min-h-[200px] text-base"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveStory} disabled={isSavingStory} className="w-full">
          {isSavingStory ? "Saving Story..." : "Save Story"}
        </Button>
      </CardFooter>
    </Card>
  );
}
