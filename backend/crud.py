from sqlalchemy.orm import Session
from .core.security import get_password_hash, pwd_context # Import from core.security
from . import models, schemas

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password) # Use the new function
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_stories(db: Session, owner_id: int | None = None, skip: int = 0, limit: int = 100):
    query = db.query(models.Story)
    if owner_id:
        query = query.filter(models.Story.owner_id == owner_id)
    return query.offset(skip).limit(limit).all()

def create_story(db: Session, story: schemas.StoryCreate, owner_id: int): # Renamed and signature confirmed
    db_story = models.Story(**story.dict(), owner_id=owner_id)
    db.add(db_story)
    db.commit()
    db.refresh(db_story)
    return db_story

def get_story(db: Session, story_id: int, owner_id: int):
    return db.query(models.Story).filter(models.Story.id == story_id, models.Story.owner_id == owner_id).first()

def update_story(db: Session, story_id: int, owner_id: int, title: str, content: str):
    db_story = get_story(db, story_id=story_id, owner_id=owner_id)
    if db_story:
        db_story.title = title
        db_story.content = content
        db.commit()
        db.refresh(db_story)
    return db_story
