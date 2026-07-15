"use client";

import { useState } from "react";
import { AFFILIATE_TOOLS } from "@/app/lib/affiliate";

type Message = { role: "user" | "assistant"; content: string };

const STYLE_KEYWORDS = [
  "van gogh",
  "watercolor",
  "oil painting",
  "anime",
  "monet",
  "portrait",
  "avatar",
];

function detectTool(text: string) {
  const lower = text.toLowerCase();
  if (lower.includes("photoai")) return AFFILIATE_TOOLS.photoai;
  if (lower.includes("deep art effects")) return AFFILIATE_TOOLS["deep-art-effects"];
  return null;
}

function detectStyle(text: string): string | null {
  const lower = text.toLowerCase();
  return STYLE_KEYWORDS.find((keyword) => lower.includes(keyword)) ?? null;
}

export default function ChatWidget({
  onStyleDetected,
}: {
  onStyleDetected?: (style: string) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! What art style do you want for your photo — Van Gogh, oil painting, watercolor, anime, or a stylized AI portrait?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    const style = detectStyle(text);
    if (style) onStyleDetected?.(style);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full max-w-md flex-col rounded-2xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
      <div className="border-b border-black/10 px-4 py-3 dark:border-white/10">
        <h3 className="font-semibold">Art Style Advisor</h3>
        <p className="text-xs text-zinc-500">Powered by AI · tells you which tool fits your style</p>
      </div>

      <div className="flex max-h-80 flex-col gap-3 overflow-y-auto px-4 py-3">
        {messages.map((m, i) => {
          const tool = m.role === "assistant" ? detectTool(m.content) : null;
          return (
            <div key={i} className={m.role === "user" ? "self-end" : "self-start"}>
              <div
                className={`rounded-xl px-3 py-2 text-sm ${
                  m.role === "user"
                    ? "bg-foreground text-background"
                    : "bg-zinc-100 dark:bg-zinc-800"
                }`}
              >
                {m.content}
              </div>
              {tool && (
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="mt-2 inline-block rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background hover:opacity-90"
                >
                  Try {tool.name} →
                </a>
              )}
            </div>
          );
        })}
        {loading && <div className="self-start text-sm text-zinc-500">Thinking…</div>}
      </div>

      <div className="flex gap-2 border-t border-black/10 p-3 dark:border-white/10">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="e.g. Van Gogh style"
          className="flex-1 rounded-full border border-black/10 bg-transparent px-4 py-2 text-sm outline-none dark:border-white/10"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
