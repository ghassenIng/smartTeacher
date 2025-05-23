from pydantic import BaseModel
from typing import List, Optional

class StoryBase(BaseModel):
    title: str
    content: str

class StoryCreate(StoryBase):
    pass

class Story(StoryBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True

class StoryPromptDetails(BaseModel):
    topic: str
    hero_name: str
    age_group: str

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    stories: List[Story] = []

    class Config:
        orm_mode = True
