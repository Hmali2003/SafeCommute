from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from app.database import Base


class WFHRequest(Base):
    __tablename__ = "wfh_requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    reason = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    image_url = Column(String, nullable=True)
    weather_data = Column(JSON, nullable=True)
    traffic_data = Column(JSON, nullable=True)
    risk_score = Column(Integer, nullable=True)
    recommendation = Column(String, nullable=True)
    status = Column(String, nullable=False, default="pending")
    manager_comment = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())