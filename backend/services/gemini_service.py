import google.generativeai as genai
from ..core.config import GEMINI_API_KEY

# Configure the genai client
if GEMINI_API_KEY and GEMINI_API_KEY != "YOUR_GEMINI_API_KEY_PLACEHOLDER":
    try:
        genai.configure(api_key=GEMINI_API_KEY)
    except Exception as e:
        print(f"Error configuring Gemini API: {e}")
        # Potentially raise an error or set a flag indicating the service is unavailable
else:
    print("Gemini API key not configured or is a placeholder. AI suggestions will not be available.")

def generate_story_title_and_draft(topic: str, hero_name: str, age_group: str) -> dict:
    """
    Generates a story title and a short draft using the Gemini API.
    """
    suggestions = {"suggested_title": "", "suggested_draft": ""}
    
    if not GEMINI_API_KEY or GEMINI_API_KEY == "YOUR_GEMINI_API_KEY_PLACEHOLDER":
        suggestions["suggested_title"] = "AI Title (Gemini not configured)"
        suggestions["suggested_draft"] = "This is a placeholder draft because the Gemini API is not configured. Please set your API key."
        return suggestions

    try:
        model = genai.GenerativeModel('gemini-pro')

        title_prompt = (
            f"Suggest a compelling and short story title for a children's story "
            f"aimed at {age_group} year olds. The story is about: {topic}, "
            f"and the main character is named {hero_name}."
        )
        title_response = model.generate_content(title_prompt)
        suggestions["suggested_title"] = title_response.text if title_response and hasattr(title_response, 'text') else "Could not generate title."

        draft_prompt = (
            f"Write a short children's story (approx. 200-300 words) suitable for "
            f"{age_group} year olds. The story's main topic is '{topic}' and the "
            f"hero is named '{hero_name}'. The story should be engaging and simple to understand."
        )
        draft_response = model.generate_content(draft_prompt)
        suggestions["suggested_draft"] = draft_response.text if draft_response and hasattr(draft_response, 'text') else "Could not generate draft."

    except Exception as e:
        print(f"Error generating story content with Gemini: {e}")
        suggestions["suggested_title"] = "Error generating title."
        suggestions["suggested_draft"] = f"Error generating draft: {e}"
        # In a real app, you might want to raise an HTTPException here or return a more specific error structure

    return suggestions

def generate_image_for_story(story_content: str) -> str:
    """
    Simulates generating an image for the story content and returns a placeholder URL.
    In a real application, this would call a text-to-image generation API.
    """
    # For now, we always return a placeholder.
    # If a real API were used, you might check GEMINI_API_KEY status here.
    # print(f"Simulating image generation for story content (first 100 chars): {story_content[:100]}")
    return "https://via.placeholder.com/600x400.png?text=Generated+Story+Image"

def generate_coloring_page_for_story(story_content: str) -> str:
    """
    Simulates generating a coloring page image for the story content and returns a placeholder URL.
    In a real application, this would call a text-to-image generation API with a specific prompt for line art.
    """
    # print(f"Simulating coloring page generation for story content (first 100 chars): {story_content[:100]}")
    return "https://via.placeholder.com/600x400.png?text=Coloring+Page+Image"

def generate_pedagogical_activity(story_content: str, activity_type: str) -> str:
    """
    Simulates generating a pedagogical activity based on the story content and activity type.
    Returns a placeholder text description for the activity.
    """
    # In a real application, this would involve constructing specific prompts for each activity_type
    # and calling the Gemini API. For now, we return a placeholder.
    
    # Shorten story_content for the placeholder to keep it manageable
    short_story_snippet = story_content[:75] + "..." if len(story_content) > 75 else story_content

    placeholder_text = f"This is a placeholder for a '{activity_type}' activity based on the story: '{short_story_snippet}'. [Simulated AI Content for {activity_type}]"
    
    # Example of how one might structure different placeholders if needed:
    if activity_type == "Imla":
        placeholder_text = f"إملاء مقترح (Placeholder): The quick brown fox jumps over the lazy dog. Based on '{short_story_snippet}'."
    elif activity_type == "Text Comprehension":
        placeholder_text = (
            f"أسئلة فهم النص (Placeholder):\n"
            f"1. Who is the main character in the story about '{short_story_snippet}'?\n"
            f"2. What was the biggest challenge they faced?\n"
            f"3. How was the story resolved?"
        )
    elif activity_type == "Multiple Choice":
        placeholder_text = (
            f"أسئلة اختيار متعدد (Placeholder) for story '{short_story_snippet}':\n"
            f"1. What color was the cat? (a) Red (b) Blue (c) Black. Correct: (c)\n"
            f"2. Where did the story take place? (a) Forest (b) City (c) Space. Correct: (a)"
        )
    elif activity_type == "Connecting Ideas":
        placeholder_text = (
            f"نشاط توصيل الأفكار (Placeholder) for story '{short_story_snippet}':\n"
            f"Match the character to their favorite food:\n"
            f"Character A --- Option 1: Apples\n"
            f"Character B --- Option 2: Bananas\n"
            f"(Correct matches would be determined by AI from story)"
        )
    
    return placeholder_text
