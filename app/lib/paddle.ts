"use client";

import { useEffect, useSyncExternalStore } from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";

const INIT_TIMEOUT_MS = 8000;

type PaddleState = { paddle: Paddle | undefined; failed: boolean };

// Module-level singleton — Paddle only needs to initialize once per page
// load, not once per component instance. Exposed to components via
// useSyncExternalStore (see ThemeToggle.tsx for the same pattern in this
// codebase) rather than useEffect+setState, which this project's
// react-hooks/set-state-in-effect lint rule rejects for exactly this shape:
// syncing already-resolved external state into React on mount.
let currentState: PaddleState = { paddle: undefined, failed: false };
let paddlePromise: Promise<Paddle | undefined> | null = null;
const stateListeners = new Set<() => void>();
const checkoutCompletedListeners = new Set<(data: unknown) => void>();

function setState(next: Partial<PaddleState>) {
  currentState = { ...currentState, ...next };
  stateListeners.forEach((fn) => fn());
}

function subscribe(callback: () => void) {
  stateListeners.add(callback);
  return () => stateListeners.delete(callback);
}

function getSnapshot(): PaddleState {
  return currentState;
}

// Same shape on server and first client render — Paddle never initializes
// during SSR, so there's nothing to diverge on.
function getServerSnapshot(): PaddleState {
  return currentState;
}

function ensureInit() {
  if (currentState.paddle || currentState.failed || paddlePromise) return;

  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  const rawEnv = process.env.NEXT_PUBLIC_PADDLE_ENV;
  const environment = rawEnv === "production" ? "production" : "sandbox";

  // NEXT_PUBLIC_* vars are inlined into the client bundle at BUILD time, not
  // read at runtime — if this logs environment:"sandbox" or tokenPresent:
  // false on a deploy where the env vars are definitely set, the build ran
  // before those vars were available to it and the bundle needs rebuilding,
  // not just redeploying. Log every init attempt (not just failures) so
  // this is checkable without waiting for a failure to reproduce.
  console.log("[paddle] initializing", {
    rawNextPublicPaddleEnv: rawEnv,
    resolvedEnvironment: environment,
    tokenPresent: !!token,
    tokenPrefix: token ? token.slice(0, 8) : null,
  });

  if (!token) {
    console.error("NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is not set — Paddle cannot initialize.");
    setState({ failed: true });
    return;
  }

  paddlePromise = initializePaddle({
    environment,
    token,
    eventCallback(event) {
      // Log every event during diagnosis, not just the ones this app acts
      // on — "checkout.error" (and friends) carry Paddle's actual reason
      // for a failed checkout, which was previously dropped entirely since
      // only "checkout.completed" was handled. This is almost certainly
      // where the real "Something went wrong" cause will show up: check
      // devtools console for a "[paddle] event" log with name
      // "checkout.error" and read its .data/.error payload.
      console.log("[paddle] event", event.name, event);
      if (event.name === "checkout.completed") {
        checkoutCompletedListeners.forEach((fn) => fn(event.data));
      }
    },
  })
    .then((instance) => {
      console.log("[paddle] initialized OK", { environment });
      setState({ paddle: instance });
      return instance;
    })
    .catch((err) => {
      console.error("Paddle init error:", err);
      setState({ failed: true });
      paddlePromise = null;
      return undefined;
    });

  setTimeout(() => {
    if (!currentState.paddle && !currentState.failed) {
      console.error(`Paddle init did not resolve within ${INIT_TIMEOUT_MS}ms — treating as failed.`);
      setState({ failed: true });
    }
  }, INIT_TIMEOUT_MS);
}

// Returns { paddle, failed }. `paddle` is undefined until the SDK is ready.
// `failed` becomes true if init errors OR doesn't resolve within
// INIT_TIMEOUT_MS — callers must treat that as "assume it's never coming"
// and show a retry/reload option, not a permanently disabled button.
export function usePaddle(): PaddleState {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    ensureInit();
  }, []);

  return state;
}

// Paddle.js only accepts one eventCallback, registered at init time — this
// module-level singleton fans it out to whichever component is currently
// mounted and cares (i.e. CreditsForm). Note this fires on the client-side
// "checkout.completed" event, which is optimistic UI feedback only — the
// actual credit grant happens server-side once the Paddle webhook lands
// (see app/api/webhook/paddle/route.ts), which can be a few seconds later.
export function onCheckoutCompleted(handler: (data: unknown) => void): () => void {
  checkoutCompletedListeners.add(handler);
  return () => checkoutCompletedListeners.delete(handler);
}
