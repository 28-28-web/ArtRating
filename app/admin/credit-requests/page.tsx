import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import AdminCreditRequestRow from "@/app/components/AdminCreditRequestRow";
import BrushDivider from "@/app/components/BrushDivider";
import { buildMetadata } from "@/app/lib/seo";
import type { CreditPurchaseRequest, User } from "@prisma/client";

// This route had no metadata export at all, so it inherited the root layout's
// `alternates: { canonical: "/" }` and declared itself a duplicate of the
// homepage. It now carries its own canonical and a noindex.
export const metadata = buildMetadata({
  title: "Credit Requests | HeadshotMaker AI",
  description: "Internal admin view for reviewing pending credit purchase requests.",
  path: "/admin/credit-requests",
  noindex: true,
});

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
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Pending credit requests</h1>
        <BrushDivider className="mt-1" />
      </div>
      {requests.length === 0 ? (
        <p className="text-sm text-ink-soft">No pending requests.</p>
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
