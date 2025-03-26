from contextlib import asynccontextmanager
from fastapi import FastAPI

from .database import engine, Base
from .api.routes.users import router as users_router
from .api.routes.residence_halls import router as residence_halls_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan event handler for FastAPI application.
    
    :param app: FastAPI application instance
    :yield: Application lifecycle context
    """
    # Create all database tables on startup
    Base.metadata.create_all(bind=engine)
    
    # Any additional startup tasks can be added here
    print("Application is starting up...")
    
    yield
    
    # Any cleanup tasks can be added here
    print("Application is shutting down...")

# Create FastAPI app with lifespan handler
app = FastAPI(
    title="Roommate Backend App",
    description="Backend application for roommate matching and residence hall management",
    version="0.1.0",
    lifespan=lifespan
)

@app.get("/")
def root():
    """
    Root endpoint providing basic application information.
    
    :return: Welcome message
    """
    return {"message": "Roommate Backend App"}

# Include routers with appropriate prefixes
app.include_router(users_router, prefix="/api/users")
app.include_router(residence_halls_router, prefix="/api/residence-halls")