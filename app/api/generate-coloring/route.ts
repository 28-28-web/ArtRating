import { NextResponse } from "next/server";
import { generateText2Img } from "@/app/lib/cloudflareText2Img";
import { auth } from "@/auth";
import { ANON_ID_COOKIE, readCookie, verifyAnonId } from "@/app/lib/anonId";
import { checkGenerationEligibility, recordSuccessfulGeneration, type GatePool } from "@/app/lib/generationGate";
import { processGenerationOutput } from "@/app/lib/generationOutput";
import { capReachedResponse } from "@/app/lib/capReachedResponse";

const TOOL_ID = "coloring";
const DEBUG_GENERATION = process.env.DEBUG_GENERATION === "true";

// Own pool, not the shared one the other 5 tools share — this is a kids/
// classroom tool, more generous by design, and shouldn't eat into or be
// eaten by the headshot/pet-to-human/etc free uses.
const COLORING_POOL: GatePool = { cap: 3, poolId: "coloring", toolIds: [TOOL_ID] };

const COLORING_STEPS = 20;
const COLORING_NEGATIVE_PROMPT =
  "color, grey, shading, realistic, photograph, watercolor, painting, text, signature";

const STYLE_MODIFIERS: Record<string, string> = {
  simple: "simple thick lines, suitable for children, minimal detail",
  detailed: "intricate fine lines, detailed illustration, adult coloring book",
  mandala: "mandala pattern, geometric, symmetrical, zentangle style",
  cartoon: "cartoon style, bold black outlines, fun and playful",
};

function buildPrompt(userPrompt: string, style: string) {
  const key = style.trim().toLowerCase();
  const modifier = STYLE_MODIFIERS[key] ?? STYLE_MODIFIERS.simple;
  return `coloring page, black and white line art, thick outlines, no shading, white background, printable, ${modifier}, ${userPrompt}`;
}

function unavailable() {
  return NextResponse.json(
    { error: "Preview generation temporarily unavailable" },
    { status: 200 }
  );
}

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const anonId = await verifyAnonId(readCookie(request.headers.get("cookie"), ANON_ID_COOKIE));

  const gate = await checkGenerationEligibility({ anonId, userId, pool: COLORING_POOL });
  if (!gate.allowed) {
    return capReachedResponse(userId, COLORING_POOL.cap);
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    return unavailable();
  }

  let userPrompt: string;
  let style: string;
  try {
    const body = await request.json();
    userPrompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
    style = typeof body?.style === "string" && body.style.trim() ? body.style : "simple";
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!userPrompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const prompt = buildPrompt(userPrompt, style);

  if (DEBUG_GENERATION) {
    console.log("[generate-coloring] requested style:", style);
    console.log("[generate-coloring] resolved prompt:", prompt);
  }

  const result = await generateText2Img({
    accountId,
    apiToken,
    prompt,
    negativePrompt: COLORING_NEGATIVE_PROMPT,
    numSteps: COLORING_STEPS,
  });

  if (!result.image) {
    return unavailable();
  }

  let output;
  try {
    output = await processGenerationOutput({
      rawDataUrl: result.image,
      toolId: TOOL_ID,
      storeClean: !!userId,
    });
  } catch (error) {
    console.error("[generate-coloring] processGenerationOutput failed:", error);
    return unavailable();
  }
  const { generationId } = await recordSuccessfulGeneration({
    toolId: TOOL_ID,
    imageUrl: output.previewUrl,
    cleanImageUrl: output.cleanUrl,
    userId,
    anonId,
    pool: COLORING_POOL,
  });

  return NextResponse.json({ image: output.previewUrl ?? output.previewDataUrl, generationId });
}
