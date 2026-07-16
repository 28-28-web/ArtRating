export type AccentName = "cobalt" | "jade" | "saffron" | "magenta" | "teal-muted";

// Scopes --accent/--accent-text (CSS custom properties, see globals.css) to a
// subtree via inline style — everything inside (paint dabs, brush dividers,
// hover states, the chat widget border) picks up the right color without
// prop-drilling through every shared component.
export function accentVars(accent: AccentName): React.CSSProperties {
  return {
    ["--accent" as string]: `var(--${accent})`,
    ["--accent-text" as string]: `var(--${accent}-text)`,
  } as React.CSSProperties;
}
