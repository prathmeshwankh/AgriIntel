from datetime import datetime

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from app.database import get_database

from app.models.user import (
    UserRegister,
    UserLogin,
    UserResponse,
    TokenResponse,
    GoogleAuthRequest
)

from app.utils.auth_utils import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    response_model=TokenResponse
)
async def register_user(
    user_data: UserRegister
):

    db = get_database()

    email = user_data.email.lower()

    existing_user = await db.users.find_one(
        {
            "email": email
        }
    )

    if existing_user:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists."
        )

    user_document = {

        "full_name": user_data.full_name.strip(),

        "email": email,

        "hashed_password": get_password_hash(
            user_data.password
        ),

        # SECURITY:
        # All public registrations are farmers.
        "role": "farmer",

        "created_at": datetime.utcnow()
    }

    result = await db.users.insert_one(
        user_document
    )

    user_id = str(result.inserted_id)

    token = create_access_token(
        {
            "sub": user_id,
            "role": "farmer"
        }
    )

    user_response = UserResponse(

        id=user_id,

        full_name=user_document["full_name"],

        email=user_document["email"],

        role="farmer",

        created_at=user_document["created_at"]
    )

    return TokenResponse(
        access_token=token,
        user=user_response
    )


@router.post(
    "/login",
    response_model=TokenResponse
)
async def login_user(
    login_data: UserLogin
):

    db = get_database()

    email = login_data.email.lower()

    user = await db.users.find_one(
        {
            "email": email
        }
    )

    if not user:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    if not verify_password(
        login_data.password,
        user["hashed_password"]
    ):

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    user_id = str(user["_id"])

    role = user.get(
        "role",
        "farmer"
    )

    token = create_access_token(
        {
            "sub": user_id,
            "role": role
        }
    )

    user_response = UserResponse(

        id=user_id,

        full_name=user["full_name"],

        email=user["email"],

        role=role,

        created_at=user.get(
            "created_at",
            datetime.utcnow()
        )
    )

    return TokenResponse(
        access_token=token,
        user=user_response
    )


@router.get(
    "/me",
    response_model=UserResponse
)
async def get_me(
    current_user: dict = Depends(
        get_current_user
    )
):

    return UserResponse(

        id=current_user["_id"],

        full_name=current_user["full_name"],

        email=current_user["email"],

        role=current_user.get(
            "role",
            "farmer"
        ),

        created_at=current_user.get(
            "created_at",
            datetime.utcnow()
        )
    )


@router.post(
    "/google",
    response_model=TokenResponse
)
async def google_login(
    auth_data: GoogleAuthRequest
):
    db = get_database()
    email = auth_data.email.lower().strip()

    user = await db.users.find_one({"email": email})

    if not user:
        user_document = {
            "full_name": auth_data.full_name.strip() or email.split("@")[0].title(),
            "email": email,
            "role": "farmer",
            "auth_provider": "google",
            "avatar_url": auth_data.picture,
            "created_at": datetime.utcnow()
        }
        result = await db.users.insert_one(user_document)
        user_id = str(result.inserted_id)
        role = "farmer"
        full_name = user_document["full_name"]
        created_at = user_document["created_at"]
    else:
        user_id = str(user["_id"])
        role = user.get("role", "farmer")
        full_name = user.get("full_name", auth_data.full_name)
        created_at = user.get("created_at", datetime.utcnow())
        if auth_data.picture and not user.get("avatar_url"):
            await db.users.update_one(
                {"_id": user["_id"]},
                {"$set": {"avatar_url": auth_data.picture, "auth_provider": "google"}}
            )

    token = create_access_token(
        {
            "sub": user_id,
            "role": role
        }
    )

    user_response = UserResponse(
        id=user_id,
        full_name=full_name,
        email=email,
        role=role,
        created_at=created_at
    )

    return TokenResponse(
        access_token=token,
        user=user_response
    )