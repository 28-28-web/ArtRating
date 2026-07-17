"use client";

import { useState } from "react";
import { AFFILIATE_TOOLS } from "@/app/lib/affiliate";
import { ART_STYLE_MODE, type PreviewMode } from "@/app/lib/previewModes";
import BrushDivider from "@/app/components/BrushDivider";
import PaintDab from "@/app/components/PaintDab";

type Message = { role: "user" | "assistant"; content: string };

function detectTool(text: string) {
  const lower = text.toLowerCase();
  if (lower.includes("photoai")) return AFFILIATE_TOOLS.photoai;
  if (lower.includes("deep art effects")) return AFFILIATE_TOOLS["deep-art-effects"];
  return null;
}

function detectStyle(text: string, keywords: string[]): string | null {
  const lower = text.toLowerCase();
  return keywords.find((keyword) => lower.includes(keyword)) ?? null;
}

export default function ChatWidget({
  onStyleDetected,
  mode = ART_STYLE_MODE,
}: {
  onStyleDetected?: (style: string) => void;
  mode?: PreviewMode;
}) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: mode.chatGreeting },
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

    const style = detectStyle(text, mode.styleKeywords);
    if (style) onStyleDetected?.(style);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, mode: mode.chatMode }),
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
    <div className="tool-card tilt-alt accent-border w-full max-w-md">
      <div className="mb-3 flex items-center gap-2">
        <PaintDab />
        <span className="font-flourish text-lg text-ink-soft">{mode.cardTagline}</span>
      </div>

      <div className="tool-card-content flex flex-col">
        <div className="border-b border-border-soft px-4 py-3">
          <h3 className="font-display text-base font-semibold text-ink">{mode.chatTitle}</h3>
          <BrushDivider className="mt-1 mb-1" />
          <p className="text-xs text-ink-soft">{mode.chatSubtitle}</p>
        </div>

        <div className="flex max-h-80 flex-col gap-3 overflow-y-auto px-4 py-3">
          {messages.map((m, i) => {
            const tool = m.role === "assistant" ? detectTool(m.content) : null;
            return (
              <div key={i} className={m.role === "user" ? "self-end" : "self-start"}>
                <div
                  className={`break-words rounded-xl px-3 py-2 text-sm ${
                    m.role === "user" ? "bg-ink text-canvas" : "bg-[var(--border-soft)]/40 text-ink"
                  }`}
                >
                  {m.content}
                </div>
                {tool && (
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="mt-2 inline-block rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-canvas hover:opacity-90"
                  >
                    Try {tool.name} →
                  </a>
                )}
              </div>
            );
          })}
          {loading && <div className="self-start text-sm text-ink-soft">Thinking…</div>}
        </div>

        <div className="flex gap-2 border-t border-border-soft p-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={mode.chatPlaceholder}
            className="flex-1 rounded-full border border-border-soft bg-transparent px-4 py-2 text-sm text-ink outline-none focus:border-accent"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-canvas disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
