-- CreateTable
CREATE TABLE "Userdetals" (
    "id" SERIAL NOT NULL,
    "ProfileLink" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "Province" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Userdetals_pkey" PRIMARY KEY ("id")
);
