-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "telegram_id" INTEGER,
    "name" TEXT,
    "username" TEXT,
    "phoneNumber" TEXT,
    "status" TEXT,
    "password" TEXT NOT NULL,
    "session" TEXT,
    "role_id" INTEGER NOT NULL DEFAULT 2,
    "operator_id" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "id", "name", "operator_id", "password", "phoneNumber", "role_id", "session", "status", "telegram_id", "updatedAt", "username") SELECT "createdAt", "id", "name", "operator_id", "password", "phoneNumber", "role_id", "session", "status", "telegram_id", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
