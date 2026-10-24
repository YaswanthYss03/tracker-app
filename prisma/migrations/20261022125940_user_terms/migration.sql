/*
  Warnings:

  - Added the required column `terms_accepted_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "terms_accepted_at" TIMESTAMPTZ(3) NOT NULL;
