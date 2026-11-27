-- Profile details and alert settings.
ALTER TABLE "users"
  ADD COLUMN "phone" TEXT,
  ADD COLUMN "company" TEXT,
  ADD COLUMN "alert_offline" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "alert_long_stop" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "alert_gps_lost" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "quiet_hours" BOOLEAN NOT NULL DEFAULT false;
