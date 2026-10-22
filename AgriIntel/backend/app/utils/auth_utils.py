from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, status

from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from jose import JWTError, jwt

import bcrypt

from bson import ObjectId

from app.config import settings
from app.database import get_database


security = HTTPBearer()
optional_security = HTTPBearer(auto_error=False)


def get_password_hash(password: str) -> str:
    # bcrypt maximum password length is 72 bytes
    pwd_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    try:
        pwd_bytes = plain_password.encode("utf-8")[:72]
        hash_bytes = hashed_password.encode("utf-8")
        return bcrypt.checkpw(pwd_bytes, hash_bytes)
    except Exception:
        return False


def create_access_token(data: dict):

    payload = data.copy()

    expire = datetime.now(
        timezone.utc
    ) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload["exp"] = expire

    return jwt.encode(
        payload,
        settings.JWT_SECRET,
        algorithm=settings.ALGORITHM
    )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(
        security
    )
):

    token = credentials.credentials

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired authentication token.",
        headers={
            "WWW-Authenticate": "Bearer"
        }
    )

    try:

        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.ALGORITHM]
        )

        user_id = payload.get("sub")

        if not user_id:

            raise credentials_exception

    except JWTError:

        raise credentials_exception

    if not ObjectId.is_valid(user_id):

        raise credentials_exception

    db = get_database()

    user = await db.users.find_one(
        {
            "_id": ObjectId(user_id)
        }
    )

    if not user:

        raise credentials_exception

    user["_id"] = str(user["_id"])

    return user


async def get_current_admin(
    current_user: dict = Depends(
        get_current_user
    )
):

    if current_user.get("role") != "admin":

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required."
        )

    return current_user


async def get_optional_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(
        optional_security
    )
):
    if not credentials or not credentials.credentials:
        return None

    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.ALGORITHM]
        )
        user_id = payload.get("sub")
        if not user_id or not ObjectId.is_valid(user_id):
            return None

        db = get_database()
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return None

        user["_id"] = str(user["_id"])
        return user
    except Exception:
        return None