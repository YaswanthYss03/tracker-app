-- TimescaleDB powers the positions time-series table.
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('inventory', 'active', 'suspended');

-- CreateEnum
CREATE TYPE "AccessRole" AS ENUM ('owner', 'viewer');

-- CreateEnum
CREATE TYPE "CommandStatus" AS ENUM ('sent', 'replied', 'timeout', 'failed');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devices" (
    "id" UUID NOT NULL,
    "imei" TEXT NOT NULL,
    "sim_number" TEXT,
    "model" TEXT NOT NULL DEFAULT 'GT06N',
    "activation_code_hash" TEXT NOT NULL,
    "status" "DeviceStatus" NOT NULL DEFAULT 'inventory',
    "name" TEXT,
    "icon" TEXT,
    "speed_limit_kmh" SMALLINT,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "failed_claim_attempts" INTEGER NOT NULL DEFAULT 0,
    "claim_locked_until" TIMESTAMPTZ(3),
    "last_lat" DOUBLE PRECISION,
    "last_lon" DOUBLE PRECISION,
    "last_speed" SMALLINT,
    "last_course" SMALLINT,
    "last_satellites" SMALLINT,
    "last_gps_time" TIMESTAMPTZ(3),
    "last_acc" BOOLEAN,
    "last_charging" BOOLEAN,
    "last_battery_level" SMALLINT,
    "last_gsm_signal" SMALLINT,
    "last_seen_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_access" (
    "device_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" "AccessRole" NOT NULL,
    "notify" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "device_access_pkey" PRIMARY KEY ("device_id","user_id")
);

-- CreateTable
CREATE TABLE "positions" (
    "device_id" UUID NOT NULL,
    "gps_time" TIMESTAMPTZ(3) NOT NULL,
    "received_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lat" DOUBLE PRECISION NOT NULL,
    "lon" DOUBLE PRECISION NOT NULL,
    "speed" SMALLINT NOT NULL,
    "course" SMALLINT NOT NULL,
    "satellites" SMALLINT NOT NULL,
    "valid" BOOLEAN NOT NULL,
    "acc" BOOLEAN,
    "extra" JSONB,

    CONSTRAINT "positions_pkey" PRIMARY KEY ("device_id","gps_time")
);

-- CreateTable
CREATE TABLE "trips" (
    "id" UUID NOT NULL,
    "device_id" UUID NOT NULL,
    "start_time" TIMESTAMPTZ(3) NOT NULL,
    "end_time" TIMESTAMPTZ(3),
    "start_lat" DOUBLE PRECISION NOT NULL,
    "start_lon" DOUBLE PRECISION NOT NULL,
    "end_lat" DOUBLE PRECISION,
    "end_lon" DOUBLE PRECISION,
    "distance_m" INTEGER NOT NULL DEFAULT 0,
    "max_speed" SMALLINT NOT NULL DEFAULT 0,
    "avg_speed" SMALLINT NOT NULL DEFAULT 0,
    "duration_s" INTEGER NOT NULL DEFAULT 0,
    "idle_s" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_stats" (
    "device_id" UUID NOT NULL,
    "day" DATE NOT NULL,
    "distance_m" INTEGER NOT NULL DEFAULT 0,
    "max_speed" SMALLINT NOT NULL DEFAULT 0,
    "driving_s" INTEGER NOT NULL DEFAULT 0,
    "idle_s" INTEGER NOT NULL DEFAULT 0,
    "trips_count" SMALLINT NOT NULL DEFAULT 0,

    CONSTRAINT "daily_stats_pkey" PRIMARY KEY ("device_id","day")
);

-- CreateTable
CREATE TABLE "events" (
    "id" UUID NOT NULL,
    "device_id" UUID NOT NULL,
    "time" TIMESTAMPTZ(3) NOT NULL,
    "type" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lon" DOUBLE PRECISION,
    "payload" JSONB,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geofences" (
    "id" UUID NOT NULL,
    "device_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "geometry" JSONB NOT NULL,
    "radius_m" INTEGER,
    "alert_on_enter" BOOLEAN NOT NULL DEFAULT true,
    "alert_on_exit" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "geofences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "share_links" (
    "token" TEXT NOT NULL,
    "device_id" UUID NOT NULL,
    "created_by" UUID NOT NULL,
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "revoked_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "share_links_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "push_tokens" (
    "token" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "platform" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "push_tokens_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "revoked_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commands_log" (
    "id" UUID NOT NULL,
    "device_id" UUID NOT NULL,
    "user_id" UUID,
    "command" TEXT NOT NULL,
    "response" TEXT,
    "status" "CommandStatus" NOT NULL DEFAULT 'sent',
    "sent_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responded_at" TIMESTAMPTZ(3),

    CONSTRAINT "commands_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raw_packets" (
    "id" BIGSERIAL NOT NULL,
    "imei" TEXT,
    "remote" TEXT NOT NULL,
    "protocol" SMALLINT,
    "hex" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "received_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "raw_packets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "devices_imei_key" ON "devices"("imei");

-- CreateIndex
CREATE INDEX "devices_status_idx" ON "devices"("status");

-- CreateIndex
CREATE INDEX "device_access_user_id_idx" ON "device_access"("user_id");

-- CreateIndex
CREATE INDEX "trips_device_id_start_time_idx" ON "trips"("device_id", "start_time" DESC);

-- CreateIndex
CREATE INDEX "events_device_id_time_idx" ON "events"("device_id", "time" DESC);

-- CreateIndex
CREATE INDEX "geofences_device_id_idx" ON "geofences"("device_id");

-- CreateIndex
CREATE INDEX "share_links_device_id_idx" ON "share_links"("device_id");

-- CreateIndex
CREATE INDEX "push_tokens_user_id_idx" ON "push_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "commands_log_device_id_sent_at_idx" ON "commands_log"("device_id", "sent_at" DESC);

-- CreateIndex
CREATE INDEX "raw_packets_received_at_idx" ON "raw_packets"("received_at");

-- AddForeignKey
ALTER TABLE "device_access" ADD CONSTRAINT "device_access_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_access" ADD CONSTRAINT "device_access_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "positions" ADD CONSTRAINT "positions_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_stats" ADD CONSTRAINT "daily_stats_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geofences" ADD CONSTRAINT "geofences_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "share_links" ADD CONSTRAINT "share_links_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "share_links" ADD CONSTRAINT "share_links_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "push_tokens" ADD CONSTRAINT "push_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commands_log" ADD CONSTRAINT "commands_log_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commands_log" ADD CONSTRAINT "commands_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- ---------------------------------------------------------------------------
-- TimescaleDB setup for positions (Prisma doesn't generate this part).
-- ---------------------------------------------------------------------------

-- Split positions into 1-day chunks by GPS time. The primary key
-- (device_id, gps_time) already gives the index we need, so skip the default one.
SELECT create_hypertable('positions', by_range('gps_time', INTERVAL '1 day'),
                         create_default_indexes => false);

-- Compress chunks older than 7 days (typically ~90% smaller).
-- Segmenting by device keeps "history for one device" queries fast.
ALTER TABLE positions SET (
  timescaledb.compress,
  timescaledb.compress_segmentby = 'device_id',
  timescaledb.compress_orderby = 'gps_time DESC'
);
SELECT add_compression_policy('positions', INTERVAL '7 days');

-- Delete raw positions after 180 days. Trips, daily stats and events are kept.
-- To change later: SELECT remove_retention_policy('positions');
--                  SELECT add_retention_policy('positions', INTERVAL '<n> days');
SELECT add_retention_policy('positions', INTERVAL '180 days');
