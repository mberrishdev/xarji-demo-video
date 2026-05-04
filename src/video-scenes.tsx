import { Audio, staticFile } from "remotion";
import { Sprite, useTime, useSprite } from "./animations";
import { SoundEffects } from "./SoundEffects";

const COLORS = {
  bg: "#0b0b0d", bg2: "#101013", surface: "#15151a", surface2: "#1b1b22",
  line: "#26262e", lineSoft: "#1f1f26",
  ink: "#f1ede8", inkDim: "#a8a39c", inkMute: "#6c6760",
  coral: "#e85d4a", coralSoft: "#3a1d18", green: "#3fb27f",
};

const FONTS = {
  sans: "Inter, system-ui, sans-serif",
  serif: "'Instrument Serif', Georgia, serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
};

const T = {
  s0: [0,    5.0],
  sBA:[5.0,  9.0],
  s1: [9.0,  13.0],
  s2: [13.0, 16.5],
  s3: [16.5, 21.5],
  s4: [21.5, 26.5],
  s5: [26.5, 30.0],
  s6: [30.0, 33.5],
  s7: [33.5, 38.0],
  s8: [38.0, 45.0],
  s9: [45.0, 54.0],
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ── Caption bar ─────────────────────────────────────────────────────────────
const VO_LINES = [
  { t: [0,    5.0],  text: "No multibanking catalog. No AI for finance. No budgeting planner. Until now." },
  { t: [5.0,  9.0],  text: "One app. Every bank. Total clarity." },
  { t: [9.0,  13.0], text: "Your bank doesn't send statements anymore. It sends texts." },
  { t: [13.0, 16.5], text: "If you have a Mac and iPhone, iMessage delivers your bank texts automatically." },
  { t: [16.5, 21.5], text: "Every charge, every refund, every merchant — parsed." },
  { t: [21.5, 26.5], text: "Categorized, and sitting on one screen." },
  { t: [26.5, 30.0], text: "Search a sentence." },
  { t: [30.0, 33.5], text: "Set a budget." },
  { t: [33.5, 38.0], text: "Ask the assistant where your money went last week." },
  { t: [38.0, 45.0], text: "It runs locally. Your keys. Your data. Your machine." },
  { t: [45.0, 54.0], text: "Talk to your money. — Xarji" },
];

function Caption() {
  const time = useTime();
  const line = VO_LINES.find(l => time >= l.t[0] && time < l.t[1]) || VO_LINES[VO_LINES.length - 1];
  const localT = time - line.t[0];
  const inFade = clamp01(localT / 0.35);
  const remain = line.t[1] - time;
  const outFade = clamp01(remain / 0.35);
  const opacity = Math.min(inFade, outFade);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 88, display: "flex", justifyContent: "center", pointerEvents: "none", zIndex: 50 }}>
      <div style={{
        opacity,
        background: "rgba(11,11,13,0.78)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: `1px solid ${COLORS.lineSoft}`,
        borderRadius: 14,
        padding: "18px 32px",
        fontFamily: FONTS.serif, fontStyle: "italic",
        fontSize: 38, color: COLORS.ink, letterSpacing: "-0.005em",
        maxWidth: 1400, textAlign: "center", lineHeight: 1.25,
        boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
      }}>
        <span style={{ color: COLORS.coral, fontFamily: FONTS.serif }}>"</span>
        {line.text}
        <span style={{ color: COLORS.coral, fontFamily: FONTS.serif }}>"</span>
      </div>
    </div>
  );
}

function HUD() {
  const time = useTime();
  const tc = `00:${String(Math.floor(time)).padStart(2, "0")}.${String(Math.floor((time % 1) * 100)).padStart(2, "0")}`;
  return (
    <div style={{ position: "absolute", top: 32, right: 40, zIndex: 60, fontFamily: FONTS.mono, fontSize: 14, letterSpacing: "0.18em", color: COLORS.inkMute, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 14 }}>
      <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 8, background: COLORS.coral, boxShadow: `0 0 12px ${COLORS.coral}` }} />
      REC · {tc}
    </div>
  );
}

function Brand() {
  return (
    <div style={{ position: "absolute", top: 32, left: 40, zIndex: 60, display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: COLORS.coral, display: "grid", placeItems: "center", fontFamily: FONTS.sans, fontWeight: 700, color: "#fff", fontSize: 18, letterSpacing: "-0.02em" }}>x</div>
      <span style={{ fontFamily: FONTS.sans, fontWeight: 600, fontSize: 16, color: COLORS.ink }}>Xarji</span>
    </div>
  );
}

// ── Scene 0 — Problem statement ─────────────────────────────────────────────

function FragmentedBanks({ localTime }: { localTime: number }) {
  const flicker = (seed: number) => {
    const f = Math.sin(localTime * 7.3 + seed) * Math.sin(localTime * 13.1 + seed * 2);
    return f > 0.3 ? "₾ ---" : f < -0.3 ? "₾ ???" : "₾ · · ·";
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.inkMute, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>3 BANKS · 0 CONNECTION</div>
      {["TBC Bank", "Bank of Georgia", "Credo Bank"].map((b, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: COLORS.surface2, borderRadius: 10, border: `1px solid ${COLORS.lineSoft}`, opacity: 0.65 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: COLORS.line, display: "grid", placeItems: "center", fontFamily: FONTS.mono, fontSize: 10, color: COLORS.inkMute }}>{b[0]}</div>
            <span style={{ fontFamily: FONTS.sans, fontSize: 15, color: COLORS.inkMute }}>{b}</span>
          </div>
          <span style={{ fontFamily: FONTS.mono, fontSize: 15, color: COLORS.coral, opacity: 0.7 }}>{flicker(i * 3.7)}</span>
        </div>
      ))}
      <div style={{ textAlign: "center", fontFamily: FONTS.mono, fontSize: 11, color: COLORS.coral, letterSpacing: "0.2em", marginTop: 6, opacity: 0.75 }}>SILOED · NOT SYNCED</div>
    </div>
  );
}

function NoAI({ localTime }: { localTime: number }) {
  const dot = (phase: number) => Math.max(0.15, 0.5 + 0.5 * Math.sin(localTime * 3 + phase));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.inkMute, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>NO ASSISTANT</div>
      <div style={{ padding: "14px 18px", background: COLORS.surface2, borderRadius: "12px 12px 4px 12px", border: `1px solid ${COLORS.lineSoft}`, fontFamily: FONTS.sans, fontSize: 15, color: COLORS.inkMute, alignSelf: "flex-end", maxWidth: "85%", opacity: 0.7 }}>
        Where did my money go?
      </div>
      <div style={{ padding: "16px 20px", background: COLORS.surface2, borderRadius: "4px 12px 12px 12px", border: `1px solid ${COLORS.lineSoft}`, display: "flex", gap: 8, alignItems: "center", alignSelf: "flex-start" }}>
        {[0, 1.1, 2.2].map((phase, j) => (
          <div key={j} style={{ width: 9, height: 9, borderRadius: 5, background: COLORS.inkMute, opacity: dot(phase) }} />
        ))}
      </div>
      <div style={{ textAlign: "center", fontFamily: FONTS.mono, fontSize: 11, color: COLORS.coral, letterSpacing: "0.2em", marginTop: 4, opacity: 0.75 }}>NO RESPONSE · NEVER WILL</div>
    </div>
  );
}

function NoBudget({ localTime }: { localTime: number }) {
  const r = 72, c = 2 * Math.PI * r;
  const fillFrac = Math.max(0, Math.sin(localTime * 0.9) * 0.08);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.inkMute, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 2 }}>NO LIMITS SET</div>
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle cx="90" cy="90" r={r} fill="none" stroke={COLORS.lineSoft} strokeWidth="10" />
        <circle cx="90" cy="90" r={r} fill="none" stroke={COLORS.coral} strokeWidth="10"
          strokeDasharray={c} strokeDashoffset={c * (1 - fillFrac)}
          strokeLinecap="round" transform="rotate(-90 90 90)" style={{ opacity: 0.5 }} />
        <text x="90" y="86" textAnchor="middle" fontFamily={FONTS.sans} fontSize="28" fill={COLORS.inkMute} letterSpacing="-0.02em">₾ ?</text>
        <text x="90" y="110" textAnchor="middle" fontFamily={FONTS.mono} fontSize="11" fill={COLORS.inkMute} letterSpacing="0.18em">OF ₾ ???</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
        {["Food", "Transport", "Subscriptions"].map((cat, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: COLORS.surface2, borderRadius: 8, border: `1px solid ${COLORS.lineSoft}`, opacity: 0.5 }}>
            <span style={{ fontFamily: FONTS.sans, fontSize: 13, color: COLORS.inkMute }}>{cat}</span>
            <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.inkMute }}>— / —</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const PROBLEM_CARDS = [
  { start: 0.4, label: "No unified transaction catalog", Content: FragmentedBanks },
  { start: 1.5, label: "No AI for finance analysis",    Content: NoAI },
  { start: 2.6, label: "No budgeting planner",          Content: NoBudget },
];

function Scene0() {
  const { localTime, duration } = useSprite();
  const fade = clamp01(localTime / 0.4) * clamp01((duration - localTime) / 0.5);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: fade, background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 96px" }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.coral, letterSpacing: "0.32em", textTransform: "uppercase", marginBottom: 52 }}>
        THE STATUS QUO
      </div>
      <div style={{ display: "flex", gap: 36, alignItems: "stretch", width: "100%", maxWidth: 1600 }}>
        {PROBLEM_CARDS.map(({ start, label, Content }, i) => {
          const prog = clamp01((localTime - start) / 0.6);
          const ease = 1 - Math.pow(1 - prog, 3);
          return (
            <div key={i} style={{ flex: 1, opacity: ease, transform: `translateY(${lerp(44, 0, ease)}px)`, display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ flex: 1, background: COLORS.surface, border: `1px solid rgba(232,93,74,0.22)`, borderRadius: 20, padding: "28px", position: "relative", overflow: "hidden", boxShadow: `0 0 48px rgba(232,93,74,0.05) inset`, minHeight: 320 }}>
                <Content localTime={localTime} />
                <div style={{ position: "absolute", inset: 0, background: "rgba(11,11,13,0.52)", borderRadius: 20, display: "grid", placeItems: "center" }}>
                  <div style={{ width: 68, height: 68, borderRadius: 14, border: `2.5px solid ${COLORS.coral}`, display: "grid", placeItems: "center", color: COLORS.coral, fontFamily: FONTS.mono, fontSize: 38, fontWeight: 700, boxShadow: `0 0 28px rgba(232,93,74,0.35)`, background: "rgba(11,11,13,0.7)" }}>×</div>
                </div>
              </div>
              <div style={{ fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 30, color: COLORS.inkDim, textAlign: "center", lineHeight: 1.3, letterSpacing: "-0.01em" }}>
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Scene BA — Before / After ───────────────────────────────────────────────
function SceneBA() {
  const { localTime, duration } = useSprite();
  const fade = clamp01(localTime / 0.4) * clamp01((duration - localTime) / 0.5);
  const dividerProg = clamp01((localTime - 0.3) / 0.5);
  const ease3 = (t: number) => 1 - Math.pow(1 - t, 3);
  const afterProg = ease3(clamp01((localTime - 0.7) / 0.7));
  const chaosItems = [
    { label: "TBC App",      sub: "₾ ???",    x: 6,  y: 14, rot: -3 },
    { label: "BOG App",      sub: "₾ ???",    x: 20, y: 46, rot:  2 },
    { label: "Credo",        sub: "₾ ???",    x: 4,  y: 72, rot: -2 },
    { label: "Spreadsheet",  sub: "47 rows",  x: 52, y: 8,  rot:  3 },
    { label: "Receipts",     sub: "23 photos",x: 50, y: 40, rot: -1 },
    { label: "Notes.txt",    sub: "messy",    x: 55, y: 68, rot:  2 },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: fade, background: COLORS.bg, display: "flex", overflow: "hidden" }}>
      <div style={{ flex: 1, position: "relative", padding: "64px 52px" }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.coral, letterSpacing: "0.28em", textTransform: "uppercase", marginBottom: 28 }}>BEFORE</div>
        {chaosItems.map((item, i) => {
          const ap = ease3(clamp01((localTime - 0.1 - i * 0.07) / 0.35));
          return (
            <div key={i} style={{ position: "absolute", left: `${item.x}%`, top: `${item.y + 8}%`, opacity: ap * 0.82, transform: `rotate(${item.rot}deg)` }}>
              <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.lineSoft}`, borderRadius: 12, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 3, minWidth: 148 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 18, height: 18, borderRadius: 4, background: COLORS.line }} />
                  <span style={{ fontFamily: FONTS.sans, fontSize: 13, color: COLORS.inkDim }}>{item.label}</span>
                </div>
                <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.inkMute }}>{item.sub}</span>
              </div>
            </div>
          );
        })}
        <div style={{ position: "absolute", bottom: 80, left: 52, fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 100, color: COLORS.inkMute, opacity: 0.08, letterSpacing: "-0.02em", pointerEvents: "none" }}>???</div>
      </div>
      <div style={{ width: 2, alignSelf: "stretch", flexShrink: 0, background: `linear-gradient(to bottom, transparent 5%, ${COLORS.coral} 30%, ${COLORS.coral} 70%, transparent 95%)`, opacity: dividerProg, boxShadow: `0 0 18px rgba(232,93,74,0.5)` }} />
      <div style={{ flex: 1, position: "relative", padding: "64px 52px", opacity: afterProg, display: "flex", flexDirection: "column" }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.green, letterSpacing: "0.28em", textTransform: "uppercase", marginBottom: 28 }}>AFTER · XARJI</div>
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.lineSoft}`, borderRadius: 18, padding: "24px 28px", marginBottom: 16 }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.inkMute, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>ALL BANKS · COMBINED</div>
          <div style={{ fontFamily: FONTS.sans, fontSize: 80, fontWeight: 500, color: COLORS.ink, letterSpacing: "-0.04em", lineHeight: 1 }}>₾5,975</div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.green, marginTop: 10, letterSpacing: "0.18em", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 7, height: 7, borderRadius: 4, background: COLORS.green, display: "inline-block" }} />
            3 banks · live sync
          </div>
        </div>
        {[
          { bank: "TBC Bank",        v: "₾1,842", col: "#4a90d9" },
          { bank: "Bank of Georgia", v: "₾3,241", col: COLORS.coral },
          { bank: "Credo Bank",      v: "₾892",   col: COLORS.green },
        ].map((b, i) => {
          const bp = ease3(clamp01((localTime - 1.1 - i * 0.14) / 0.35));
          return (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", marginBottom: 10, background: COLORS.surface2, borderRadius: 12, border: `1px solid ${COLORS.lineSoft}`, opacity: bp, transform: `translateX(${lerp(24, 0, bp)}px)` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: b.col }} />
                <span style={{ fontFamily: FONTS.sans, fontSize: 17, color: COLORS.ink }}>{b.bank}</span>
              </div>
              <span style={{ fontFamily: FONTS.mono, fontSize: 17, color: COLORS.ink }}>{b.v}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Scene 1 — SMS cascade ───────────────────────────────────────────────────
const SMS_MESSAGES = [
  { bank: "TBC Bank",        text: "Purchase: -₾24.50 SPAR EXPRESS · Bal ₾1,842.10", t: 0.3 },
  { bank: "Bank of Georgia", text: "Card *4421 charged ₾89.00 at WOLT GE",           t: 0.9 },
  { bank: "TBC Bank",        text: "Refund +₾12.00 · GLOVO · Bal ₾1,768.10",         t: 1.5 },
  { bank: "Credo Bank",      text: "ATM withdrawal -₾200 Vake branch",               t: 2.1 },
  { bank: "Bank of Georgia", text: "Subscription -₾49.99 NETFLIX.COM",               t: 2.7 },
];

function Scene1() {
  const { localTime, duration, progress } = useSprite();
  const sceneOpacity = clamp01(localTime / 0.4) * clamp01((duration - localTime) / 0.5);
  const shake = Math.min(localTime / 2.5, 1);
  const sx = Math.sin(localTime * 28) * shake * 6;
  const sy = Math.cos(localTime * 22) * shake * 4;

  return (
    <div style={{ position: "absolute", inset: 0, opacity: sceneOpacity, display: "grid", placeItems: "center", background: `radial-gradient(ellipse at 50% 40%, #1a1014 0%, ${COLORS.bg} 70%)` }}>
      <div style={{ width: 520, height: 1060, borderRadius: 64, background: "#000", border: "2px solid #2a2a32", boxShadow: "0 40px 120px rgba(0,0,0,0.7), inset 0 0 0 8px #0a0a0c", position: "relative", transform: `translate(${sx}px, ${sy}px)` }}>
        <div style={{ position: "absolute", top: 18, left: "50%", transform: "translateX(-50%)", width: 140, height: 30, background: "#000", borderRadius: 18, zIndex: 5 }} />
        <div style={{ position: "absolute", inset: 24, borderRadius: 48, overflow: "hidden", background: "linear-gradient(180deg,#0d0d10 0%, #16161c 100%)", padding: "80px 28px 28px" }}>
          <div style={{ textAlign: "center", color: COLORS.ink, fontFamily: FONTS.sans, fontWeight: 200, fontSize: 88, letterSpacing: "-0.04em", lineHeight: 1 }}>9:41</div>
          <div style={{ textAlign: "center", color: COLORS.inkMute, fontFamily: FONTS.sans, fontSize: 18, marginTop: 8 }}>Tuesday, May 14</div>
          <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 10 }}>
            {SMS_MESSAGES.map((m, i) => {
              const appear = clamp01((localTime - m.t) / 0.35);
              const ease = 1 - Math.pow(1 - appear, 3);
              const y = lerp(60, 0, ease);
              return (
                <div key={i} style={{ background: "rgba(34,34,40,0.75)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderRadius: 18, padding: "14px 16px", transform: `translateY(${y}px)`, opacity: ease, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, background: "#3a3a44", display: "grid", placeItems: "center", fontSize: 11, color: COLORS.inkDim, fontFamily: FONTS.mono }}>$</div>
                      <span style={{ fontFamily: FONTS.sans, fontWeight: 600, fontSize: 14, color: COLORS.ink }}>{m.bank}</span>
                    </div>
                    <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.inkMute }}>now</span>
                  </div>
                  <div style={{ fontFamily: FONTS.sans, fontSize: 14, color: COLORS.inkDim, lineHeight: 1.35 }}>{m.text}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 200, right: 120, fontFamily: FONTS.mono, fontSize: 14, color: COLORS.inkMute, letterSpacing: "0.18em", textTransform: "uppercase" }}>
        SMS today · <span style={{ color: COLORS.coral, fontSize: 32, fontWeight: 600, fontFamily: FONTS.sans, letterSpacing: "-0.02em", marginLeft: 8 }}>{Math.floor(lerp(0, 47, progress))}</span>
      </div>
    </div>
  );
}

// ── Scene 2 — Logo lockup ───────────────────────────────────────────────────
function Scene2() {
  const { localTime, duration } = useSprite();
  const tilePulse = 1 + Math.sin(localTime * 6) * 0.03 * Math.max(0, 1 - localTime / 1.5);
  const wordmarkProg = clamp01((localTime - 0.6) / 1.0);
  const wordmarkEase = 1 - Math.pow(1 - wordmarkProg, 3);
  const badgeProg = clamp01((localTime - 1.8) / 0.6);
  const sceneFade = clamp01(localTime / 0.3) * clamp01((duration - localTime) / 0.5);

  return (
    <div style={{ position: "absolute", inset: 0, background: "#000", opacity: sceneFade, display: "grid", placeItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ width: 120, height: 120, borderRadius: 28, background: COLORS.coral, display: "grid", placeItems: "center", fontFamily: FONTS.sans, fontWeight: 700, color: "#fff", fontSize: 72, letterSpacing: "-0.04em", transform: `scale(${tilePulse})`, boxShadow: "0 0 80px rgba(232,93,74,0.5)" }}>x</div>
        <div style={{ overflow: "hidden", width: lerp(0, 600, wordmarkEase) }}>
          <div style={{ fontFamily: FONTS.sans, fontWeight: 600, fontSize: 120, color: COLORS.ink, letterSpacing: "-0.04em", whiteSpace: "nowrap" }}>Xarji</div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 200, opacity: badgeProg, fontFamily: FONTS.mono, fontSize: 18, color: COLORS.inkDim, letterSpacing: "0.32em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 18 }}>
        <span>NO EXPORTS</span>
        <span style={{ color: COLORS.line }}>·</span>
        <span>NO BANK CONNECT</span>
        <span style={{ color: COLORS.line }}>·</span>
        <span>NO SERVER</span>
      </div>
    </div>
  );
}

// ── Scene 3 — SMS becomes structure ────────────────────────────────────────
const TOKENS = [
  { label: "Purchase",     val: "spend",    pos: 0 },
  { label: "-₾24.50",     val: "amount",   pos: 1 },
  { label: "SPAR EXPRESS", val: "merchant", pos: 2 },
  { label: "14 May",       val: "date",     pos: 3 },
  { label: "card *4421",   val: "card",     pos: 4 },
];

function Scene3() {
  const { localTime, duration } = useSprite();
  const sceneFade = clamp01(localTime / 0.3) * clamp01((duration - localTime) / 0.4);
  const smsAppear = clamp01(localTime / 0.4);
  const counter = Math.floor(lerp(0, 3486, clamp01((localTime - 1.5) / 3)));

  return (
    <div style={{ position: "absolute", inset: 0, opacity: sceneFade, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 80px" }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.inkMute, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 32 }}>
        <span style={{ color: COLORS.coral, marginRight: 14 }}>03</span>SMS → STRUCTURE
      </div>
      <div style={{ opacity: smsAppear, background: COLORS.surface, border: `1px solid ${COLORS.lineSoft}`, borderRadius: 14, padding: "24px 36px", maxWidth: 1400, width: "100%", fontFamily: FONTS.mono, fontSize: 24, color: COLORS.inkDim, lineHeight: 1.5 }}>
        {TOKENS.map((tok, i) => {
          const tokStart = 0.6 + i * 0.25;
          const tokHighlight = clamp01((localTime - tokStart) / 0.3);
          const fade = clamp01((localTime - (tokStart + 0.5)) / 0.3);
          const isActive = tokHighlight > 0 && fade < 1;
          const bg = isActive ? `rgba(232,93,74,${0.3 * (1 - fade)})` : "transparent";
          return (
            <span key={i} style={{ display: "inline", padding: "4px 8px", borderRadius: 6, background: bg, color: tokHighlight > 0.5 ? COLORS.ink : COLORS.inkDim }}>
              {tok.label}{i < TOKENS.length - 1 ? " · " : ""}
            </span>
          );
        })}
      </div>
      <div style={{ margin: "30px 0", fontFamily: FONTS.mono, color: COLORS.coral, fontSize: 24 }}>↓</div>
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.lineSoft}`, borderRadius: 14, padding: "8px 0", width: "100%", maxWidth: 1400, overflow: "hidden" }}>
        {TOKENS.map((tok, i) => {
          const tokStart = 0.6 + i * 0.25 + 0.3;
          const dropProg = clamp01((localTime - tokStart) / 0.4);
          const ease = 1 - Math.pow(1 - dropProg, 3);
          const y = lerp(-40, 0, ease);
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "200px 1fr 200px", padding: "18px 32px", borderBottom: i < TOKENS.length - 1 ? `1px solid ${COLORS.lineSoft}` : "none", opacity: dropProg, transform: `translateY(${y}px)`, fontFamily: FONTS.sans }}>
              <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.inkMute, letterSpacing: "0.18em", textTransform: "uppercase", alignSelf: "center" }}>{tok.val}</span>
              <span style={{ fontSize: 20, color: COLORS.ink, alignSelf: "center" }}>{tok.label}</span>
              <span style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.green, textAlign: "right", alignSelf: "center" }}>✓ parsed</span>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 32, fontFamily: FONTS.mono, fontSize: 14, color: COLORS.inkMute, letterSpacing: "0.18em", textTransform: "uppercase" }}>
        TRANSACTIONS PARSED · <span style={{ color: COLORS.coral, fontSize: 28, fontWeight: 600, fontFamily: FONTS.sans, letterSpacing: "-0.02em", marginLeft: 8 }}>{counter.toLocaleString()}</span>
      </div>
    </div>
  );
}

// ── Scene 4 — Dashboard ─────────────────────────────────────────────────────
const BANK_ACCOUNTS = [
  { bank: "TBC Bank",        balance: 1842, color: "#4a90d9" },
  { bank: "Bank of Georgia", balance: 3241, color: COLORS.coral },
  { bank: "Credo Bank",      balance: 892,  color: COLORS.green },
];
const TOTAL_BALANCE = BANK_ACCOUNTS.reduce((s, b) => s + b.balance, 0);

function Scene4() {
  const { localTime, duration } = useSprite();
  const fade = clamp01(localTime / 0.4) * clamp01((duration - localTime) / 0.5);
  const sparkProg = clamp01((localTime - 0.6) / 2.5);
  const livePanel = clamp01((localTime - 2.5) / 0.6);
  const ease3 = (t: number) => 1 - Math.pow(1 - t, 3);
  const totalProg = ease3(clamp01((localTime - 0.9) / 0.6));
  const totalNum = Math.floor(lerp(0, TOTAL_BALANCE, totalProg));
  const points = [40, 60, 50, 75, 55, 80, 65, 90, 70, 95, 85, 100];
  const visiblePoints = Math.floor(points.length * sparkProg);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: fade, padding: "120px 96px", display: "flex", flexDirection: "column" }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.inkMute, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 24 }}>
        <span style={{ color: COLORS.coral, marginRight: 14 }}>04</span>MULTIBANK OVERVIEW
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 32, flex: 1 }}>
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.lineSoft}`, borderRadius: 18, padding: "36px 44px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
            {BANK_ACCOUNTS.map((b, i) => {
              const p = ease3(clamp01((localTime - 0.3 - i * 0.2) / 0.5));
              const bNum = Math.floor(lerp(0, b.balance, ease3(clamp01((localTime - 0.3 - i * 0.2) / 0.8))));
              return (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: COLORS.surface2, borderRadius: 12, border: `1px solid ${COLORS.lineSoft}`, opacity: p, transform: `translateX(${lerp(-24, 0, p)}px)` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 5, background: b.color }} />
                    <span style={{ fontFamily: FONTS.sans, fontSize: 20, color: COLORS.ink }}>{b.bank}</span>
                  </div>
                  <span style={{ fontFamily: FONTS.mono, fontSize: 22, color: COLORS.ink }}>₾{bNum.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
          <div style={{ borderTop: `1px solid ${COLORS.lineSoft}`, paddingTop: 20, marginBottom: 28, opacity: totalProg }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.inkMute, letterSpacing: "0.22em", textTransform: "uppercase" }}>COMBINED TOTAL</div>
              <div style={{ fontFamily: FONTS.sans, fontSize: 72, fontWeight: 500, color: COLORS.coral, letterSpacing: "-0.04em", lineHeight: 1 }}>₾{totalNum.toLocaleString()}</div>
            </div>
          </div>
          <div style={{ flex: 1, position: "relative" }}>
            <svg width="100%" height="180" viewBox="0 0 600 180" preserveAspectRatio="none" style={{ display: "block" }}>
              <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.coral} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={COLORS.coral} stopOpacity={0} />
                </linearGradient>
              </defs>
              {(() => {
                const pts = points.slice(0, Math.max(2, visiblePoints + 1));
                const w = 600, h = 180, pad = 16;
                const stepX = (w - pad * 2) / (points.length - 1);
                const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${pad + i * stepX} ${h - pad - (p / 100) * (h - pad * 2)}`).join(" ");
                const fill = path + ` L ${pad + (pts.length - 1) * stepX} ${h - pad} L ${pad} ${h - pad} Z`;
                return (<><path d={fill} fill="url(#sg)" /><path d={path} fill="none" stroke={COLORS.coral} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" /></>);
              })()}
            </svg>
            <div style={{ position: "absolute", bottom: 0, left: 16, right: 16, display: "flex", justifyContent: "space-between", fontFamily: FONTS.mono, fontSize: 12, color: COLORS.inkMute, letterSpacing: "0.18em" }}>
              <span>SEP</span><span>DEC</span><span>MAR</span><span>MAY</span>
            </div>
          </div>
        </div>
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.lineSoft}`, borderRadius: 18, padding: "32px", opacity: livePanel, transform: `translateX(${lerp(60, 0, livePanel)}px)`, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.inkMute, letterSpacing: "0.22em", textTransform: "uppercase" }}>TODAY &amp; RECENT</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: FONTS.mono, fontSize: 11, color: COLORS.green, letterSpacing: "0.2em" }}>
              <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 4, background: COLORS.green }} />
              LIVE
            </div>
          </div>
          {[
            { m: "Wolt",            cat: "Food",       v: "-₾89.00" },
            { m: "Spar Express",    cat: "Groceries",  v: "-₾24.50" },
            { m: "Glovo (refund)",  cat: "Food",       v: "+₾12.00" },
            { m: "Netflix",         cat: "Subs",       v: "-₾49.99" },
            { m: "ATM Vake",        cat: "Cash",       v: "-₾200.00" },
          ].map((r, i) => {
            const stagger = clamp01((localTime - 2.8 - i * 0.12) / 0.3);
            return (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "12px 0", borderBottom: `1px solid ${COLORS.lineSoft}`, opacity: stagger, transform: `translateX(${lerp(20, 0, stagger)}px)` }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontFamily: FONTS.sans, fontSize: 18, color: COLORS.ink }}>{r.m}</span>
                  <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.inkMute, letterSpacing: "0.18em", textTransform: "uppercase", marginTop: 2 }}>{r.cat}</span>
                </div>
                <span style={{ fontFamily: FONTS.mono, fontSize: 18, color: r.v.startsWith("+") ? COLORS.green : COLORS.ink }}>{r.v}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Scene 5 — Search ────────────────────────────────────────────────────────
function Scene5() {
  const { localTime, duration } = useSprite();
  const fade = clamp01(localTime / 0.3) * clamp01((duration - localTime) / 0.4);
  const query = "coffee in tbilisi after 10pm";
  const typeProg = clamp01((localTime - 0.3) / 1.4);
  const typed = query.slice(0, Math.floor(query.length * typeProg));
  const showResults = clamp01((localTime - 1.9) / 0.4);
  const results = [
    { m: "Coffee LM · 22:14",       v: "-₾18.50" },
    { m: "Stamba Lobby Bar · 23:02", v: "-₾112.90" },
    { m: "FLT*ONECLUB · 22:37",     v: "-₾65.70" },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, opacity: fade, padding: "140px 96px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start" }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.inkMute, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 32 }}>
        <span style={{ color: COLORS.coral, marginRight: 14 }}>05</span>SEARCH
      </div>
      <div style={{ width: 1400, background: COLORS.surface, border: `1px solid ${COLORS.line}`, borderRadius: 18, padding: "24px 32px", display: "flex", alignItems: "center", gap: 18, boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
        <span style={{ fontFamily: FONTS.mono, fontSize: 24, color: COLORS.coral }}>⌕</span>
        <span style={{ fontFamily: FONTS.sans, fontSize: 36, color: COLORS.ink, letterSpacing: "-0.01em" }}>
          {typed}
          <span style={{ display: "inline-block", width: 3, height: 36, background: COLORS.coral, marginLeft: 4, verticalAlign: "middle", opacity: Math.floor(localTime * 2) % 2 ? 1 : 0 }} />
        </span>
      </div>
      <div style={{ marginTop: 32, width: 1400, opacity: showResults, transform: `translateY(${lerp(20, 0, showResults)}px)` }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONTS.mono, fontSize: 13, color: COLORS.inkMute, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 14 }}>
          <span>3 RESULTS</span>
          <span style={{ color: COLORS.coral }}>TOTAL · ₾197.10</span>
        </div>
        {results.map((r, i) => {
          const rowProg = clamp01((localTime - 2.0 - i * 0.15) / 0.3);
          return (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 28px", background: COLORS.surface, border: `1px solid ${COLORS.lineSoft}`, borderRadius: 12, marginBottom: 10, opacity: rowProg, transform: `translateY(${lerp(15, 0, rowProg)}px)` }}>
              <span style={{ fontFamily: FONTS.sans, fontSize: 22, color: COLORS.ink }}>{r.m}</span>
              <span style={{ fontFamily: FONTS.mono, fontSize: 22, color: COLORS.ink }}>{r.v}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Scene 6 — Categories + budget ──────────────────────────────────────────
function Scene6() {
  const { localTime, duration } = useSprite();
  const fade = clamp01(localTime / 0.3) * clamp01((duration - localTime) / 0.4);
  const ringProg = clamp01((localTime - 1.0) / 1.6);
  const r = 110, c = 2 * Math.PI * r;

  return (
    <div style={{ position: "absolute", inset: 0, opacity: fade, padding: "140px 96px", display: "flex", flexDirection: "column" }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.inkMute, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 32 }}>
        <span style={{ color: COLORS.coral, marginRight: 14 }}>06</span>CATEGORIES &amp; BUDGETS
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 48, flex: 1 }}>
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.lineSoft}`, borderRadius: 18, padding: "32px" }}>
          {[
            { c: "Food & drink",   v: "₾1,204", col: COLORS.coral },
            { c: "Groceries",      v: "₾868",   col: "#6da6ff" },
            { c: "Transport",      v: "₾312",   col: "#c39bff" },
            { c: "Subscriptions",  v: "₾410",   col: COLORS.green, drag: true },
          ].map((cat, i) => {
            const appear = clamp01((localTime - i * 0.15) / 0.4);
            const dragOffset = cat.drag ? Math.sin(localTime * 2.5) * 8 * clamp01((localTime - 1.5) / 0.5) : 0;
            return (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", borderBottom: i < 3 ? `1px solid ${COLORS.lineSoft}` : "none", opacity: appear, transform: cat.drag ? `translate(${dragOffset}px, ${-dragOffset * 0.5}px)` : "none", background: cat.drag && localTime > 1.5 ? "rgba(232,93,74,0.05)" : "transparent", borderRadius: cat.drag ? 8 : 0, paddingLeft: cat.drag ? 10 : 0, paddingRight: cat.drag ? 10 : 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 5, background: cat.col }} />
                  <span style={{ fontFamily: FONTS.sans, fontSize: 24, color: COLORS.ink }}>{cat.c}</span>
                  {cat.drag && localTime > 1.4 && <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.coral, letterSpacing: "0.2em", marginLeft: 8 }}>· DRAGGING</span>}
                </div>
                <span style={{ fontFamily: FONTS.mono, fontSize: 22, color: COLORS.ink }}>{cat.v}</span>
              </div>
            );
          })}
        </div>
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.lineSoft}`, borderRadius: 18, padding: "32px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.inkMute, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 8 }}>MONTHLY · FOOD &amp; DRINK</div>
          <svg width="280" height="280" viewBox="0 0 280 280">
            <circle cx="140" cy="140" r={r} fill="none" stroke={COLORS.lineSoft} strokeWidth="14" />
            <circle cx="140" cy="140" r={r} fill="none" stroke={COLORS.coral} strokeWidth="14"
              strokeDasharray={c} strokeDashoffset={c * (1 - ringProg * 0.78)}
              strokeLinecap="round" transform="rotate(-90 140 140)"
              style={{ filter: `drop-shadow(0 0 12px ${COLORS.coral})` }} />
            <text x="140" y="138" textAnchor="middle" fontFamily={FONTS.sans} fontSize="56" fontWeight="500" fill={COLORS.ink} letterSpacing="-0.03em">
              ₾{Math.floor(312 * ringProg)}
            </text>
            <text x="140" y="172" textAnchor="middle" fontFamily={FONTS.mono} fontSize="14" fill={COLORS.inkMute} letterSpacing="0.18em">
              OF ₾400
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}

// ── Scene 7 — Assistant ─────────────────────────────────────────────────────
function Scene7() {
  const { localTime, duration } = useSprite();
  const fade = clamp01(localTime / 0.3) * clamp01((duration - localTime) / 0.4);
  const headlineEnd = 1.3;
  const headlineFade = localTime < headlineEnd ? clamp01(localTime / 0.3) * clamp01((headlineEnd - localTime) / 0.4) : 0;
  const chatProg = clamp01((localTime - headlineEnd) / 0.5);
  const answer = "₾284 on food, ₾112 groceries, ₾89 transport. Wolt was top — six orders.";
  const typeProg = clamp01((localTime - headlineEnd - 0.7) / 1.8);
  const typed = answer.slice(0, Math.floor(answer.length * typeProg));

  return (
    <div style={{ position: "absolute", inset: 0, opacity: fade, padding: "140px 96px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {headlineFade > 0 && (
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", opacity: headlineFade }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.inkMute, letterSpacing: "0.32em", textTransform: "uppercase", marginBottom: 24 }}>MEET</div>
            <div style={{ fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 200, color: COLORS.coral, letterSpacing: "-0.02em", lineHeight: 0.95 }}>Xarji AI</div>
          </div>
        </div>
      )}
      <div style={{ width: 1400, opacity: chatProg, transform: `scale(${lerp(0.95, 1, chatProg)})` }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.lineSoft}`, borderRadius: "18px 18px 4px 18px", padding: "18px 24px", fontFamily: FONTS.sans, fontSize: 24, color: COLORS.ink, maxWidth: 900 }}>
            Where did my money go last week?
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 18 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: COLORS.coral, display: "grid", placeItems: "center", fontFamily: FONTS.sans, fontWeight: 700, color: "#fff", fontSize: 22, flexShrink: 0 }}>x</div>
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.lineSoft}`, borderRadius: "4px 18px 18px 18px", padding: "24px 32px", fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 34, color: COLORS.ink, lineHeight: 1.4, letterSpacing: "-0.005em", flex: 1, minHeight: 120 }}>
            {typed}
            <span style={{ display: "inline-block", width: 14, height: 24, background: COLORS.coral, marginLeft: 4, verticalAlign: "middle", opacity: typeProg < 1 && Math.floor(localTime * 2.5) % 2 ? 1 : 0 }} />
          </div>
        </div>
        <div style={{ marginTop: 24, marginLeft: 62, fontFamily: FONTS.mono, fontSize: 13, color: COLORS.inkMute, letterSpacing: "0.22em", textTransform: "uppercase", opacity: typeProg }}>
          <span style={{ color: COLORS.green }}>● </span>
          GPT or Claude · your API key
        </div>
      </div>
    </div>
  );
}

// ── Scene 8 — Local-first ───────────────────────────────────────────────────
function Scene8() {
  const { localTime, duration } = useSprite();
  const fade = clamp01(localTime / 0.4) * clamp01((duration - localTime) / 0.5);
  const ringProg = clamp01((localTime - 0.3) / 1.2);
  const labels = [
    { t: "Your keys.",    start: 1.3 },
    { t: "Your data.",    start: 2.1 },
    { t: "Your machine.", start: 2.9 },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, opacity: fade, padding: "140px 96px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.inkMute, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 36 }}>
        <span style={{ color: COLORS.green, marginRight: 14 }}>07</span>LOCAL-FIRST · NO SERVER · NO TELEMETRY
      </div>
      <div style={{ position: "relative", width: 1100, height: 600 }}>
        <svg width="100%" height="100%" viewBox="0 0 1100 600" style={{ position: "absolute", inset: 0 }}>
          <rect x="20" y="20" width="1060" height="560" rx="28"
            fill={COLORS.surface} stroke={COLORS.coral} strokeWidth="3"
            strokeDasharray={`${2 * 1060 + 2 * 560} ${2 * 1060 + 2 * 560}`}
            strokeDashoffset={(2 * 1060 + 2 * 560) * (1 - ringProg)}
            style={{ filter: `drop-shadow(0 0 16px ${COLORS.coral})` }} />
          <g opacity="0.5">
            <rect x="60" y="60" width="200" height="32" rx="6" fill={COLORS.lineSoft} />
            <rect x="60" y="120" width="500" height="80" rx="10" fill={COLORS.lineSoft} />
            <rect x="60" y="220" width="980" height="6" rx="3" fill={COLORS.lineSoft} />
            <rect x="60" y="260" width="980" height="6" rx="3" fill={COLORS.lineSoft} />
            <rect x="60" y="300" width="980" height="6" rx="3" fill={COLORS.lineSoft} />
            <rect x="60" y="340" width="600" height="6" rx="3" fill={COLORS.lineSoft} />
            <rect x="700" y="60" width="340" height="160" rx="10" fill={COLORS.lineSoft} />
          </g>
        </svg>
        <div style={{ position: "absolute", top: -30, right: -20, fontFamily: FONTS.mono, fontSize: 13, color: COLORS.coral, letterSpacing: "0.22em", textTransform: "uppercase", opacity: ringProg }}>
          ↘ DATA NEVER CROSSES THIS LINE
        </div>
      </div>
      <div style={{ marginTop: 60, display: "flex", gap: 80 }}>
        {labels.map((l, i) => {
          const p = clamp01((localTime - l.start) / 0.5);
          return (
            <div key={i} style={{ opacity: p, transform: `translateY(${lerp(20, 0, p)}px)`, fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 64, color: COLORS.ink, letterSpacing: "-0.01em" }}>
              {l.t}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 28, fontFamily: FONTS.mono, fontSize: 14, color: COLORS.inkMute, letterSpacing: "0.32em", textTransform: "uppercase" }}>
        SELF-HOSTED · OPEN SOURCE
      </div>
    </div>
  );
}

// ── Scene 9 — Close ─────────────────────────────────────────────────────────
function Scene9() {
  const { localTime, duration } = useSprite();
  const fade = clamp01(localTime / 0.5) * clamp01((duration - localTime) / 0.6);
  const ease3 = (t: number) => 1 - Math.pow(1 - t, 3);
  const tagProg = clamp01((localTime - 0.2) / 0.8);
  const tagFadeOut = localTime > 4.0 ? clamp01(1 - (localTime - 4.0) / 0.7) : 1;
  const wordmarkProg = ease3(clamp01((localTime - 4.5) / 0.9));
  const urlProg = ease3(clamp01((localTime - 5.6) / 0.5));
  const ctaProg = ease3(clamp01((localTime - 6.2) / 0.6));
  const badgeProg = ease3(clamp01((localTime - 7.0) / 0.5));

  return (
    <div style={{ position: "absolute", inset: 0, background: "#000", opacity: fade, display: "grid", placeItems: "center" }}>
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ opacity: tagProg * tagFadeOut, fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 140, color: COLORS.ink, letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 48 }}>
          Talk to your <span style={{ color: COLORS.coral }}>money.</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, opacity: wordmarkProg, transform: `scale(${lerp(0.92, 1, wordmarkProg)})` }}>
          <div style={{ width: 96, height: 96, borderRadius: 22, background: COLORS.coral, display: "grid", placeItems: "center", fontFamily: FONTS.sans, fontWeight: 700, color: "#fff", fontSize: 58, letterSpacing: "-0.04em", boxShadow: "0 0 60px rgba(232,93,74,0.45)" }}>x</div>
          <div style={{ fontFamily: FONTS.sans, fontWeight: 600, fontSize: 140, color: COLORS.ink, letterSpacing: "-0.04em" }}>Xarji</div>
        </div>
        <div style={{ marginTop: 44, opacity: urlProg, fontFamily: FONTS.mono, fontSize: 32, color: COLORS.inkDim, letterSpacing: "0.22em", textTransform: "uppercase", textShadow: "0 0 40px rgba(241,237,232,0.2)" }}>
          xarji.app
        </div>
        <div style={{ marginTop: 40, opacity: ctaProg, transform: `translateY(${lerp(16, 0, ctaProg)}px)`, display: "flex", alignItems: "center", gap: 16, background: "rgba(241,237,232,0.07)", border: "1px solid rgba(241,237,232,0.18)", borderRadius: 18, padding: "18px 36px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
            <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.inkMute, letterSpacing: "0.22em", textTransform: "uppercase" }}>Available for</span>
            <span style={{ fontFamily: FONTS.sans, fontWeight: 600, fontSize: 22, color: COLORS.ink, letterSpacing: "-0.01em" }}>Download for Mac</span>
          </div>
        </div>
        <div style={{ marginTop: 24, opacity: badgeProg, display: "flex", gap: 20, alignItems: "center", fontFamily: FONTS.mono, fontSize: 13, color: COLORS.inkMute, letterSpacing: "0.2em", textTransform: "uppercase" }}>
          <span>macOS 14+</span>
          <span style={{ color: COLORS.lineSoft }}>·</span>
          <span>iPhone iMessage sync</span>
          <span style={{ color: COLORS.lineSoft }}>·</span>
          <span>GPT or Claude · your key</span>
        </div>
      </div>
    </div>
  );
}

// ── Transitions — black flash at each scene cut ──────────────────────────────
const SCENE_CUTS = [5.0, 9.0, 13.0, 16.5, 21.5, 26.5, 30.0, 33.5, 38.0, 45.0];

function Transitions() {
  const time = useTime();
  let opacity = 0;
  for (const cut of SCENE_CUTS) {
    const dt = Math.abs(time - cut);
    if (dt < 0.12) opacity = Math.max(opacity, 1 - dt / 0.12);
  }
  if (opacity < 0.01) return null;
  return <div style={{ position: "absolute", inset: 0, zIndex: 90, background: "#000", opacity, pointerEvents: "none" }} />;
}

// ── Top-level composition ───────────────────────────────────────────────────
export function XarjiVideo() {
  return (
    <>
      <style>{`@keyframes p { 0%,100% { opacity:1 } 50% { opacity:0.3 } }`}</style>
      <Sprite start={T.s0[0]} end={T.s0[1]}><Scene0 /></Sprite>
      <Sprite start={T.sBA[0]} end={T.sBA[1]}><SceneBA /></Sprite>
      <Sprite start={T.s1[0]} end={T.s1[1]}><Scene1 /></Sprite>
      <Sprite start={T.s2[0]} end={T.s2[1]}><Scene2 /></Sprite>
      <Sprite start={T.s3[0]} end={T.s3[1]}><Scene3 /></Sprite>
      <Sprite start={T.s4[0]} end={T.s4[1]}><Scene4 /></Sprite>
      <Sprite start={T.s5[0]} end={T.s5[1]}><Scene5 /></Sprite>
      <Sprite start={T.s6[0]} end={T.s6[1]}><Scene6 /></Sprite>
      <Sprite start={T.s7[0]} end={T.s7[1]}><Scene7 /></Sprite>
      <Sprite start={T.s8[0]} end={T.s8[1]}><Scene8 /></Sprite>
      <Sprite start={T.s9[0]} end={T.s9[1]}><Scene9 /></Sprite>
      <Brand />
      <HUD />
      <Caption />
      <Transitions />
      <Audio src={staticFile("music.mp3")} volume={(f) => f > 1530 ? 0.65 * (1 - (f - 1530) / 90) : 0.65} />
      <SoundEffects />
    </>
  );
}
