from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID


class WFHRequestCreate(BaseModel):
    reason: str
    latitude: float
    longitude: float


class WFHRequestResponse(BaseModel):
    id: UUID
    employee_id: UUID
    reason: str
    latitude: float
    longitude: float
    image_url: Optional[str] = None
    weather_data: Optional[dict] = None
    traffic_data: Optional[dict] = None
    risk_score: Optional[int] = None
    recommendation: Optional[str] = None
    status: str
    manager_comment: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class WFHRequestWithEmployee(WFHRequestResponse):
    employee_name: str
    employee_email: str


class ManagerDecision(BaseModel):
    status: str  # 'approved', 'rejected', 'more_info_requested'
    manager_comment: Optional[str] = None