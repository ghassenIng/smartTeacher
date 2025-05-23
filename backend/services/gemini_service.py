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
