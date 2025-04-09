from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .api.routes.users_routes import router as users_router
from .api.routes.residence_halls_routes import router as residence_halls_router
from .api.routes.rooms_routes import router as room_router
from .api.routes.events_routes import router as event_router
from .api.routes.questions_routes import router as question_router
from .api.routes.options_routes import router as option_router
from .api.routes.question_option_routes import router as question_option_router
from .api.routes.user_response_route import router as user_response_router
from .api.routes.feedbacks_routes import router as feedback_router

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

# Create FastAPI app with lifespan handler and CORS configuration
app = FastAPI(
    title="Roommate Backend App",
    description="Backend application for roommate matching and residence hall management",
    version="0.1.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[ "http://localhost:3000", "http://frontend:3000", "http://backend:8000" ],
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

@app.get("/")
def root():
    """
    Root endpoint providing basic application information.
    
    :return: Welcome message
    """
    return {"message": "Roommate Backend App"}

# Include routers with appropriate prefixes
app.include_router(users_router, prefix="/api")
app.include_router(residence_halls_router, prefix="/api")
app.include_router(room_router, prefix="/api")
app.include_router(event_router, prefix="/api")
app.include_router(question_router, prefix="/api")
app.include_router(option_router, prefix="/api")
app.include_router(question_option_router, prefix="/api")
app.include_router(user_response_router, prefix="/api")
app.include_router(feedback_router, prefix="/api")