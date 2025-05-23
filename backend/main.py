from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os

from .database import create_db_and_tables
from .routers import auth, stories

# Ensure the static directory exists
STATIC_DIR = "static"
GENERATED_IMAGES_DIR = os.path.join(STATIC_DIR, "generated_images")

if not os.path.exists(STATIC_DIR):
    os.makedirs(STATIC_DIR)
if not os.path.exists(GENERATED_IMAGES_DIR):
    os.makedirs(GENERATED_IMAGES_DIR)


app = FastAPI()

# Mount static files directory
app.mount(f"/{STATIC_DIR}", StaticFiles(directory=STATIC_DIR), name="static")

# Create database tables on startup
create_db_and_tables()

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(stories.router, prefix="/stories_api", tags=["stories"]) # Changed prefix to avoid conflict with GET /stories/

@app.get("/")
async def root():
    return {"message": "Welcome to the Educational Platform API"}
