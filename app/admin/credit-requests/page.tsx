import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import AdminCreditRequestRow from "@/app/components/AdminCreditRequestRow";
import type { CreditPurchaseRequest, User } from "@prisma/client";

export default async function AdminCreditRequestsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  const requests = await prisma.creditPurchaseRequest.findMany({
    where: { status: "pending" },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-16">
      <h1 className="text-2xl font-semibold">Pending credit requests</h1>
      {requests.length === 0 ? (
        <p className="text-sm text-zinc-500">No pending requests.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {requests.map((r: CreditPurchaseRequest & { user: User }) => (
            <AdminCreditRequestRow
              key={r.id}
              request={{
                id: r.id,
                email: r.user.email,
                method: r.method,
                transactionRef: r.transactionRef,
                credits: r.credits,
                createdAt: r.createdAt.toISOString(),
              }}
            />
          ))}
        </div>
      )}
    </main>
  );
}
