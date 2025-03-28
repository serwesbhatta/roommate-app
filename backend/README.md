# Backend
# Roommate Finder App

A FastAPI application for finding roommates.

API Route → Service Layer → CRUD Layer → Database

## Setup

1. Clone this repository
2. Install dependencies: `pip install -r requirements.txt`
3. Set up the database: `alembic upgrade head`
4. Run the application: `uvicorn backend.app.main:app --reload`

## Project Structure

- `/backend/app`: Main application code
  - `/api`: API routes
  - `/core`: Core application components
  - `/crud`: Database operations
  - `/models`: Database models
  - `/schemas`: Pydantic models
  - `/services`: Business logic

## API Documentation

When running, visit `/docs` for Swagger documentation.