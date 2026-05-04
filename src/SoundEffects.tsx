import { Sequence, Audio, staticFile } from "remotion";

const FPS = 30;
const f = (secs: number) => Math.round(secs * FPS);
const SFX_DUR = 90; // 3s max per cue — enough for any of these clips

function Cue({ frame, src, volume = 1 }: { frame: number; src: string; volume?: number }) {
  return (
    <Sequence from={frame} durationInFrames={SFX_DUR}>
      <Audio src={staticFile(src)} volume={volume} />
    </Sequence>
  );
}

// Scene start times (seconds) — mirror T in video-scenes.tsx
const S = { s1:0, s2:4.0, s3:7.5, s4:12.5, s5:17.5, s6:21.0, s7:24.5, s8:29.0, s9:36.0 };

export function SoundEffects() {
  return (
    <>
      {/* ── Scene transitions: soft whoosh on every cut ── */}
      {[S.s2, S.s3, S.s4, S.s5, S.s6, S.s7, S.s8, S.s9].map((t) => (
        <Cue key={`w${t}`} frame={f(t)} src="sfx/whoosh.mp3" volume={0.55} />
      ))}

      {/* ── Scene 1: ping as each SMS notification appears ── */}
      {[0.3, 0.9, 1.5, 2.1, 2.7].map((offset, i) => (
        <Cue key={`sms${i}`} frame={f(S.s1 + offset)} src="sfx/ping.wav" volume={0.45} />
      ))}

      {/* ── Scene 2: deep impact when wordmark slides in ── */}
      <Cue frame={f(S.s2 + 0.65)} src="sfx/impact.wav" volume={0.75} />

      {/* ── Scene 3: soft click as each parsed row drops in ── */}
      {[0, 1, 2, 3, 4].map((i) => (
        <Cue key={`tok${i}`} frame={f(S.s3 + 0.9 + i * 0.25)} src="sfx/click.wav" volume={0.35} />
      ))}

      {/* ── Scene 4: subtle click per dashboard row stagger ── */}
      {[0, 1, 2, 3, 4].map((i) => (
        <Cue key={`dash${i}`} frame={f(S.s4 + 2.8 + i * 0.12)} src="sfx/click.wav" volume={0.25} />
      ))}

      {/* ── Scene 7: chime when AI starts typing the answer ── */}
      <Cue frame={f(S.s7 + 1.3 + 0.7)} src="sfx/chime.wav" volume={0.5} />

      {/* ── Scene 9: impact when wordmark locks in ── */}
      <Cue frame={f(S.s9 + 3.6)} src="sfx/impact.wav" volume={0.85} />
    </>
  );
}
