-- CreateTable
CREATE TABLE "USer" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "Role" TEXT NOT NULL DEFAULT 'User',
    "PhoneNumber" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hashpassword" TEXT NOT NULL,

    CONSTRAINT "USer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "USer_PhoneNumber_key" ON "USer"("PhoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "USer_email_key" ON "USer"("email");
