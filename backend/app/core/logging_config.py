# app/core/logging_config.py
import logging
import sys

from app.core.config import settings


def setup_logging() -> None:
  """
  Configure logging for the application.
  Uses standard library logging. If later you want loguru or more advanced
  logging (file handlers, JSON logs), you can extend this function.
  """
  log_level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)

  logging.basicConfig(
    level=log_level,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
    handlers=[
      logging.StreamHandler(sys.stdout),
    ],
  )

  # Optional: log that logging is configured
  logger = logging.getLogger("app")
  logger.info("Logging configured with level %s", settings.LOG_LEVEL)
