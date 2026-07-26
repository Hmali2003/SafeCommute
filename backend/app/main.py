from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

app = FastAPI(
    title="SafeCommute API",
    description="Backend API for SafeCommute - evidence-based WFH request system",
    version="1.0.0",
)

# CORS - allow the React frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "service": "SafeCommute API",
        "status": "running",
        "environment": settings.ENVIRONMENT,
    }


@app.get("/health")
def health_check():
    """Used by Render/uptime monitors to confirm the service is alive."""
    return {"status": "healthy"}


from app.routers import auth_router, employee_router

app.include_router(auth_router.router, prefix="/api/auth", tags=["Auth"])
app.include_router(employee_router.router, prefix="/api/employee", tags=["Employee"])

from app.routers import auth_router, employee_router, manager_router

app.include_router(auth_router.router, prefix="/api/auth", tags=["Auth"])
app.include_router(employee_router.router, prefix="/api/employee", tags=["Employee"])
app.include_router(manager_router.router, prefix="/api/manager", tags=["Manager"])