/*
  Warnings:

  - A unique constraint covering the columns `[nama]` on the table `deductions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nama]` on the table `earnings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nama]` on the table `grades` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nama]` on the table `positions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tanggalMasuk` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `payrolls` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `company_profile` ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `telepon` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `deductions` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `earnings` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `employees` ADD COLUMN `status` ENUM('AKTIF', 'NONAKTIF') NOT NULL DEFAULT 'AKTIF',
    ADD COLUMN `tanggalMasuk` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `payrolls` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `deductions_nama_key` ON `deductions`(`nama`);

-- CreateIndex
CREATE UNIQUE INDEX `earnings_nama_key` ON `earnings`(`nama`);

-- CreateIndex
CREATE UNIQUE INDEX `grades_nama_key` ON `grades`(`nama`);

-- CreateIndex
CREATE UNIQUE INDEX `positions_nama_key` ON `positions`(`nama`);
