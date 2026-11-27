-- Trips started by hand: data after started_at belongs to the latest one.
CREATE TABLE "trip_logs" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "device_id" UUID NOT NULL,
  "name" TEXT,
  "started_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by" UUID,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "trip_logs_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "trip_logs_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "trip_logs_device_id_started_at_idx" ON "trip_logs"("device_id", "started_at" DESC);
