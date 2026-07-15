import { NextResponse } from "next/server";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const FREE_MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "openai/gpt-oss-120b:free",
  "openrouter/free",
];

const SYSTEM_PROMPTS: Record<"art" | "headshot", string> = {
  art: `You are a friendly art-style advisor on an AI photo-to-painting affiliate site.
Your only job: ask the visitor which art style they want for their photo (e.g. Van Gogh, oil painting,
watercolor, anime, stylized portrait/avatar), then recommend ONE tool:
- "Deep Art Effects" for classic painting styles (Van Gogh, Monet, oil, watercolor, batch processing).
- "PhotoAI" for stylized AI portraits/avatars from selfies.
Keep replies under 3 sentences. Once you know their style, clearly name the recommended tool by name
in your reply so it can be linked automatically. Do not invent pricing or features you're unsure of.`,
  headshot: `You are a friendly headshot-style advisor on an AI photo tool site.
Your only job: ask the visitor which professional headshot look they want — Corporate, LinkedIn,
Studio Portrait, or Creative Professional — then recommend "PhotoAI" as the tool for a full-resolution,
watermark-free AI headshot. Keep replies under 3 sentences. Once you know their preferred look,
clearly name "PhotoAI" in your reply so it can be linked automatically. Do not invent pricing or
features you're unsure of, and never claim this replaces a professional photographer or guarantees
a job outcome.`,
};

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        reply:
          "Chat isn't configured yet — add OPENROUTER_API_KEY to your environment to enable style recommendations.",
      },
      { status: 200 }
    );
  }

  let messages: ChatMessage[];
  let mode: "art" | "headshot";
  try {
    const body = await request.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
    mode = body?.mode === "headshot" ? "headshot" : "art";
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    for (const model of FREE_MODELS) {
      const res = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "system", content: SYSTEM_PROMPTS[mode] }, ...messages],
        }),
      });

      if (res.status === 429 || res.status === 404) {
        // TODO: remove this temporary debug logging once chat is confirmed stable
        console.error("OpenRouter", res.status, "on", model, "- trying next model");
        continue;
      }

      if (!res.ok) {
        const errText = await res.text();
        // TODO: remove this temporary debug logging once chat is confirmed stable
        console.error("OpenRouter error:", model, res.status, errText);
        return NextResponse.json(
          {
            reply: `Sorry, the style advisor is unavailable right now. Please try again shortly. [debug: ${res.status} ${errText}]`,
          },
          { status: 200 }
        );
      }

      const data = await res.json();
      const reply: string =
        data?.choices?.[0]?.message?.content?.trim() ||
        "Sorry, I couldn't come up with a recommendation just now.";

      return NextResponse.json({ reply });
    }

    // TODO: remove this temporary debug logging once chat is confirmed stable
    console.error("All OpenRouter free models rate-limited or unavailable");
    return NextResponse.json(
      { reply: "Sorry, the style advisor is unavailable right now. Please try again shortly." },
      { status: 200 }
    );
  } catch (error) {
    // TODO: remove this temporary debug logging once chat is confirmed stable
    console.error(error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { reply: `Sorry, the style advisor hit an error. [debug: ${message}]` },
      { status: 200 }
    );
  }
}
