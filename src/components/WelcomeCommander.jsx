import { useState, useEffect } from "react";

const TOTAL_DURATION = 7000;

const BOOT_LINES = [
  { text: "LWSB TACTICAL OS v2.6.1",     delay: 0 },
  { text: "BIOS CHECK..................OK", delay: 160 },
  { text: "MEMORY TEST: 640K..........OK", delay: 340 },
  { text: "LOADING COMMANDER PROFILE..",  delay: 530 },
  { text: "AUTH TOKEN VERIFIED........OK", delay: 760 },
  { text: "DECRYPTING FIELD DATA......OK", delay: 1000 },
  { text: "",                              delay: 1180 },
  { text: "> IDENTITY CONFIRMED",         delay: 1360, highlight: true },
];

// ─── THE SOUND ───────────────────────────────────────────────────────────────
// Phase 1 (0.0–1.8s): Sub rumble + rising sawtooth sweep — "fuuuuuck"
// Phase 2 (1.8–3.2s): Frequencies converge, shimmer chord locks in
// Phase 3 (3.2–6.5s): Full chord HOLDS and BLOOMS — "goddamn dude" moment
// Phase 4 (6.0–7.0s): Majestic fade
function playTronSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    // Master bus with a soft compressor to glue everything together
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 8;
    compressor.ratio.value = 3;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.25;
    compressor.connect(ctx.destination);

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.85, ctx.currentTime + 0.04); // instant slam
    master.gain.setValueAtTime(0.85, ctx.currentTime + 5.8);
    master.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 6.8);
    master.connect(compressor);

    // ── SUB BASS: The floor drops out ──
    // Two subs slightly detuned for that thick beating low end
    [36, 38.5].forEach((freq) => {
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = "sine";
      sub.frequency.setValueAtTime(freq, ctx.currentTime);
      sub.frequency.exponentialRampToValueAtTime(freq * 1.4, ctx.currentTime + 2.0);
      subGain.gain.setValueAtTime(0.7, ctx.currentTime);
      subGain.gain.setValueAtTime(0.7, ctx.currentTime + 1.8);
      subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.5);
      sub.connect(subGain);
      subGain.connect(master);
      sub.start(ctx.currentTime);
      sub.stop(ctx.currentTime + 3.6);
    });

    // ── THE SWEEP: Sawtooth rocket from basement to sky ──
    const sweep = ctx.createOscillator();
    const sweepGain = ctx.createGain();
    const sweepFilter = ctx.createBiquadFilter();
    sweep.type = "sawtooth";
    // Starts LOW and DIRTY — rockets upward over 2 full seconds
    sweep.frequency.setValueAtTime(55, ctx.currentTime);
    sweep.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 2.0);
    sweepFilter.type = "bandpass";
    sweepFilter.frequency.setValueAtTime(120, ctx.currentTime);
    sweepFilter.frequency.exponentialRampToValueAtTime(2200, ctx.currentTime + 2.0);
    sweepFilter.Q.value = 3.5;
    sweepGain.gain.setValueAtTime(0.5, ctx.currentTime);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.2);
    sweep.connect(sweepFilter);
    sweepFilter.connect(sweepGain);
    sweepGain.connect(master);
    sweep.start(ctx.currentTime);
    sweep.stop(ctx.currentTime + 2.3);

    // ── IMPACT CRACK: Digital noise burst on hit ──
    const crackSize = ctx.sampleRate * 0.12;
    const crackBuf = ctx.createBuffer(1, crackSize, ctx.sampleRate);
    const crackData = crackBuf.getChannelData(0);
    for (let i = 0; i < crackSize; i++) crackData[i] = (Math.random() * 2 - 1);
    const crack = ctx.createBufferSource();
    crack.buffer = crackBuf;
    const crackFilter = ctx.createBiquadFilter();
    crackFilter.type = "highpass";
    crackFilter.frequency.value = 3000;
    const crackGain = ctx.createGain();
    crackGain.gain.setValueAtTime(0.25, ctx.currentTime);
    crackGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    crack.connect(crackFilter);
    crackFilter.connect(crackGain);
    crackGain.connect(master);
    crack.start(ctx.currentTime);

    // ── THE CHORD: Six voices converging — THX DNA ──
    // Starts scattered/detuned, locks into a perfect power chord by 2.0s
    // Then HOLDS and SWELLS — this is the "goddamn dude" moment
    const chordVoices = [
      { target: 220.00,  startMult: 0.45, startT: 0.6,  lockT: 2.0,  vol: 0.18 }, // A3
      { target: 277.18,  startMult: 0.42, startT: 0.7,  lockT: 2.1,  vol: 0.16 }, // C#4
      { target: 329.63,  startMult: 0.50, startT: 0.75, lockT: 2.15, vol: 0.14 }, // E4
      { target: 440.00,  startMult: 0.48, startT: 0.8,  lockT: 2.2,  vol: 0.20 }, // A4
      { target: 659.25,  startMult: 0.55, startT: 0.9,  lockT: 2.3,  vol: 0.13 }, // E5
      { target: 880.00,  startMult: 0.52, startT: 1.0,  lockT: 2.4,  vol: 0.10 }, // A5
    ];

    chordVoices.forEach(({ target, startMult, startT, lockT, vol }) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(target * startMult, ctx.currentTime + startT);
      osc.frequency.exponentialRampToValueAtTime(target, ctx.currentTime + lockT);

      // Fade in as it rises
      oscGain.gain.setValueAtTime(0, ctx.currentTime + startT);
      oscGain.gain.linearRampToValueAtTime(vol * 0.6, ctx.currentTime + lockT);
      // SWELL at lock — the "goddamn" moment
      oscGain.gain.linearRampToValueAtTime(vol, ctx.currentTime + lockT + 0.4);
      // Hold the chord full power
      oscGain.gain.setValueAtTime(vol, ctx.currentTime + 5.5);
      // Majestic fade
      oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 6.8);

      osc.connect(oscGain);
      oscGain.connect(master);
      osc.start(ctx.currentTime + startT);
      osc.stop(ctx.currentTime + 7.0);
    });

    // ── SUSTAIN SHIMMER: High frequency air on top of the chord ──
    const shimmer = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmer.type = "sine";
    shimmer.frequency.setValueAtTime(3520, ctx.currentTime + 2.0); // A7 — pure air
    shimmerGain.gain.setValueAtTime(0, ctx.currentTime + 2.0);
    shimmerGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 2.8);
    shimmerGain.gain.setValueAtTime(0.06, ctx.currentTime + 5.5);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 6.8);
    shimmer.connect(shimmerGain);
    shimmerGain.connect(master);
    shimmer.start(ctx.currentTime + 2.0);
    shimmer.stop(ctx.currentTime + 7.0);

    // ── RESONANT DRONE: The ground beneath everything ──
    const drone = ctx.createOscillator();
    const droneGain = ctx.createGain();
    drone.type = "triangle";
    drone.frequency.setValueAtTime(110, ctx.currentTime + 1.6);
    drone.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 2.5);
    droneGain.gain.setValueAtTime(0, ctx.currentTime + 1.6);
    droneGain.gain.linearRampToValueAtTime(0.32, ctx.currentTime + 2.5);
    droneGain.gain.setValueAtTime(0.32, ctx.currentTime + 5.5);
    droneGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 6.8);
    drone.connect(droneGain);
    droneGain.connect(master);
    drone.start(ctx.currentTime + 1.6);
    drone.stop(ctx.currentTime + 7.0);

    setTimeout(() => ctx.close(), 8000);
  } catch (e) {
    // Silent fail
  }
}

// ─── ROBOTIC VOICE ────────────────────────────────────────────────────────────
// Two separate utterances with a hard pause between BUDDY and COMMANDER
function speakWelcome() {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();

  const makeUtter = (text) => {
    const u = new SpeechSynthesisUtterance(text);
    u.pitch = 0;      // floor — as robotic as it gets
    u.rate = 0.7;     // slow, deliberate, commanding
    u.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((v) =>
      /microsoft david|alex|google uk english male|daniel|reed|fred/i.test(v.name)
    );
    if (preferred) u.voice = preferred;
    return u;
  };

  const line1 = makeUtter("Welcome to Buddy,");
  const line2 = makeUtter("Commander.");

  // Hard pause: don't queue line2 until line1 finishes + 600ms dead silence
  line1.onend = () => {
    setTimeout(() => {
      window.speechSynthesis.speak(line2);
    }, 600); // 600ms of silence — the dramatic beat
  };

  // Voice loading race condition guard
  const speak = () => {
    // Re-apply voice after voices load
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((v) =>
      /microsoft david|alex|google uk english male|daniel|reed|fred/i.test(v.name)
    );
    if (preferred) {
      line1.voice = preferred;
      line2.voice = preferred;
    }
    window.speechSynthesis.speak(line1);
  };

  if (window.speechSynthesis.getVoices().length > 0) {
    speak();
  } else {
    window.speechSynthesis.onvoiceschanged = speak;
  }
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function WelcomeCommander({ onComplete }) {
  const [visibleLines, setVisibleLines]   = useState([]);
  const [showBuddy, setShowBuddy]         = useState(false);
  const [showCommander, setShowCommander] = useState(false);
  const [showSub, setShowSub]             = useState(false);
  const [exiting, setExiting]             = useState(false);
  const [done, setDone]                   = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    // Boot lines
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => setVisibleLines((prev) => [...prev, i]), line.delay);
    });

    // Sound fires instantly on mount (login click = user gesture = audio unlocked)
    playTronSound();

    // "WELCOME TO BUDDY," stamps in at 1.8s — chord is building, sweep still rising
    setTimeout(() => {
      setShowBuddy(true);
      speakWelcome(); // voice starts here
    }, 1800);

    // Hard visual pause — "COMMANDER" stamps in 900ms later
    // Mirrors the 600ms voice pause + lead time
    setTimeout(() => setShowCommander(true), 2800);

    // Subline fades in after commander
    setTimeout(() => setShowSub(true), 3400);

    // Exit sequence
    setTimeout(() => setExiting(true), TOTAL_DURATION - 600);
    setTimeout(() => {
      setDone(true);
      window.speechSynthesis?.cancel();
      onComplete?.();
    }, TOTAL_DURATION + 100);

    // Cursor blink
    const cursorInterval = setInterval(() => setCursorVisible((v) => !v), 530);

    return () => {
      clearInterval(cursorInterval);
      window.speechSynthesis?.cancel();
    };
  }, []);

  if (done) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      background: "#0d0000",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "48px 56px",
      fontFamily: "'Courier New', Courier, monospace",
      overflow: "hidden",
      opacity: exiting ? 0 : 1,
      transition: exiting ? "opacity 0.6s ease-in" : "none",
    }}>
      <style>{`
        @keyframes flicker {
          0%   { opacity: 1; }
          3%   { opacity: 0.82; }
          5%   { opacity: 1; }
          30%  { opacity: 1; }
          31%  { opacity: 0.88; }
          32%  { opacity: 1; }
          70%  { opacity: 1; }
          71%  { opacity: 0.75; }
          72%  { opacity: 1; }
          90%  { opacity: 1; }
          91%  { opacity: 0.92; }
          92%  { opacity: 1; }
        }
        @keyframes bigFlicker {
          0%   { opacity: 1; }
          8%   { opacity: 0.68; }
          9%   { opacity: 1; }
          45%  { opacity: 1; }
          46%  { opacity: 0.58; }
          47%  { opacity: 1; }
          80%  { opacity: 1; }
          81%  { opacity: 0.82; }
          82%  { opacity: 1; }
        }
        @keyframes scanlines {
          0%   { background-position: 0 0; }
          100% { background-position: 0 4px; }
        }
        @keyframes screenJitter {
          0%, 100% { transform: translate(0, 0); }
          20%       { transform: translate(-1px, 0); }
          40%       { transform: translate(1px, 0); }
          60%       { transform: translate(0, -1px); }
          80%       { transform: translate(0, 1px); }
        }
        @keyframes textStamp {
          0%   { opacity: 0; letter-spacing: 0.55em; transform: scale(1.04); }
          55%  { opacity: 1; letter-spacing: 0.1em;  transform: scale(1.0); }
          100% { opacity: 1; letter-spacing: 0.08em; transform: scale(1.0); }
        }
        @keyframes commanderStamp {
          0%   { opacity: 0; letter-spacing: 0.6em;  transform: scale(1.06); }
          50%  { opacity: 1; letter-spacing: 0.1em;  transform: scale(1.0); }
          100% { opacity: 1; letter-spacing: 0.08em; transform: scale(1.0); }
        }
        @keyframes fadeInLine {
          0%  { opacity: 0; }
          100%{ opacity: 1; }
        }
        @keyframes subFade {
          0%  { opacity: 0; transform: translateY(4px); }
          100%{ opacity: 1; transform: translateY(0); }
        }
        @keyframes phosphorGlow {
          0%, 100% { text-shadow: 0 0 6px #ff2200, 0 0 14px #ff2200, 0 0 2px #ff6644; }
          50%       { text-shadow: 0 0 12px #ff2200, 0 0 28px #ff2200, 0 0 5px #ff6644; }
        }
        @keyframes commanderGlow {
          0%, 100% { text-shadow: 0 0 10px #ff2200, 0 0 30px #cc1100, 0 0 60px #880000, 0 0 2px #ff6644; }
          50%       { text-shadow: 0 0 18px #ff3300, 0 0 50px #dd1100, 0 0 90px #990000, 0 0 4px #ff7755; }
        }
        @keyframes vignettePulse {
          0%, 100% { opacity: 0.75; }
          50%       { opacity: 0.55; }
        }
        @keyframes bloomErupt {
          0%   { opacity: 0;   transform: scale(0.7); }
          35%  { opacity: 1;   transform: scale(1.15); }
          100% { opacity: 0.5; transform: scale(1.0); }
        }
        @keyframes bloomCommander {
          0%   { opacity: 0;   transform: scale(0.8); }
          40%  { opacity: 1;   transform: scale(1.2); }
          100% { opacity: 0.7; transform: scale(1.0); }
        }
        .screen-content {
          animation: flicker 5s infinite, screenJitter 9s infinite;
          width: 100%;
        }
        .boot-line        { animation: fadeInLine 0.08s ease-out both; }
        .highlight-line   { animation: phosphorGlow 1.5s infinite; }
        .buddy-line       { animation: textStamp 0.45s cubic-bezier(0.22,1,0.36,1) both, bigFlicker 4s 0.5s infinite; }
        .commander-line   { animation: commanderStamp 0.5s cubic-bezier(0.22,1,0.36,1) both, commanderGlow 2s 0.5s infinite; }
        .sub-line         { animation: subFade 0.6s ease-out both; }
        .bloom-buddy      { animation: bloomErupt 1.2s ease-out both; }
        .bloom-commander  { animation: bloomCommander 1.4s ease-out both; }
      `}</style>

      {/* CRT scanlines */}
      <div style={{
        position: "fixed", inset: 0,
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.16) 2px, rgba(0,0,0,0.16) 4px)",
        pointerEvents: "none", zIndex: 2,
        animation: "scanlines 0.1s linear infinite",
      }} />

      {/* Vignette */}
      <div style={{
        position: "fixed", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.90) 100%)",
        pointerEvents: "none", zIndex: 3,
        animation: "vignettePulse 4s ease-in-out infinite",
      }} />

      {/* Bloom on BUDDY */}
      {showBuddy && (
        <div className="bloom-buddy" style={{
          position: "fixed", inset: 0,
          background: "radial-gradient(ellipse at 28% 58%, rgba(200,20,0,0.16) 0%, transparent 62%)",
          pointerEvents: "none", zIndex: 1,
        }} />
      )}

      {/* Bloom on COMMANDER — bigger, redder */}
      {showCommander && (
        <div className="bloom-commander" style={{
          position: "fixed", inset: 0,
          background: "radial-gradient(ellipse at 32% 65%, rgba(240,10,0,0.24) 0%, transparent 58%)",
          pointerEvents: "none", zIndex: 1,
        }} />
      )}

      {/* Ambient glow */}
      <div style={{
        position: "fixed", inset: 0,
        background: "radial-gradient(ellipse at center, rgba(160,0,0,0.05) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 1,
      }} />

      {/* Content */}
      <div className="screen-content" style={{ position: "relative", zIndex: 4 }}>

        {/* Boot lines */}
        <div style={{ marginBottom: "32px" }}>
          {BOOT_LINES.map((line, i) =>
            visibleLines.includes(i) && (
              <div
                key={i}
                className={`boot-line ${line.highlight ? "highlight-line" : ""}`}
                style={{
                  color: line.highlight ? "#ff4422" : "#cc1100",
                  fontSize: "13px",
                  lineHeight: "1.9",
                  letterSpacing: "0.05em",
                  textShadow: line.highlight
                    ? "0 0 8px #ff2200, 0 0 18px #ff2200"
                    : "0 0 4px #cc1100, 0 0 8px #880000",
                  fontWeight: line.highlight ? "bold" : "normal",
                  minHeight: "1.9em",
                }}
              >
                {line.text}
                {i === BOOT_LINES.length - 1 && (
                  <span style={{
                    display: "inline-block", width: "9px", height: "13px",
                    background: "#cc1100", marginLeft: "4px", verticalAlign: "middle",
                    opacity: cursorVisible ? 1 : 0, boxShadow: "0 0 6px #cc1100",
                  }} />
                )}
              </div>
            )
          )}
        </div>

        {/* Divider */}
        {showBuddy && (
          <div style={{
            borderTop: "1px solid #660000",
            marginBottom: "24px",
            boxShadow: "0 0 10px #550000",
          }} />
        )}

        {/* WELCOME TO BUDDY, */}
        {showBuddy && (
          <div className="buddy-line" style={{
            color: "#cc1100",
            fontSize: "clamp(22px, 4vw, 44px)",
            fontWeight: "bold",
            letterSpacing: "0.08em",
            textShadow: "0 0 8px #ff2200, 0 0 20px #aa1100, 0 0 2px #ff4400",
            lineHeight: 1.1,
            marginBottom: "6px",
          }}>
            WELCOME TO BUDDY,
          </div>
        )}

        {/* ── HARD PAUSE ── then COMMANDER explodes in */}
        {showCommander && (
          <div className="commander-line" style={{
            color: "#ff2200",
            fontSize: "clamp(52px, 10vw, 110px)",
            fontWeight: "bold",
            letterSpacing: "0.08em",
            textShadow: "0 0 10px #ff2200, 0 0 30px #cc1100, 0 0 60px #880000",
            lineHeight: 1,
            marginBottom: "0",
          }}>
            COMMANDER
          </div>
        )}

        {/* Subline */}
        {showSub && (
          <div className="sub-line" style={{
            marginTop: "28px",
            color: "#881100",
            fontSize: "12px",
            letterSpacing: "0.22em",
            textShadow: "0 0 4px #550000",
          }}>
            {"// LAST WAR: SURVIVAL BUDDY — SESSION ACTIVE"}
          </div>
        )}
      </div>
    </div>
  );
}
