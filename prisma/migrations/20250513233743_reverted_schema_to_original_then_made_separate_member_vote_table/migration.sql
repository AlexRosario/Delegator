/*
  Warnings:

  - You are about to drop the `Bill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `address` on the `FieldOffice` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `FieldOffice` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `FieldOffice` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `FieldOffice` table. All the data in the column will be lost.
  - You are about to drop the column `zipcode` on the `FieldOffice` table. All the data in the column will be lost.
  - You are about to drop the column `memberId` on the `Vote` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Bill";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "MemberVote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "memberName" TEXT NOT NULL,
    "billId" TEXT NOT NULL,
    "vote" TEXT NOT NULL,
    "date" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_UserVotes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_UserVotes_A_fkey" FOREIGN KEY ("A") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserVotes_B_fkey" FOREIGN KEY ("B") REFERENCES "Vote" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_MemberVotes" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_MemberVotes_A_fkey" FOREIGN KEY ("A") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MemberVotes_B_fkey" FOREIGN KEY ("B") REFERENCES "MemberVote" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FieldOffice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "memberId" TEXT NOT NULL,
    CONSTRAINT "FieldOffice_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FieldOffice" ("id", "memberId") SELECT "id", "memberId" FROM "FieldOffice";
DROP TABLE "FieldOffice";
ALTER TABLE "new_FieldOffice" RENAME TO "FieldOffice";
CREATE TABLE "new_Vote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "billId" TEXT NOT NULL,
    "vote" TEXT NOT NULL,
    "date" DATETIME NOT NULL
);
INSERT INTO "new_Vote" ("billId", "date", "id", "vote") SELECT "billId", "date", "id", "vote" FROM "Vote";
DROP TABLE "Vote";
ALTER TABLE "new_Vote" RENAME TO "Vote";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_UserVotes_AB_unique" ON "_UserVotes"("A", "B");

-- CreateIndex
CREATE INDEX "_UserVotes_B_index" ON "_UserVotes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MemberVotes_AB_unique" ON "_MemberVotes"("A", "B");

-- CreateIndex
CREATE INDEX "_MemberVotes_B_index" ON "_MemberVotes"("B");
