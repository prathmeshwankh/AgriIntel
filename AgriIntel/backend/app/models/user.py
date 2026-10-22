from datetime import datetime

from pydantic import (
    BaseModel,
    EmailStr,
    Field,
    ConfigDict
)


class UserRegister(BaseModel):

    full_name: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    email: EmailStr

    password: str = Field(
        ...,
        min_length=6,
        max_length=100
    )


class UserLogin(BaseModel):

    email: EmailStr

    password: str


class UserResponse(BaseModel):

    model_config = ConfigDict(
        from_attributes=True
    )

    id: str

    full_name: str

    email: EmailStr

    role: str

    created_at: datetime


class TokenResponse(BaseModel):

    access_token: str

    token_type: str = "bearer"

    user: UserResponse


class GoogleAuthRequest(BaseModel):

    credential: str | None = None

    email: EmailStr

    full_name: str

    picture: str | None = None