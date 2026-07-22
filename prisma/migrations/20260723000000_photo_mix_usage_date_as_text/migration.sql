-- AlterTable: usageDate DATE -> TEXT (literal "YYYY-MM-DD"), see schema.prisma comment.
ALTER TABLE "PhotoMixDailyUsage" ALTER COLUMN "usageDate" TYPE TEXT USING "usageDate"::text;
