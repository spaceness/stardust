-- CreateEnum
CREATE TYPE "Arch" AS ENUM ('ARM64', 'AMD64');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "name" TEXT NOT NULL,
    "dockerImage" TEXT NOT NULL,
    "friendlyName" TEXT NOT NULL,
    "supportedArch" "Arch"[],
    "category" TEXT[],
    "icon" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Image_dockerImage_key" ON "Image"("dockerImage");
