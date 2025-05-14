/*
  Warnings:

  - You are about to drop the column `memberName` on the `MemberVote` table. All the data in the column will be lost.
  - Added the required column `bioguideId` to the `MemberVote` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MemberVote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bioguideId" TEXT NOT NULL,
    "billId" TEXT NOT NULL,
    "vote" TEXT NOT NULL,
    "date" DATETIME NOT NULL
);
INSERT INTO "new_MemberVote" ("billId", "date", "id", "vote") SELECT "billId", "date", "id", "vote" FROM "MemberVote";
DROP TABLE "MemberVote";
ALTER TABLE "new_MemberVote" RENAME TO "MemberVote";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
