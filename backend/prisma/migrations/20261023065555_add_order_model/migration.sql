-- AlterTable
ALTER TABLE `Equipment` ALTER COLUMN `deposit` DROP DEFAULT,
    ALTER COLUMN `weightKg` DROP DEFAULT,
    ALTER COLUMN `dimensions` DROP DEFAULT,
    ALTER COLUMN `location` DROP DEFAULT,
    ALTER COLUMN `distance` DROP DEFAULT;

-- CreateTable
CREATE TABLE `Order` (
    `id` VARCHAR(191) NOT NULL,
    `invoiceNumber` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `equipmentId` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `rentalDays` INTEGER NOT NULL,
    `deliveryMethod` VARCHAR(191) NOT NULL,
    `rentalCost` INTEGER NOT NULL,
    `shippingCost` INTEGER NOT NULL,
    `depositAmount` INTEGER NOT NULL,
    `lateFee` INTEGER NOT NULL DEFAULT 0,
    `damageFee` INTEGER NOT NULL DEFAULT 0,
    `totalPaid` INTEGER NOT NULL,
    `status` ENUM('MENUNGGU_KONFIRMASI', 'DIKIRIM', 'SEWA_AKTIF', 'INSPEKSI', 'SELESAI', 'DISPUTE', 'DIBATALKAN') NOT NULL DEFAULT 'MENUNGGU_KONFIRMASI',
    `returnData` JSON NULL,
    `disputeNote` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Order_invoiceNumber_key`(`invoiceNumber`),
    INDEX `Order_userId_idx`(`userId`),
    INDEX `Order_equipmentId_idx`(`equipmentId`),
    INDEX `Order_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `Equipment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
