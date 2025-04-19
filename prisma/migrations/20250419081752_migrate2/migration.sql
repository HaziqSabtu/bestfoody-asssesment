-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Restaurant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "imageId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Restaurant_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "RestaurantImage" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Restaurant" ("category", "createdAt", "deletedAt", "id", "imageId", "name", "updatedAt") SELECT "category", "createdAt", "deletedAt", "id", "imageId", "name", "updatedAt" FROM "Restaurant";
DROP TABLE "Restaurant";
ALTER TABLE "new_Restaurant" RENAME TO "Restaurant";
CREATE UNIQUE INDEX "Restaurant_imageId_key" ON "Restaurant"("imageId");
CREATE TABLE "new_RestaurantRating" (
    "restaurantId" TEXT NOT NULL PRIMARY KEY,
    "averageRating" REAL NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RestaurantRating_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RestaurantRating" ("averageRating", "lastUpdated", "restaurantId", "reviewCount") SELECT "averageRating", "lastUpdated", "restaurantId", "reviewCount" FROM "RestaurantRating";
DROP TABLE "RestaurantRating";
ALTER TABLE "new_RestaurantRating" RENAME TO "RestaurantRating";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
