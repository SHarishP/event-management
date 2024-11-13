-- CreateTable
CREATE TABLE `Eo_data` (
    `eo_id` INTEGER NOT NULL AUTO_INCREMENT,
    `eo_name` VARCHAR(30) NOT NULL,
    `eo_email` VARCHAR(191) NOT NULL,
    `eo_password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Eo_data_eo_email_key`(`eo_email`),
    PRIMARY KEY (`eo_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
