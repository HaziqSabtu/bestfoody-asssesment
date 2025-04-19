/*
  Warnings:

  - Added the required column `userId` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Restaurant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imageId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Restaurant_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "RestaurantImage" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Restaurant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Restaurant" ("category", "createdAt", "deletedAt", "id", "imageId", "name", "updatedAt") SELECT "category", "createdAt", "deletedAt", "id", "imageId", "name", "updatedAt" FROM "Restaurant";
DROP TABLE "Restaurant";
ALTER TABLE "new_Restaurant" RENAME TO "Restaurant";
CREATE UNIQUE INDEX "Restaurant_imageId_key" ON "Restaurant"("imageId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
