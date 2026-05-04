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
  s1: [5.0,  9.0],
  s2: [9.0,  12.5],
  s3: [12.5, 17.5],
  s4: [17.5, 22.5],
  s5: [22.5, 26.0],
  s6: [26.0, 29.5],
  s7: [29.5, 34.0],
  s8: [34.0, 41.0],
  s9: [41.0, 50.0],
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ── Caption bar ─────────────────────────────────────────────────────────────
const VO_LINES = [
  { t: [0,    5.0],  text: "No multibanking catalog. No AI for finance. No budgeting planner. Until now." },
  { t: [5.0,  9.0],  text: "Your bank doesn't send statements anymore. It sends texts." },
  { t: [9.0,  12.5], text: "If you have a Mac and iPhone, iMessage delivers your bank texts automatically." },
  { t: [12.5, 17.5], text: "Every charge, every refund, every merchant — parsed." },
  { t: [17.5, 22.5], text: "Categorized, and sitting on one screen." },
  { t: [22.5, 26.0], text: "Search a sentence." },
  { t: [26.0, 29.5], text: "Set a budget." },
  { t: [29.5, 34.0], text: "Ask the assistant where your money went last week." },
  { t: [34.0, 41.0], text: "It runs locally. Your keys. Your data. Your machine." },
  { t: [41.0, 50.0], text: "Talk to your money. — Xarji" },
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
const PROBLEMS = [
  { text: "No multibanking transaction catalog.", start: 0.5 },
  { text: "No AI for finance analysis.",          start: 1.9 },
  { text: "No budgeting planner.",               start: 3.2 },
];

function Scene0() {
  const { localTime, duration } = useSprite();
  const fade = clamp01(localTime / 0.4) * clamp01((duration - localTime) / 0.5);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: fade, background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 96px" }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.coral, letterSpacing: "0.32em", textTransform: "uppercase", marginBottom: 64 }}>
        THE PROBLEM TODAY
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 36, alignItems: "flex-start" }}>
        {PROBLEMS.map((p, i) => {
          const prog = clamp01((localTime - p.start) / 0.55);
          const ease = 1 - Math.pow(1 - prog, 3);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 28, opacity: ease, transform: `translateY(${lerp(28, 0, ease)}px)` }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, border: `2px solid ${COLORS.coral}`, display: "grid", placeItems: "center", flexShrink: 0, color: COLORS.coral, fontFamily: FONTS.mono, fontSize: 18, fontWeight: 700 }}>
                ×
              </div>
              <span style={{ fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 72, color: COLORS.ink, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                {p.text}
              </span>
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
function Scene4() {
  const { localTime, duration } = useSprite();
  const fade = clamp01(localTime / 0.4) * clamp01((duration - localTime) / 0.5);
  const num = Math.floor(lerp(0, 4287, clamp01(localTime / 2.5)));
  const sparkProg = clamp01((localTime - 0.6) / 2.5);
  const livePanel = clamp01((localTime - 2.5) / 0.6);
  const points = [40, 60, 50, 75, 55, 80, 65, 90, 70, 95, 85, 100];
  const visiblePoints = Math.floor(points.length * sparkProg);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: fade, padding: "120px 96px", display: "flex", flexDirection: "column" }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.inkMute, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 24 }}>
        <span style={{ color: COLORS.coral, marginRight: 14 }}>04</span>OVERVIEW
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 32, flex: 1 }}>
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.lineSoft}`, borderRadius: 18, padding: "40px 48px", display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.inkMute, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 16 }}>SPENT THIS YEAR</div>
          <div style={{ fontFamily: FONTS.sans, fontSize: 160, fontWeight: 500, color: COLORS.coral, letterSpacing: "-0.04em", lineHeight: 1 }}>₾{num.toLocaleString()}</div>
          <div style={{ flex: 1, marginTop: 32, position: "relative" }}>
            <svg width="100%" height="240" viewBox="0 0 600 240" preserveAspectRatio="none" style={{ display: "block" }}>
              <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.coral} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={COLORS.coral} stopOpacity={0} />
                </linearGradient>
              </defs>
              {(() => {
                const pts = points.slice(0, Math.max(2, visiblePoints + 1));
                const w = 600, h = 240, pad = 20;
                const stepX = (w - pad * 2) / (points.length - 1);
                const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${pad + i * stepX} ${h - pad - (p / 100) * (h - pad * 2)}`).join(" ");
                const fill = path + ` L ${pad + (pts.length - 1) * stepX} ${h - pad} L ${pad} ${h - pad} Z`;
                return (
                  <>
                    <path d={fill} fill="url(#sg)" />
                    <path d={path} fill="none" stroke={COLORS.coral} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
                  </>
                );
              })()}
            </svg>
            <div style={{ position: "absolute", bottom: 0, left: 20, right: 20, display: "flex", justifyContent: "space-between", fontFamily: FONTS.mono, fontSize: 12, color: COLORS.inkMute, letterSpacing: "0.18em" }}>
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
          CLAUDE · runs locally · your key
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
  const tagProg = clamp01((localTime - 0.2) / 0.8);
  const tagFadeOut = localTime > 3.2 ? clamp01(1 - (localTime - 3.2) / 0.6) : 1;
  const wordmarkProg = clamp01((localTime - 3.6) / 0.8);
  const urlProg = clamp01((localTime - 5.0) / 0.5);

  return (
    <div style={{ position: "absolute", inset: 0, background: "#000", opacity: fade, display: "grid", placeItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ opacity: tagProg * tagFadeOut, fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 140, color: COLORS.ink, letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 40 }}>
          Talk to your <span style={{ color: COLORS.coral }}>money.</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, opacity: wordmarkProg, transform: `scale(${lerp(0.92, 1, wordmarkProg)})` }}>
          <div style={{ width: 96, height: 96, borderRadius: 22, background: COLORS.coral, display: "grid", placeItems: "center", fontFamily: FONTS.sans, fontWeight: 700, color: "#fff", fontSize: 58, letterSpacing: "-0.04em", boxShadow: "0 0 60px rgba(232,93,74,0.45)" }}>x</div>
          <div style={{ fontFamily: FONTS.sans, fontWeight: 600, fontSize: 140, color: COLORS.ink, letterSpacing: "-0.04em" }}>Xarji</div>
        </div>
        <div style={{ marginTop: 48, opacity: urlProg, fontFamily: FONTS.mono, fontSize: 24, color: COLORS.inkDim, letterSpacing: "0.18em", textTransform: "uppercase" }}>
          xarji.app
        </div>
      </div>
    </div>
  );
}

// ── Top-level composition ───────────────────────────────────────────────────
export function XarjiVideo() {
  return (
    <>
      <style>{`@keyframes p { 0%,100% { opacity:1 } 50% { opacity:0.3 } }`}</style>
      <Sprite start={T.s0[0]} end={T.s0[1]}><Scene0 /></Sprite>
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
      <Audio src={staticFile("music.mp3")} volume={(f) => f > 1410 ? 0.65 * (1 - (f - 1410) / 90) : 0.65} />
      <SoundEffects />
    </>
  );
}
