-- CreateTable
CREATE TABLE "PhotoMixDailyUsage" (
    "id" TEXT NOT NULL,
    "identityKey" TEXT NOT NULL,
    "usageDate" DATE NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PhotoMixDailyUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PhotoMixDailyUsage_identityKey_usageDate_key" ON "PhotoMixDailyUsage"("identityKey", "usageDate");
