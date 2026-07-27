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
  const environment = process.env.NEXT_PUBLIC_PADDLE_ENV === "production" ? "production" : "sandbox";

  if (!token) {
    console.error("NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is not set — Paddle cannot initialize.");
    setState({ failed: true });
    return;
  }

  paddlePromise = initializePaddle({
    environment,
    token,
    eventCallback(event) {
      if (event.name === "checkout.completed") {
        checkoutCompletedListeners.forEach((fn) => fn(event.data));
      }
    },
  })
    .then((instance) => {
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
