/*
  Warnings:

  - You are about to drop the `_MemberVotes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_MemberVotes_B_index";

-- DropIndex
DROP INDEX "_MemberVotes_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_MemberVotes";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MemberVote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "billId" TEXT NOT NULL,
    "vote" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "bioguideId" TEXT NOT NULL,
    CONSTRAINT "MemberVote_bioguideId_fkey" FOREIGN KEY ("bioguideId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MemberVote" ("billId", "bioguideId", "date", "id", "vote") SELECT "billId", "bioguideId", "date", "id", "vote" FROM "MemberVote";
DROP TABLE "MemberVote";
ALTER TABLE "new_MemberVote" RENAME TO "MemberVote";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
