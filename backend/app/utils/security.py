from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config import settings
import jwt
import requests


bearer_scheme = HTTPBearer()


def verify_token(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)
):
    token = credentials.credentials

    try:
        # Get Supabase public keys
        jwks = requests.get(
            f"{settings.SUPABASE_URL}/auth/v1/.well-known/jwks.json"
        ).json()

        header = jwt.get_unverified_header(token)

        key = None

        for k in jwks["keys"]:
            if k["kid"] == header["kid"]:
                key = jwt.algorithms.ECAlgorithm.from_jwk(k)
                break

        if not key:
            raise Exception("Public key not found")

        payload = jwt.decode(
            token,
            key,
            algorithms=["ES256"],
            audience="authenticated",
        )

        return payload


    except Exception as e:
        print("JWT ERROR:", e)

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )


def get_current_user_id(
    payload: dict = Depends(verify_token)
):
    return payload["sub"]