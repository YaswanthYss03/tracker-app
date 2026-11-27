-- Service history per vehicle (deleted with the vehicle's other history on release).
CREATE TABLE "service_records" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "device_id" UUID NOT NULL,
  "type" TEXT NOT NULL,
  "date" DATE NOT NULL,
  "odometer_km" INTEGER,
  "garage" TEXT,
  "cost" INTEGER,
  "notes" TEXT,
  "next_due_date" DATE,
  "created_by" UUID,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "service_records_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "service_records_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "service_records_device_id_date_idx" ON "service_records"("device_id", "date" DESC);
