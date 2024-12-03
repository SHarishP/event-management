/*
  Warnings:

  - You are about to drop the column `transactionId` on the `payment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_transactionId_fkey`;

-- AlterTable
ALTER TABLE `payment` DROP COLUMN `transactionId`;

-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `paidIn` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_paidIn_fkey` FOREIGN KEY (`paidIn`) REFERENCES `Payment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
