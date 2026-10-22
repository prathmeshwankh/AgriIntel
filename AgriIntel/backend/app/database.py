import logging

from motor.motor_asyncio import AsyncIOMotorClient

from app.config import settings


logger = logging.getLogger(__name__)


class Database:

    client: AsyncIOMotorClient | None = None


db = Database()


async def connect_to_mongo():

    try:

        db.client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            serverSelectionTimeoutMS=5000
        )

        await db.client.admin.command("ping")

        logger.info(
            "MongoDB connected successfully."
        )

    except Exception:

        db.client = None

        logger.exception(
            "MongoDB connection failed."
        )

        raise


async def close_mongo_connection():

    if db.client:

        db.client.close()

        db.client = None

        logger.info(
            "MongoDB connection closed."
        )


def get_database():

    if db.client is None:

        raise RuntimeError(
            "Database connection is not initialized."
        )

    return db.client[
        settings.DATABASE_NAME
    ]