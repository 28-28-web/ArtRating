-- Drop removed table (photo-mix tool deleted)
DROP TABLE "PhotoMixDailyUsage";

-- CreateTable
CREATE TABLE "HeadshotDailyUsage" (
    "userId" TEXT NOT NULL,
    "usageDate" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "HeadshotDailyUsage_pkey" PRIMARY KEY ("userId","usageDate")
);

-- CreateTable
CREATE TABLE "FreeGenerationLog" (
    "id" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "fingerprintHash" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "firstSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeen" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FreeGenerationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IpDailyUsage" (
    "ipAddress" TEXT NOT NULL,
    "usageDate" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "IpDailyUsage_pkey" PRIMARY KEY ("ipAddress","usageDate")
);

-- CreateTable
CREATE TABLE "DailyNeuronUsage" (
    "usageDate" TEXT NOT NULL,
    "neuronCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DailyNeuronUsage_pkey" PRIMARY KEY ("usageDate")
);

-- CreateIndex
CREATE INDEX "FreeGenerationLog_ipAddress_idx" ON "FreeGenerationLog"("ipAddress");

-- CreateIndex
CREATE UNIQUE INDEX "FreeGenerationLog_ipAddress_fingerprintHash_key" ON "FreeGenerationLog"("ipAddress", "fingerprintHash");
