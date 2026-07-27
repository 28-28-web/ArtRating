-- CreateTable
CREATE TABLE "PaddlePurchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paddleOrderId" TEXT NOT NULL,
    "priceId" TEXT NOT NULL,
    "creditsAdded" INTEGER NOT NULL,
    "amountPaidCents" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaddlePurchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaddlePurchase_paddleOrderId_key" ON "PaddlePurchase"("paddleOrderId");

-- CreateIndex
CREATE INDEX "PaddlePurchase_userId_idx" ON "PaddlePurchase"("userId");

-- AddForeignKey
ALTER TABLE "PaddlePurchase" ADD CONSTRAINT "PaddlePurchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
