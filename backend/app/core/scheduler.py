"""Background scheduler for periodic maintenance jobs (daily data cleanup)."""

from __future__ import annotations

import logging

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

from app.core.config import get_settings

logger = logging.getLogger(__name__)

_scheduler: BackgroundScheduler | None = None


def _run_daily_cleanup() -> None:
    """Delete expired rows and orphan files once a day."""
    from app.core.database import SessionLocal
    from app.services.maintenance import run_maintenance

    db = SessionLocal()
    try:
        result = run_maintenance(db)
        logger.info("Daily data cleanup completed: %s", result)
    except Exception:  # noqa: BLE001 - never let a scheduler job crash the loop
        logger.exception("Daily data cleanup failed")
    finally:
        db.close()


def start_scheduler() -> None:
    """Start the background scheduler if enabled and not already running."""
    global _scheduler
    settings = get_settings()
    if not settings.ENABLE_SCHEDULER:
        logger.info("Scheduler disabled (ENABLE_SCHEDULER=false)")
        return
    if _scheduler is not None and _scheduler.running:
        return

    _scheduler = BackgroundScheduler()
    _scheduler.add_job(
        _run_daily_cleanup,
        CronTrigger(hour=settings.CLEANUP_HOUR, minute=settings.CLEANUP_MINUTE),
        id="daily_cleanup",
        replace_existing=True,
    )
    _scheduler.start()
    logger.info(
        "Scheduler started: daily cleanup at %02d:%02d",
        settings.CLEANUP_HOUR,
        settings.CLEANUP_MINUTE,
    )


def shutdown_scheduler() -> None:
    """Stop the scheduler, if running."""
    global _scheduler
    if _scheduler is not None and _scheduler.running:
        _scheduler.shutdown(wait=False)
        _scheduler = None
