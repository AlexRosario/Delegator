/*
  Warnings:

  - You are about to drop the column `userId` on the `Vote` table. All the data in the column will be lost.
  - Added the required column `memberId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_passwordHash_key";

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "party" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "photoURL" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "url" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "FieldOffice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "phone" TEXT,
    "memberId" TEXT NOT NULL,
    CONSTRAINT "FieldOffice_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Bill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "introducedDate" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_UserMembers" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_UserMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Vote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "memberId" TEXT NOT NULL,
    "billId" TEXT NOT NULL,
    "vote" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    CONSTRAINT "Vote_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Vote_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Vote" ("billId", "date", "id", "vote") SELECT "billId", "date", "id", "vote" FROM "Vote";
DROP TABLE "Vote";
ALTER TABLE "new_Vote" RENAME TO "Vote";
CREATE UNIQUE INDEX "Vote_memberId_billId_key" ON "Vote"("memberId", "billId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_UserMembers_AB_unique" ON "_UserMembers"("A", "B");

-- CreateIndex
CREATE INDEX "_UserMembers_B_index" ON "_UserMembers"("B");
