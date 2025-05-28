/*
  Warnings:

  - You are about to drop the `_UserVotes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_UserVotes_B_index";

-- DropIndex
DROP INDEX "_UserVotes_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_UserVotes";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Vote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "billId" TEXT NOT NULL,
    "vote" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Vote" ("billId", "date", "id", "userId", "vote") SELECT "billId", "date", "id", "userId", "vote" FROM "Vote";
DROP TABLE "Vote";
ALTER TABLE "new_Vote" RENAME TO "Vote";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
