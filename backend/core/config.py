import os

# It's recommended to load these from environment variables in a real application
SECRET_KEY = os.environ.get("SECRET_KEY", "your-secret-key-for-jwt-hs256") # Replace with a strong key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Gemini API Key - IMPORTANT: Load from environment in production!
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY_PLACEHOLDER")
