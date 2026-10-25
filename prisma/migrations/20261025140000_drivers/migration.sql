-- Drivers: each user's own list (name, phone, licence, photo or illustration).
CREATE TABLE "drivers" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT,
  "licence_no" TEXT,
  "licence_expiry" DATE,
  "avatar" TEXT,
  "photo" BYTEA,
  "photo_type" TEXT,
  "photo_updated_at" TIMESTAMPTZ(3),
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "drivers_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "drivers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "drivers_user_id_idx" ON "drivers"("user_id");

-- Vehicles: main + backup driver, body colour.
ALTER TABLE "devices"
  ADD COLUMN "main_driver_id" UUID,
  ADD COLUMN "backup_driver_id" UUID,
  ADD COLUMN "color" TEXT,
  ADD CONSTRAINT "devices_main_driver_id_fkey" FOREIGN KEY ("main_driver_id") REFERENCES "drivers"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "devices_backup_driver_id_fkey" FOREIGN KEY ("backup_driver_id") REFERENCES "drivers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Move the free-text driver names into drivers (one per owner + name).
INSERT INTO "drivers" ("user_id", "name")
SELECT DISTINCT a."user_id", d."driver_name"
FROM "devices" d JOIN "device_access" a ON a."device_id" = d."id" AND a."role" = 'owner'
WHERE d."driver_name" IS NOT NULL;

UPDATE "devices" d SET "main_driver_id" = dr."id"
FROM "device_access" a, "drivers" dr
WHERE a."device_id" = d."id" AND a."role" = 'owner' AND dr."user_id" = a."user_id" AND dr."name" = d."driver_name";

ALTER TABLE "devices" DROP COLUMN "driver_name";
