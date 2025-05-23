from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from .core.config import SECRET_KEY, ALGORITHM
from . import crud, schemas
from .database import SessionLocal # To create a new session if needed, or use get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token") # Corrected tokenUrl

# Dependency to get DB session (similar to what's in routers)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> schemas.User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        # token_data = schemas.TokenData(email=email) # If you have a TokenData schema
    except JWTError:
        raise credentials_exception
    
    user = crud.get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: schemas.User = Depends(get_current_user)) -> schemas.User:
    if not current_user.is_active: # Assuming your User model has an is_active field
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
