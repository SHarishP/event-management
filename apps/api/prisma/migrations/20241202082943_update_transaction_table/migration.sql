/*
  Warnings:

  - You are about to drop the column `paidIn` on the `transaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `Transaction_paidIn_fkey`;

-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `paidIn`,
    ADD COLUMN `paymentId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
