/*
  Warnings:

  - You are about to drop the column `categoryId` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `event` table. All the data in the column will be lost.
  - Added the required column `category` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `event` DROP FOREIGN KEY `Event_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `event` DROP FOREIGN KEY `Event_locationId_fkey`;

-- AlterTable
ALTER TABLE `event` DROP COLUMN `categoryId`,
    DROP COLUMN `locationId`,
    ADD COLUMN `category` VARCHAR(191) NOT NULL,
    ADD COLUMN `location` VARCHAR(191) NOT NULL;
