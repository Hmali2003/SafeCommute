from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
from app.services.weather_service import get_weather

from app.database import get_db
from app.models.wfh_request import WFHRequest
from app.models.user import User
from app.schemas.request_schema import WFHRequestResponse
from app.utils.dependencies import require_employee
from app.services.image_service import upload_road_image
from app.services.weather_service import get_weather
from app.services.traffic_service import get_traffic_data
from app.services.risk_service import calculate_risk_score

router = APIRouter()

from app.services.weather_service import get_weather
from app.services.traffic_service import get_traffic_data
from app.services.risk_service import calculate_risk_score


@router.post("/requests", response_model=WFHRequestResponse)
async def create_request(
    reason: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    image: UploadFile = File(None),
    current_user: User = Depends(require_employee),
    db: Session = Depends(get_db),
):
    """Employee submits a new WFH request with reason, GPS coords, and optional photo."""
    image_url = None
    if image:
        image_url = await upload_road_image(image, str(current_user.id))

    # Gather evidence
    weather_data = get_weather(latitude, longitude)
    traffic_data = get_traffic_data(latitude, longitude)

    # Calculate the 0-100 safety score and recommendation from that evidence
    risk_result = calculate_risk_score(weather_data, traffic_data, image_url)

    new_request = WFHRequest(
        employee_id=current_user.id,
        reason=reason,
        latitude=latitude,
        longitude=longitude,
        image_url=image_url,
        weather_data=weather_data,
        traffic_data=traffic_data,
        risk_score=risk_result["risk_score"],
        recommendation=risk_result["recommendation"],
        status="pending",
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    return new_request


@router.get("/requests", response_model=List[WFHRequestResponse])
def get_my_requests(
    current_user: User = Depends(require_employee),
    db: Session = Depends(get_db),
):
    """Returns all requests submitted by the logged-in employee, newest first."""
    return (
        db.query(WFHRequest)
        .filter(WFHRequest.employee_id == current_user.id)
        .order_by(WFHRequest.created_at.desc())
        .all()
    )


@router.get("/requests/{request_id}", response_model=WFHRequestResponse)
def get_request_detail(
    request_id: str,
    current_user: User = Depends(require_employee),
    db: Session = Depends(get_db),
):
    from fastapi import HTTPException
    req = (
        db.query(WFHRequest)
        .filter(WFHRequest.id == request_id, WFHRequest.employee_id == current_user.id)
        .first()
    )
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    return req

