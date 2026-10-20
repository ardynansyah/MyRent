-- AlterTable
ALTER TABLE `User` ADD COLUMN `adminNote` TEXT NULL,
    ADD COLUMN `kycData` JSON NULL,
    ADD COLUMN `revisionSteps` JSON NULL,
    ADD COLUMN `submissionCode` VARCHAR(191) NULL,
    ADD COLUMN `verificationStatus` ENUM('MENUNGGU', 'PERLU_PERBAIKAN', 'DISETUJUI', 'DITOLAK') NOT NULL DEFAULT 'MENUNGGU';

-- CreateIndex
CREATE UNIQUE INDEX `User_submissionCode_key` ON `User`(`submissionCode`);
