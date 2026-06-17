import {
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Flag, countryCodes, countryNames, resolveCode } from "flaglet";
import { FlagUS, FlagJP, FlagBR } from "flaglet/flags";

/* -------------------------------------------------------------------------- */
/* Design tokens                                                              */
/* -------------------------------------------------------------------------- */

const theme = {
  ink: "#0f172a",
  inkSoft: "#475569",
  inkFaint: "#94a3b8",
  line: "#e2e8f0",
  surface: "#ffffff",
  accent: "#4f46e5",
  accentSoft: "#eef2ff",
  danger: "#dc2626",
  radius: 14,
  font: '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif',
  mono: '"JetBrains Mono", "SF Mono", ui-monospace, "Menlo", monospace',
};

const card: CSSProperties = {
  background: theme.surface,
  border: `1px solid ${theme.line}`,
  borderRadius: theme.radius,
  boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
};

/* -------------------------------------------------------------------------- */
/* Building blocks                                                            */
/* -------------------------------------------------------------------------- */

function Section({
  title,
  eyebrow,
  description,
  children,
}: {
  title: string;
  eyebrow?: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section style={{ marginBottom: 72 }}>
      <header style={{ marginBottom: 24 }}>
        {eyebrow ? (
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: theme.accent,
              marginBottom: 8,
            }}
          >
            {eyebrow}
          </div>
        ) : null}
        <h2
          style={{
            fontSize: 26,
            fontWeight: 700,
            margin: 0,
            color: theme.ink,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h2>
        {description ? (
          <p
            style={{
              color: theme.inkSoft,
              fontSize: 15,
              lineHeight: 1.65,
              margin: "12px 0 0",
              maxWidth: 640,
            }}
          >
            {description}
          </p>
        ) : null}
      </header>
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
        padding: "18px 20px",
        borderRadius: theme.radius,
        overflowX: "auto",
        fontSize: 13.5,
        lineHeight: 1.7,
        margin: "0 0 24px",
        fontFamily: theme.mono,
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
      }}
    >
      <code>{children}</code>
    </pre>
  );
}

function Token({ children }: { children: ReactNode }) {
  return (
    <code
      style={{
        background: theme.accentSoft,
        color: theme.accent,
        padding: "2px 7px",
        borderRadius: 6,
        fontSize: "0.88em",
        fontFamily: theme.mono,
        fontWeight: 600,
      }}
    >
      {children}
    </code>
  );
}

function Tile({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          ...card,
          width: 120,
          height: 96,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
      <code
        style={{
          fontSize: 12.5,
          fontFamily: theme.mono,
          color: theme.inkSoft,
        }}
      >
        {label}
      </code>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Props reference                                                            */
/* -------------------------------------------------------------------------- */

const PROP_ROWS: Array<[string, string, string, string]> = [
  ["code", "string", "(required)", "ISO alpha-2, alpha-3, or numeric code."],
  ["size", '"s" | "m" | "l"', '"m"', "Preset width: 16 / 20 / 32px (4:3)."],
  ["width", "number", "from size", "Explicit width; height derived from ratio."],
  ["height", "number", "from width", "Explicit height override."],
  ["rounded", "boolean | number", "false", "true for a default radius, or px value."],
  ["title", "string", "country name", 'Accessible label; "" marks decorative.'],
  ["fallback", "ReactNode", "null", "Shown for unknown codes and while loading."],
  ["...rest", "SVGProps", "", "className, style, event handlers, etc."],
];

function PropsTable() {
  const cell: CSSProperties = {
    padding: "14px 18px",
    fontSize: 14,
    verticalAlign: "top",
    borderBottom: `1px solid ${theme.line}`,
  };
  return (
    <div style={{ ...card, overflow: "hidden" }}>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ background: "#f8fafc" }}>
            {["Prop", "Type", "Default", "Description"].map((h) => (
              <th
                key={h}
                style={{
                  ...cell,
                  textAlign: "left",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: theme.inkFaint,
                  borderBottom: `2px solid ${theme.line}`,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PROP_ROWS.map(([prop, type, def, desc], idx) => (
            <tr
              key={prop}
              style={{
                background: idx % 2 === 0 ? theme.surface : "#fcfcfd",
              }}
            >
              <td style={{ ...cell }}>
                <Token>{prop}</Token>
              </td>
              <td
                style={{
                  ...cell,
                  fontFamily: theme.mono,
                  fontSize: 13,
                  color: theme.inkSoft,
                }}
              >
                {type}
              </td>
              <td
                style={{
                  ...cell,
                  fontFamily: theme.mono,
                  fontSize: 13,
                  color: theme.inkFaint,
                }}
              >
                {def || "default"}
              </td>
              <td style={{ ...cell, color: theme.inkSoft }}>{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* App                                                                        */
/* -------------------------------------------------------------------------- */

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
    <div
      style={{
        fontFamily: theme.font,
        color: theme.ink,
        background:
          "radial-gradient(1200px 600px at 50% -200px, #eef2ff 0%, #f8fafc 45%, #f8fafc 100%)",
        minHeight: "100vh",
      }}
    >
      <main
        style={{
          maxWidth: 920,
          margin: "0 auto",
          padding: "80px 32px 120px",
        }}
      >
        {/* Hero ------------------------------------------------------------ */}
        <header style={{ textAlign: "center", marginBottom: 80 }}>
          <div style={{ display: "inline-flex", gap: 10, marginBottom: 28 }}>
            <Flag code="US" size="l" rounded={6} />
            <Flag code="JP" size="l" rounded={6} />
            <Flag code="BR" size="l" rounded={6} />
            <Flag code="FR" size="l" rounded={6} />
            <Flag code="DE" size="l" rounded={6} />
          </div>
          <h1
            style={{
              fontSize: 56,
              fontWeight: 800,
              margin: "0 0 16px",
              letterSpacing: "-0.04em",
              color: theme.ink,
            }}
          >
            flaglet
          </h1>
          <p
            style={{
              fontSize: 19,
              lineHeight: 1.6,
              color: theme.inkSoft,
              maxWidth: 560,
              margin: "0 auto 32px",
            }}
          >
            Tree-shakeable React country flag components. Crisp SVGs generated
            from flagpack, loaded only when you use them.
          </p>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              ...card,
              padding: "12px 18px",
              fontFamily: theme.mono,
              fontSize: 14,
            }}
          >
            <span style={{ color: theme.inkFaint }}>$</span>
            <span style={{ color: theme.ink }}>npm install flaglet</span>
          </div>
        </header>

        {/* Live resolver --------------------------------------------------- */}
        <Section
          eyebrow="Lazy-loaded"
          title="The Flag component"
          description={
            <>
              Best when the code is chosen at runtime. Importing{" "}
              <Token>Flag</Token> does not bundle every flag: each SVG is a
              separate chunk loaded on demand. Accepts alpha-2, alpha-3, and
              numeric codes.
            </>
          }
        >
          <Code>{`import { Flag } from "flaglet";

<Flag code="US" />
<Flag code="GB" size="l" rounded />
<Flag code="JP" width={48} title="Japan" />
<Flag code="DEU" />   // alpha-3
<Flag code="250" />   // numeric`}</Code>

          <div
            style={{
              ...card,
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: 24,
            }}
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="US, USA, or 840"
              style={{
                fontSize: 16,
                padding: "11px 14px",
                border: `2px solid ${theme.line}`,
                borderRadius: 10,
                fontFamily: "inherit",
                outline: "none",
                minWidth: 150,
                transition: "border-color 0.15s ease, box-shadow 0.15s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = theme.accent;
                e.currentTarget.style.boxShadow =
                  "0 0 0 4px rgba(79, 70, 229, 0.12)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = theme.line;
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            {resolved ? (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 14,
                  flex: 1,
                }}
              >
                <Flag code={query} size="l" rounded={4} />
                <strong style={{ fontSize: 16 }}>
                  {countryNames[resolved]}
                </strong>
                <Token>{resolved}</Token>
              </span>
            ) : (
              <span style={{ color: theme.danger, fontWeight: 500 }}>
                No flag for "{query}"
              </span>
            )}
          </div>
        </Section>

        {/* Props ----------------------------------------------------------- */}
        <Section
          eyebrow="Reference"
          title="Flag props"
          description="Every prop the Flag component accepts."
        >
          <PropsTable />
        </Section>

        {/* Sizes ----------------------------------------------------------- */}
        <Section
          eyebrow="Sizing"
          title="Preset and custom sizes"
          description={
            <>
              Use <Token>size</Token> for the common presets, or pass an
              explicit <Token>width</Token> for anything else. Height always
              follows the 4:3 ratio.
            </>
          }
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 32,
              flexWrap: "wrap",
            }}
          >
            {(["s", "m", "l"] as const).map((s) => (
              <Tile key={s} label={`size="${s}"`}>
                <Flag code="FR" size={s} />
              </Tile>
            ))}
            <Tile label="width={64}">
              <Flag code="FR" width={64} />
            </Tile>
          </div>
        </Section>

        {/* Rounded --------------------------------------------------------- */}
        <Section
          eyebrow="Corners"
          title="Rounded corners"
          description={
            <>
              Pass <Token>rounded</Token> for a sensible default radius, or a
              number for an exact value in pixels.
            </>
          }
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 32,
              flexWrap: "wrap",
            }}
          >
            <Tile label="default">
              <Flag code="JP" width={48} />
            </Tile>
            <Tile label="rounded">
              <Flag code="JP" width={48} rounded />
            </Tile>
            <Tile label="rounded={24}">
              <Flag code="JP" width={48} rounded={24} />
            </Tile>
          </div>
        </Section>

        {/* Static imports -------------------------------------------------- */}
        <Section
          eyebrow="Tree-shakeable"
          title="Static imports"
          description="Best when the set of flags is known at build time. Only the flags you import ship in your bundle, and each component accepts standard SVG props."
        >
          <Code>{`import { FlagUS, FlagJP, FlagBR } from "flaglet/flags";

<FlagUS width={48} />`}</Code>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <Tile label="FlagUS">
              <FlagUS width={48} />
            </Tile>
            <Tile label="FlagJP">
              <FlagJP width={48} />
            </Tile>
            <Tile label="FlagBR">
              <FlagBR width={48} />
            </Tile>
          </div>
        </Section>

        {/* Utilities ------------------------------------------------------- */}
        <Section
          eyebrow="Helpers"
          title="Utility functions"
          description="Helper utilities for working with country codes and names."
        >
          <Code>{`import { countryCodes, countryNames, resolveCode } from "flaglet";

countryCodes        // ["AD", "AE", ...] every alpha-2 code
countryNames.US     // "${countryNames.US}"
resolveCode("usa")  // "${resolveCode("usa")}"  (normalizes any code form)
resolveCode("nope") // undefined`}</Code>
        </Section>

        {/* Accessibility --------------------------------------------------- */}
        <Section
          eyebrow="A11y"
          title="Accessibility"
          description={
            <>
              Each flag renders with <Token>role="img"</Token> and an{" "}
              <Token>aria-label</Token> set to the country name. Pass{" "}
              <Token>title=""</Token> to mark a flag decorative (
              <Token>aria-hidden</Token>) when a visible country name is already
              present.
            </>
          }
        >
          <div
            style={{
              ...card,
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: 24,
            }}
          >
            <Flag code="ES" size="l" rounded title="Spain" />
            <span style={{ color: theme.inkSoft, fontSize: 14 }}>
              Screen readers announce <strong>"Spain"</strong> for this flag.
            </span>
          </div>
        </Section>

        {/* Gallery --------------------------------------------------------- */}
        <Section
          eyebrow="Gallery"
          title={`All ${countryCodes.length} flags`}
          description="Hover over any flag to see the country name and code."
        >
          <div
            style={{
              ...card,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(52px, 1fr))",
              gap: 14,
              padding: 24,
            }}
          >
            {sorted.map((code) => (
              <div
                key={code}
                title={`${countryNames[code]} (${code})`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 8,
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "transform 0.15s ease, background 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = theme.accentSoft;
                  e.currentTarget.style.transform = "scale(1.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <Flag code={code} width={36} rounded={3} />
              </div>
            ))}
          </div>
        </Section>

        <footer
          style={{
            textAlign: "center",
            color: theme.inkFaint,
            fontSize: 14,
            borderTop: `1px solid ${theme.line}`,
            paddingTop: 32,
          }}
        >
          flaglet is MIT licensed. Flags generated from flagpack.
        </footer>
      </main>
    </div>
  );
}
