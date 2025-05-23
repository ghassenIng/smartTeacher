from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict

from .. import crud, models, schemas
from ..database import SessionLocal
from ..dependencies import get_current_active_user
from ..services.gemini_service import (
    generate_story_title_and_draft, 
    generate_image_for_story, 
    generate_coloring_page_for_story,
    generate_pedagogical_activity # Import new service
)

router = APIRouter()

# Dependency for DB session (can also be imported from dependencies.py if centralized)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/stories_api/", response_model=schemas.Story) # Path changed
def create_new_story( # Renamed, user_id removed
    story: schemas.StoryCreate, 
    db: Session = Depends(get_db), 
    current_user: schemas.User = Depends(get_current_active_user) # Added dependency
):
    return crud.create_story(db=db, story=story, owner_id=current_user.id) # Use current_user.id

@router.get("/stories_api/", response_model=List[schemas.Story]) # Path might need to be distinct if GET /stories/ is still public
def read_user_stories( # Renamed for clarity
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user) # Added dependency
):
    stories = crud.get_stories(db, owner_id=current_user.id, skip=skip, limit=limit) # Pass owner_id
    return stories

@router.post("/stories_api/suggest-story/", response_model=Dict[str, str])
async def suggest_story_elements(
    prompt_details: schemas.StoryPromptDetails,
    current_user: schemas.User = Depends(get_current_active_user) # Ensure user is authenticated
):
    try:
        suggestions = generate_story_title_and_draft(
            topic=prompt_details.topic,
            hero_name=prompt_details.hero_name,
            age_group=prompt_details.age_group
        )
        return suggestions
    except Exception as e:
        # Log the exception e
        raise HTTPException(status_code=500, detail=f"Failed to get story suggestions: {str(e)}")

@router.get("/stories_api/{story_id}", response_model=schemas.Story)
def read_story(
    story_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    db_story = crud.get_story(db, story_id=story_id, owner_id=current_user.id)
    if db_story is None:
        raise HTTPException(status_code=404, detail="Story not found")
    return db_story

@router.put("/stories_api/{story_id}", response_model=schemas.Story)
def update_existing_story(
    story_id: int,
    story_update: schemas.StoryCreate, # Using StoryCreate for title and content
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    updated_story = crud.update_story(
        db, 
        story_id=story_id, 
        owner_id=current_user.id, 
        title=story_update.title, 
        content=story_update.content
    )
    if updated_story is None:
        raise HTTPException(status_code=404, detail="Story not found or not owner")
    return updated_story

@router.post("/stories_api/{story_id}/generate-image", response_model=Dict[str, str])
async def generate_story_image_endpoint(
    story_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    db_story = crud.get_story(db, story_id=story_id, owner_id=current_user.id)
    if db_story is None:
        raise HTTPException(status_code=404, detail="Story not found or not owned by user")

    try:
        # This currently returns a placeholder URL due to gemini_service implementation
        image_url = generate_image_for_story(story_content=db_story.content)
        if image_url is None:
            raise HTTPException(status_code=500, detail="Failed to generate image")
        return {"image_url": image_url}
    except Exception as e:
        # Log the exception e
        raise HTTPException(status_code=500, detail=f"Failed to generate image: {str(e)}")

@router.post("/stories_api/{story_id}/generate-coloring-page", response_model=Dict[str, str])
async def generate_story_coloring_page_endpoint(
    story_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    db_story = crud.get_story(db, story_id=story_id, owner_id=current_user.id)
    if db_story is None:
        raise HTTPException(status_code=404, detail="Story not found or not owned by user")

    try:
        # This currently returns a placeholder URL due to gemini_service implementation
        coloring_image_url = generate_coloring_page_for_story(story_content=db_story.content)
        if coloring_image_url is None: # Should not happen with current placeholder logic, but good practice
            raise HTTPException(status_code=500, detail="Failed to generate coloring page")
        return {"coloring_image_url": coloring_image_url}
    except Exception as e:
        # Log the exception e
        raise HTTPException(status_code=500, detail=f"Failed to generate coloring page: {str(e)}")

@router.post("/stories_api/{story_id}/generate-activity", response_model=Dict[str, str])
async def generate_story_activity_endpoint(
    story_id: int,
    activity_request: schemas.ActivityRequest, # Use the new schema
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    db_story = crud.get_story(db, story_id=story_id, owner_id=current_user.id)
    if db_story is None:
        raise HTTPException(status_code=404, detail="Story not found or not owned by user")

    try:
        activity_text = generate_pedagogical_activity(
            story_content=db_story.content, 
            activity_type=activity_request.activity_type
        )
        if activity_text is None: # Should not happen with placeholder, but good for real API
            raise HTTPException(status_code=500, detail="Failed to generate pedagogical activity")
        return {"activity_text": activity_text}
    except Exception as e:
        # Log the exception e
        raise HTTPException(status_code=500, detail=f"Failed to generate pedagogical activity: {str(e)}")
