from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.wfh_request import WFHRequest
from app.models.user import User
from app.schemas.request_schema import WFHRequestWithEmployee, WFHRequestResponse, ManagerDecision
from app.utils.dependencies import require_manager
from app.services.email_service import send_decision_email

router = APIRouter()

VALID_STATUSES = {"approved", "rejected", "more_info_requested"}


@router.get("/requests", response_model=List[WFHRequestWithEmployee])
def get_all_requests(
    status: str = None,
    current_user: User = Depends(require_manager),
    db: Session = Depends(get_db),
):
    """Managers see every employee's requests, optionally filtered by status."""
    query = db.query(WFHRequest, User).join(User, WFHRequest.employee_id == User.id)

    if status:
        query = query.filter(WFHRequest.status == status)

    results = query.order_by(WFHRequest.created_at.desc()).all()

    return [
        WFHRequestWithEmployee(
            **WFHRequestResponse.model_validate(req).model_dump(),
            employee_name=user.name,
            employee_email=user.email,
        )
        for req, user in results
    ]


@router.get("/requests/{request_id}", response_model=WFHRequestWithEmployee)
def get_request_detail(
    request_id: str,
    current_user: User = Depends(require_manager),
    db: Session = Depends(get_db),
):
    result = (
        db.query(WFHRequest, User)
        .join(User, WFHRequest.employee_id == User.id)
        .filter(WFHRequest.id == request_id)
        .first()
    )
    if not result:
        raise HTTPException(status_code=404, detail="Request not found")

    req, user = result
    return WFHRequestWithEmployee(
        **WFHRequestResponse.model_validate(req).model_dump(),
        employee_name=user.name,
        employee_email=user.email,
    )


@router.patch("/requests/{request_id}/decision", response_model=WFHRequestResponse)
def make_decision(
    request_id: str,
    decision: ManagerDecision,
    current_user: User = Depends(require_manager),
    db: Session = Depends(get_db),
):
    """Manager approves, rejects, or requests more info on a WFH request."""
    if decision.status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"Status must be one of {VALID_STATUSES}")

    req = db.query(WFHRequest).filter(WFHRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    employee = db.query(User).filter(User.id == req.employee_id).first()

    req.status = decision.status
    req.manager_comment = decision.manager_comment
    db.commit()
    db.refresh(req)

    # Fire-and-forget email notification (Phase 7 wires the real Resend call in fully)
    try:
        send_decision_email(
            to_email=employee.email,
            employee_name=employee.name,
            status=decision.status,
            comment=decision.manager_comment,
        )
    except Exception as e:
        # Don't let email failure block the decision itself
        print(f"Email notification failed: {e}")

    return req