from pydantic import BaseModel
from uuid import UUID


class UserResponse(BaseModel):
    id: UUID
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True