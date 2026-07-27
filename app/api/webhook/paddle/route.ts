import { NextResponse } from "next/server";
import { Paddle, EventName } from "@paddle/paddle-node-sdk";
import { creditsForPriceId } from "@/app/lib/creditPacks";
import { processPaddlePurchase } from "@/app/lib/paddlePurchases";

// Pattern mirrors BookKraft AI's app/api/paddle-webhook/route.js — signature
// verification via the official SDK (never hand-rolled HMAC), fail closed
// if the webhook secret isn't configured, and every failure path returns a
// non-2xx status so Paddle retries delivery instead of marking it delivered
// on a write that didn't happen.
export async function POST(request: Request) {
  const rawBody = await request.text();

  try {
    const signature = request.headers.get("paddle-signature");
    const secret = process.env.PADDLE_WEBHOOK_SECRET;

    if (!secret) {
      console.error("Paddle webhook: PADDLE_WEBHOOK_SECRET is not set — refusing to process.");
      return NextResponse.json({ error: "webhook_not_configured" }, { status: 500 });
    }
    if (!signature) {
      return NextResponse.json({ error: "missing_signature" }, { status: 401 });
    }

    // The SDK's Paddle class requires an API key to construct even though
    // .webhooks.unmarshal() only does local signature verification (no
    // network call) — PADDLE_API_KEY has to be set alongside
    // PADDLE_WEBHOOK_SECRET for this route to work at all.
    const apiKey = process.env.PADDLE_API_KEY;
    if (!apiKey) {
      console.error("Paddle webhook: PADDLE_API_KEY is not set — refusing to process.");
      return NextResponse.json({ error: "webhook_not_configured" }, { status: 500 });
    }

    const paddle = new Paddle(apiKey);
    let event;
    try {
      event = await paddle.webhooks.unmarshal(rawBody, secret, signature);
    } catch {
      console.error("Paddle webhook: invalid signature");
      return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
    }

    if (!event || event.eventType !== EventName.TransactionCompleted) {
      return NextResponse.json({ received: true });
    }

    const transaction = event.data;
    const paddleOrderId = transaction.id;
    const userId = typeof transaction.customData?.userId === "string" ? transaction.customData.userId : null;
    const priceId = transaction.items?.[0]?.price?.id ?? null;
    const total = transaction.details?.totals?.total;
    const amountPaidCents = total ? Math.round(Number(total)) : null;

    if (!paddleOrderId) {
      console.error("Paddle webhook: missing transaction id");
      return NextResponse.json({ error: "missing_transaction_id" }, { status: 400 });
    }
    if (!userId) {
      console.error("Paddle webhook: missing customData.userId");
      return NextResponse.json({ error: "missing_user_id" }, { status: 400 });
    }
    if (!priceId) {
      console.error("Paddle webhook: missing price id on transaction");
      return NextResponse.json({ error: "missing_price_id" }, { status: 400 });
    }

    const creditsToAdd = creditsForPriceId(priceId);
    if (creditsToAdd === null) {
      console.error("Paddle webhook: unrecognized priceId", priceId);
      return NextResponse.json({ error: "unknown_price_id" }, { status: 400 });
    }

    let result;
    try {
      result = await processPaddlePurchase({
        userId,
        paddleOrderId,
        priceId,
        creditsToAdd,
        amountPaidCents,
      });
    } catch (err) {
      console.error("processPaddlePurchase failed:", err);
      return NextResponse.json({ error: "purchase_processing_failed" }, { status: 500 });
    }

    return NextResponse.json({ received: true, alreadyProcessed: result.alreadyProcessed });
  } catch (err) {
    console.error("Paddle webhook error:", err);
    return NextResponse.json({ error: "webhook_error" }, { status: 500 });
  }
}
