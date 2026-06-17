import { useMemo, useState, type ReactNode } from "react";
import { Flag, countryCodes, countryNames, resolveCode } from "flaglet";
import { FlagUS, FlagJP, FlagBR } from "flaglet/flags";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 44 }}>
      <h2 style={{ fontSize: 18, margin: "0 0 14px", color: "#111" }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Code({ children }: { children: string }) {
  return (
    <pre
      style={{
        background: "#0d1117",
        color: "#e6edf3",
        padding: "14px 16px",
        borderRadius: 8,
        overflowX: "auto",
        fontSize: 13,
        lineHeight: 1.5,
        margin: "0 0 16px",
      }}
    >
      <code>{children}</code>
    </pre>
  );
}

const PROP_ROWS: Array<[string, string, string, string]> = [
  ["code", "string", "(required)", "ISO alpha-2, alpha-3, or numeric code."],
  ["size", '"s" | "m" | "l"', '"m"', "Preset width: 16 / 20 / 32px (4:3)."],
  [
    "width",
    "number",
    "from size",
    "Explicit width; height derived from ratio.",
  ],
  ["height", "number", "from width", "Explicit height override."],
  [
    "rounded",
    "boolean | number",
    "false",
    "true for a default radius, or px value.",
  ],
  ["title", "string", "country name", 'Accessible label; "" marks decorative.'],
  [
    "fallback",
    "ReactNode",
    "null",
    "Shown for unknown codes and while loading.",
  ],
  ["...rest", "SVGProps", "", "className, style, event handlers, etc."],
];

function PropsTable() {
  return (
    <table
      style={{
        borderCollapse: "collapse",
        width: "100%",
        fontSize: 13,
      }}
    >
      <thead>
        <tr style={{ textAlign: "left", borderBottom: "2px solid #ddd" }}>
          {["Prop", "Type", "Default", "Description"].map((h) => (
            <th key={h} style={{ padding: "8px 10px", color: "#444" }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {PROP_ROWS.map(([prop, type, def, desc]) => (
          <tr key={prop} style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: "8px 10px" }}>
              <code style={{ color: "#0550ae" }}>{prop}</code>
            </td>
            <td style={{ padding: "8px 10px" }}>
              <code style={{ color: "#953800" }}>{type}</code>
            </td>
            <td style={{ padding: "8px 10px", color: "#666" }}>
              <code>{def}</code>
            </td>
            <td style={{ padding: "8px 10px", color: "#333" }}>{desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function App() {
  const [query, setQuery] = useState("US");
  const resolved = resolveCode(query);
  const sorted = useMemo(
    () =>
      [...countryCodes].sort((a, b) =>
        countryNames[a].localeCompare(countryNames[b]),
      ),
    [],
  );

  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        maxWidth: 920,
        margin: "0 auto",
        padding: 24,
        color: "#1a1a1a",
        lineHeight: 1.5,
      }}
    >
      <header style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 30, marginBottom: 4 }}>flaglet</h1>
        <p style={{ color: "#666", marginTop: 0 }}>
          Tree-shakeable React country flags. {countryCodes.length} flags, each
          rendered from a lazy-loaded SVG chunk. This page is a live example and
          API reference.
        </p>
      </header>

      <Section title="Install">
        <Code>{`npm install flaglet     # react >= 16.8 peer dependency`}</Code>
      </Section>

      <Section title="Dynamic <Flag> (lazy-loaded)">
        <p style={{ color: "#555", marginTop: 0 }}>
          Best when the code is chosen at runtime. Importing <code>Flag</code>{" "}
          does not bundle every flag: each SVG is a separate chunk loaded on
          demand. Accepts alpha-2, alpha-3, and numeric codes.
        </p>
        <Code>{`import { Flag } from "flaglet";

<Flag code="US" />
<Flag code="GB" size="l" rounded />
<Flag code="JP" width={48} title="Japan" />
<Flag code="DEU" />   // alpha-3
<Flag code="250" />   // numeric`}</Code>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: 16,
            border: "1px solid #eee",
            borderRadius: 8,
          }}
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="US, USA, or 840"
            style={{
              fontSize: 16,
              padding: "6px 10px",
              border: "1px solid #ccc",
              borderRadius: 6,
            }}
          />
          {resolved ? (
            <span
              style={{ display: "inline-flex", alignItems: "center", gap: 10 }}
            >
              <Flag code={query} size="l" rounded />
              <strong>{countryNames[resolved]}</strong>
              <code style={{ color: "#888" }}>({resolved})</code>
            </span>
          ) : (
            <span style={{ color: "#c0392b" }}>No flag for "{query}"</span>
          )}
        </div>
      </Section>

      <Section title="<Flag> props">
        <PropsTable />
      </Section>

      <Section title="Sizes">
        <div style={{ display: "flex", alignItems: "flex-end", gap: 24 }}>
          {(["s", "m", "l"] as const).map((s) => (
            <span
              key={s}
              style={{
                display: "inline-flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <Flag code="FR" size={s} />
              <code style={{ color: "#888", fontSize: 12 }}>size="{s}"</code>
            </span>
          ))}
          <span
            style={{ display: "inline-flex", flexDirection: "column", gap: 6 }}
          >
            <Flag code="FR" width={64} />
            <code style={{ color: "#888", fontSize: 12 }}>width={64}</code>
          </span>
        </div>
      </Section>

      <Section title="Rounded">
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Flag code="JP" width={48} />
          <Flag code="JP" width={48} rounded />
          <Flag code="JP" width={48} rounded={24} />
        </div>
      </Section>

      <Section title="Static imports (flaglet/flags, fully tree-shakeable)">
        <p style={{ color: "#555", marginTop: 0 }}>
          Best when the set of flags is known at build time. Only the flags you
          import ship in your bundle. Each component accepts standard SVG props.
        </p>
        <Code>{`import { FlagUS, FlagJP, FlagBR } from "flaglet/flags";

<FlagUS width={48} />`}</Code>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <FlagUS width={48} />
          <FlagJP width={48} />
          <FlagBR width={48} />
        </div>
      </Section>

      <Section title="Utilities">
        <Code>{`import { countryCodes, countryNames, resolveCode } from "flaglet";

countryCodes        // ["AD", "AE", ...] every alpha-2 code
countryNames.US     // "${countryNames.US}"
resolveCode("usa")  // "${resolveCode("usa")}"  (normalizes any code form)
resolveCode("nope") // undefined`}</Code>
      </Section>

      <Section title="Accessibility">
        <p style={{ color: "#555", marginTop: 0 }}>
          Each flag renders with <code>role="img"</code> and an{" "}
          <code>aria-label</code> set to the country name. Pass{" "}
          <code>title=""</code> to mark a flag decorative (
          <code>aria-hidden</code>) when a visible country name is already
          present.
        </p>
      </Section>

      <Section title={`All ${countryCodes.length} flags`}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))",
            gap: 10,
          }}
        >
          {sorted.map((code) => (
            <span key={code} title={`${countryNames[code]} (${code})`}>
              <Flag code={code} width={36} rounded={2} />
            </span>
          ))}
        </div>
      </Section>
    </main>
  );
}
