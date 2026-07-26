import uuid
from supabase import create_client
from fastapi import UploadFile, HTTPException
from app.config import settings

supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE_MB = 5


async def upload_road_image(file: UploadFile, employee_id: str) -> str:
    """Uploads a road condition image to Supabase Storage, returns its public URL."""
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, or WEBP images are allowed")

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"Image must be under {MAX_FILE_SIZE_MB}MB")

    ext = file.filename.split(".")[-1]
    path = f"{employee_id}/{uuid.uuid4()}.{ext}"

    supabase_client.storage.from_("road-images").upload(
        path, contents, {"content-type": file.content_type}
    )

    public_url = supabase_client.storage.from_("road-images").get_public_url(path)
    return public_url