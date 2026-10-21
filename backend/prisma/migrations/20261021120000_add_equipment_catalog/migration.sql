-- AlterTable
ALTER TABLE `Equipment`
    ADD COLUMN `description` TEXT NOT NULL,
    ADD COLUMN `deposit` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `weightKg` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `dimensions` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `maintenanceBufferDays` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `location` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `distance` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `status` ENUM('TERSEDIA', 'DISEWA', 'MAINTENANCE') NOT NULL DEFAULT 'TERSEDIA',
    ADD COLUMN `images` JSON NULL;

-- CreateIndex
CREATE INDEX `Equipment_status_idx` ON `Equipment`(`status`);
