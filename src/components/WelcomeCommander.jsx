'use client'

import { useState, useEffect, useRef } from "react";

const TOTAL_DURATION = 8000;

const BOOT_LINES = [
  { text: "LWSB TACTICAL OS v2.6.1",      delay: 0 },
  { text: "BIOS CHECK..................OK",  delay: 160 },
  { text: "MEMORY TEST: 640K..........OK",  delay: 340 },
  { text: "LOADING COMMANDER PROFILE..",   delay: 530 },
  { text: "AUTH TOKEN VERIFIED........OK",  delay: 760 },
  { text: "DECRYPTING FIELD DATA......OK",  delay: 1000 },
  { text: "",                               delay: 1180 },
  { text: "> IDENTITY CONFIRMED",          delay: 1360, highlight: true },
];

// ─── TRON SOUND ──────────────────────────────────────────────────────────────
function playTronSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 8;
    compressor.ratio.value = 3;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.25;
    compressor.connect(ctx.destination);

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.85, ctx.currentTime + 0.04);
    master.gain.setValueAtTime(0.85, ctx.currentTime + 5.8);
    master.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 7.2);
    master.connect(compressor);

    // Sub bass — twin detuned
    [36, 38.5].forEach((freq) => {
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = "sine";
      sub.frequency.setValueAtTime(freq, ctx.currentTime);
      sub.frequency.exponentialRampToValueAtTime(freq * 1.4, ctx.currentTime + 2.0);
      subGain.gain.setValueAtTime(0.7, ctx.currentTime);
      subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.5);
      sub.connect(subGain); subGain.connect(master);
      sub.start(ctx.currentTime); sub.stop(ctx.currentTime + 3.6);
    });

    // Sweep
    const sweep = ctx.createOscillator();
    const sweepGain = ctx.createGain();
    const sweepFilter = ctx.createBiquadFilter();
    sweep.type = "sawtooth";
    sweep.frequency.setValueAtTime(55, ctx.currentTime);
    sweep.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 2.0);
    sweepFilter.type = "bandpass";
    sweepFilter.frequency.setValueAtTime(120, ctx.currentTime);
    sweepFilter.frequency.exponentialRampToValueAtTime(2200, ctx.currentTime + 2.0);
    sweepFilter.Q.value = 3.5;
    sweepGain.gain.setValueAtTime(0.5, ctx.currentTime);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.2);
    sweep.connect(sweepFilter); sweepFilter.connect(sweepGain); sweepGain.connect(master);
    sweep.start(ctx.currentTime); sweep.stop(ctx.currentTime + 2.3);

    // Impact crack
    const crackSize = ctx.sampleRate * 0.12;
    const crackBuf = ctx.createBuffer(1, crackSize, ctx.sampleRate);
    const crackData = crackBuf.getChannelData(0);
    for (let i = 0; i < crackSize; i++) crackData[i] = (Math.random() * 2 - 1);
    const crack = ctx.createBufferSource();
    crack.buffer = crackBuf;
    const crackFilter = ctx.createBiquadFilter();
    crackFilter.type = "highpass"; crackFilter.frequency.value = 3000;
    const crackGain = ctx.createGain();
    crackGain.gain.setValueAtTime(0.25, ctx.currentTime);
    crackGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    crack.connect(crackFilter); crackFilter.connect(crackGain); crackGain.connect(master);
    crack.start(ctx.currentTime);

    // Chord — six voices converging
    const chordVoices = [
      { target: 220.00, startMult: 0.45, startT: 0.6,  lockT: 2.0,  vol: 0.18 },
      { target: 277.18, startMult: 0.42, startT: 0.7,  lockT: 2.1,  vol: 0.16 },
      { target: 329.63, startMult: 0.50, startT: 0.75, lockT: 2.15, vol: 0.14 },
      { target: 440.00, startMult: 0.48, startT: 0.8,  lockT: 2.2,  vol: 0.20 },
      { target: 659.25, startMult: 0.55, startT: 0.9,  lockT: 2.3,  vol: 0.13 },
      { target: 880.00, startMult: 0.52, startT: 1.0,  lockT: 2.4,  vol: 0.10 },
    ];
    chordVoices.forEach(({ target, startMult, startT, lockT, vol }) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(target * startMult, ctx.currentTime + startT);
      osc.frequency.exponentialRampToValueAtTime(target, ctx.currentTime + lockT);
      oscGain.gain.setValueAtTime(0, ctx.currentTime + startT);
      oscGain.gain.linearRampToValueAtTime(vol * 0.6, ctx.currentTime + lockT);
      oscGain.gain.linearRampToValueAtTime(vol, ctx.currentTime + lockT + 0.4);
      oscGain.gain.setValueAtTime(vol, ctx.currentTime + 5.5);
      oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 7.2);
      osc.connect(oscGain); oscGain.connect(master);
      osc.start(ctx.currentTime + startT); osc.stop(ctx.currentTime + 7.5);
    });

    // Shimmer
    const shimmer = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmer.type = "sine"; shimmer.frequency.value = 3520;
    shimmerGain.gain.setValueAtTime(0, ctx.currentTime + 2.0);
    shimmerGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 2.8);
    shimmerGain.gain.setValueAtTime(0.06, ctx.currentTime + 5.5);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 7.2);
    shimmer.connect(shimmerGain); shimmerGain.connect(master);
    shimmer.start(ctx.currentTime + 2.0); shimmer.stop(ctx.currentTime + 7.5);

    // Drone
    const drone = ctx.createOscillator();
    const droneGain = ctx.createGain();
    drone.type = "triangle"; drone.frequency.value = 110;
    droneGain.gain.setValueAtTime(0, ctx.currentTime + 1.6);
    droneGain.gain.linearRampToValueAtTime(0.32, ctx.currentTime + 2.5);
    droneGain.gain.setValueAtTime(0.32, ctx.currentTime + 5.5);
    droneGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 7.2);
    drone.connect(droneGain); droneGain.connect(master);
    drone.start(ctx.currentTime + 1.6); drone.stop(ctx.currentTime + 7.5);

    setTimeout(() => ctx.close(), 9000);
  } catch (e) {}
}

// ─── GLITCHED DOUBLE VOICE ───────────────────────────────────────────────────
// Sub-bass shockwave that fires when COMMANDER hits
function fireCommanderShockwave() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 0.02);
    master.gain.setValueAtTime(0.9, ctx.currentTime + 0.3);
    master.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.2);
    master.connect(ctx.destination);

    // Deep sub thud — the shockwave
    [28, 32, 36].forEach((freq, i) => {
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = "sine";
      sub.frequency.setValueAtTime(freq, ctx.currentTime);
      sub.frequency.exponentialRampToValueAtTime(freq * 0.6, ctx.currentTime + 1.8);
      subGain.gain.setValueAtTime(0.6 - i * 0.1, ctx.currentTime);
      subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);
      sub.connect(subGain); subGain.connect(master);
      sub.start(ctx.currentTime); sub.stop(ctx.currentTime + 2.1);
    });

    // Mid distortion crack on impact
    const crackSize = ctx.sampleRate * 0.08;
    const crackBuf = ctx.createBuffer(1, crackSize, ctx.sampleRate);
    const cd = crackBuf.getChannelData(0);
    for (let i = 0; i < crackSize; i++) cd[i] = (Math.random() * 2 - 1);
    const crack = ctx.createBufferSource();
    crack.buffer = crackBuf;
    const cf = ctx.createBiquadFilter();
    cf.type = "lowpass"; cf.frequency.value = 800;
    const cg = ctx.createGain();
    cg.gain.setValueAtTime(0.4, ctx.currentTime);
    cg.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    crack.connect(cf); cf.connect(cg); cg.connect(master);
    crack.start(ctx.currentTime);

    setTimeout(() => ctx.close(), 3000);
  } catch (e) {}
}

function speakWelcome() {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();

  const getVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    return voices.find((v) =>
      /microsoft david|alex|google uk english male|daniel|reed|fred/i.test(v.name)
    ) || null;
  };

  const speak = () => {
    const voice = getVoice();

    // ── "WELCOME TO BUDDY," ──
    // Cold, deliberate. One ghost echo at low volume for transmission feel.
    const primary = new SpeechSynthesisUtterance("Welcome to Buddy,");
    primary.pitch = 0;
    primary.rate = 0.6;
    primary.volume = 1;
    if (voice) primary.voice = voice;

    const ghost = new SpeechSynthesisUtterance("Welcome to Buddy,");
    ghost.pitch = 0.08;
    ghost.rate = 0.62;
    ghost.volume = 0.22;
    if (voice) ghost.voice = voice;

    // ── "COMMANDER." — ONE VOICE. SURGICAL. INEVITABLE. ──
    // This is Vader. Not chaos — absolute zero.
    // Pitch floored. Rate as slow as the browser will go.
    // The coldness comes from the SILENCE around it, not layers on top of it.
    // Ellipsis makes the TTS engine trail off — lands like a period, not an opener.
    const cmd = new SpeechSynthesisUtterance("Commander...");
    cmd.pitch = 0;
    cmd.rate = 0.42;   // slightly slower than before — sinks rather than punches
    cmd.volume = 1;
    if (voice) cmd.voice = voice;

    // Single room-echo — one ghost at 80ms, near-zero volume
    // Creates depth and space. The word echoing in a vast dark room.
    // That's the Vader quality. Not glitch. VOID.
    const cmdEcho = new SpeechSynthesisUtterance("Commander...");
    cmdEcho.pitch = 0;
    cmdEcho.rate = 0.42;
    cmdEcho.volume = 0.12; // barely audible — just the room talking back
    if (voice) cmdEcho.voice = voice;

    // Fire "Welcome to Buddy,"
    window.speechSynthesis.speak(primary);
    setTimeout(() => window.speechSynthesis.speak(ghost), 160);

    // Tighter pause — 400ms. Still a beat. Hits faster.
    primary.onend = () => {
      setTimeout(() => {
        fireCommanderShockwave();             // sub-bass shockwave synced to voice
        window.speechSynthesis.speak(cmd);
        setTimeout(() => window.speechSynthesis.speak(cmdEcho), 80); // void echo
      }, 400);
    };
  };

  if (window.speechSynthesis.getVoices().length > 0) {
    speak();
  } else {
    window.speechSynthesis.onvoiceschanged = speak;
  }
}

// ─── PIXELATE / TRON DISSOLVE CANVAS ────────────────────────────────────────
function PixelDissolve({ onDone }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width = window.innerWidth;
    const H = canvas.height = window.innerHeight;

    // Phase 1: pixelate — block size grows from 1 → 32
    // Phase 2: scanline haywire — horizontal glitch bars
    // Phase 3: data-stream dissolve to black — columns of pixels drop
    let frame = 0;
    let raf;

    // Build a grid of colored blocks representing the "boot screen"
    // Deep red/black palette — matches the phosphor screen
    const COLS = 80;
    const ROWS = 50;
    const blockW = W / COLS;
    const blockH = H / ROWS;

    // Seed the grid with boot-screen colors
    const grid = Array.from({ length: ROWS }, (_, r) =>
      Array.from({ length: COLS }, (_, c) => {
        const t = (r / ROWS + c / COLS) / 2;
        const brightness = Math.random() * 0.4 + t * 0.2;
        return `rgba(${Math.floor(180 * brightness)},${Math.floor(5 * brightness)},${Math.floor(3 * brightness)},1)`;
      })
    );

    const TOTAL_FRAMES = 55; // ~900ms at 60fps

    const draw = () => {
      const progress = frame / TOTAL_FRAMES; // 0 → 1

      ctx.fillStyle = "#0d0000";
      ctx.fillRect(0, 0, W, H);

      // Phase 1 (0–0.35): Pixelate — blocks get chunkier
      if (progress < 0.35) {
        const pixelScale = 1 + Math.floor(progress / 0.35 * 6);
        const pw = blockW * pixelScale;
        const ph = blockH * pixelScale;
        grid.forEach((row, r) => {
          row.forEach((color, c) => {
            if (Math.random() > 0.04) {
              ctx.fillStyle = color;
              ctx.fillRect(c * blockW, r * blockH, pw, ph);
            }
          });
        });
      }

      // Phase 2 (0.35–0.6): Scanline haywire — horizontal bars glitch and offset
      else if (progress < 0.6) {
        const glitchIntensity = (progress - 0.35) / 0.25;
        grid.forEach((row, r) => {
          const offsetX = (Math.random() - 0.5) * glitchIntensity * 120;
          const scaleY = 1 + Math.random() * glitchIntensity * 3;
          row.forEach((color, c) => {
            if (Math.random() > glitchIntensity * 0.5) {
              ctx.fillStyle = Math.random() > 0.85
                ? `rgba(255,${Math.floor(Math.random()*30)},0,0.9)`
                : color;
              ctx.fillRect(
                c * blockW + offsetX,
                r * blockH,
                blockW * (1 + Math.random()),
                blockH * scaleY
              );
            }
          });
        });

        // Add white/cyan glitch lines
        const numLines = Math.floor(glitchIntensity * 8);
        for (let i = 0; i < numLines; i++) {
          const y = Math.random() * H;
          const lineH = Math.random() * 4 + 1;
          ctx.fillStyle = `rgba(255,30,0,${Math.random() * 0.6})`;
          ctx.fillRect(0, y, W, lineH);
        }
      }

      // Phase 3 (0.6–1.0): Data-stream column dissolve — columns rain downward to black
      else {
        const dissolveProgress = (progress - 0.6) / 0.4;
        grid.forEach((row, r) => {
          row.forEach((color, c) => {
            // Each column has a different drop threshold
            const colThreshold = (c / COLS) * 0.6 + Math.random() * 0.4;
            if (dissolveProgress < colThreshold) {
              const alpha = 1 - (dissolveProgress / colThreshold) * 0.8;
              // Falling effect — shift down as they dissolve
              const dropY = (dissolveProgress / colThreshold) * blockH * 8;
              ctx.fillStyle = color.replace(',1)', `,${alpha})`);
              ctx.fillRect(c * blockW, r * blockH + dropY, blockW + 1, blockH + 1);

              // Data stream: occasional bright red pixel trails
              if (Math.random() > 0.92) {
                ctx.fillStyle = `rgba(255,40,0,${alpha * 0.8})`;
                ctx.fillRect(
                  c * blockW + Math.random() * blockW,
                  r * blockH + dropY + blockH,
                  2,
                  Math.random() * 20 + 5
                );
              }
            }
          });
        });

        // Final flash — brief white scanline before black
        if (dissolveProgress > 0.85) {
          const flashAlpha = (dissolveProgress - 0.85) / 0.15;
          ctx.fillStyle = `rgba(255,20,0,${flashAlpha * 0.3})`;
          ctx.fillRect(0, 0, W, H);
        }
      }

      frame++;
      if (frame <= TOTAL_FRAMES) {
        raf = requestAnimationFrame(draw);
      } else {
        // Hard cut to black, then done
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, W, H);
        setTimeout(onDone, 80);
      }
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "block",
      }}
    />
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function WelcomeCommander({ onComplete }) {
  // phase: "boot" → "dissolve" → "welcome" → "done"
  const [phase, setPhase] = useState("boot");
  const [visibleLines, setVisibleLines]   = useState([]);
  const [showBuddy, setShowBuddy]         = useState(false);
  const [showCommander, setShowCommander] = useState(false);
  const [showSub, setShowSub]             = useState(false);
  const [exiting, setExiting]             = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    // Boot lines
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => setVisibleLines((prev) => [...prev, i]), line.delay);
    });

    // Tron sound fires immediately
    playTronSound();

    // Pause on boot screen, then dissolve
    setTimeout(() => setPhase("dissolve"), 1900);

    // Cursor blink
    const cursorInterval = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(cursorInterval);
  }, []);

  // When dissolve finishes → welcome phase
  const handleDissolveDone = () => {
    setPhase("welcome");
    setShowBuddy(true);
    speakWelcome();

    setTimeout(() => setShowCommander(true), 1000);
    setTimeout(() => setShowSub(true), 1700);
    setTimeout(() => setExiting(true), TOTAL_DURATION - 2900 - 600);
    setTimeout(() => {
      window.speechSynthesis?.cancel();
      onComplete?.();
    }, TOTAL_DURATION - 2900);
  };

  // ── DISSOLVE PHASE ──
  if (phase === "dissolve") {
    return <PixelDissolve onDone={handleDissolveDone} />;
  }

  // ── WELCOME PHASE ──
  if (phase === "welcome") {
    return (
      <div style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#000000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Courier New', Courier, monospace",
        overflow: "hidden",
        opacity: exiting ? 0 : 1,
        transition: exiting ? "opacity 0.7s ease-in" : "none",
      }}>
        <style>{`
          @keyframes bigFlicker {
            0%   { opacity: 1; }
            8%   { opacity: 0.68; }
            9%   { opacity: 1; }
            45%  { opacity: 1; }
            46%  { opacity: 0.55; }
            47%  { opacity: 1; }
            80%  { opacity: 1; }
            81%  { opacity: 0.82; }
            82%  { opacity: 1; }
          }
          @keyframes scanlines {
            0%   { background-position: 0 0; }
            100% { background-position: 0 4px; }
          }
          @keyframes buddyStamp {
            0%   { opacity: 0; letter-spacing: 0.55em; transform: scale(1.05); }
            55%  { opacity: 1; letter-spacing: 0.12em; transform: scale(1.0); }
            100% { opacity: 1; letter-spacing: 0.1em;  transform: scale(1.0); }
          }
          @keyframes commanderStamp {
            0%   { opacity: 0; letter-spacing: 0.7em;  transform: scale(1.08); }
            50%  { opacity: 1; letter-spacing: 0.1em;  transform: scale(1.0); }
            100% { opacity: 1; letter-spacing: 0.08em; transform: scale(1.0); }
          }
          @keyframes subFade {
            0%  { opacity: 0; transform: translateY(6px); }
            100%{ opacity: 1; transform: translateY(0); }
          }
          @keyframes phosphorGlow {
            0%, 100% { text-shadow: 0 0 6px #ff2200, 0 0 14px #ff2200, 0 0 2px #ff6644; }
            50%       { text-shadow: 0 0 12px #ff2200, 0 0 28px #ff2200, 0 0 5px #ff6644; }
          }
          @keyframes commanderGlow {
            0%, 100% { text-shadow: 0 0 12px #ff2200, 0 0 35px #cc1100, 0 0 70px #880000; }
            50%       { text-shadow: 0 0 20px #ff3300, 0 0 60px #dd1100, 0 0 100px #990000; }
          }
          @keyframes bloomErupt {
            0%   { opacity: 0;   transform: scale(0.7); }
            35%  { opacity: 1;   transform: scale(1.2); }
            100% { opacity: 0.6; transform: scale(1.0); }
          }
          @keyframes bloomCommander {
            0%   { opacity: 0;   transform: scale(0.75); }
            40%  { opacity: 1;   transform: scale(1.3); }
            100% { opacity: 0.8; transform: scale(1.0); }
          }
          @keyframes vignettePulse {
            0%, 100% { opacity: 0.8; }
            50%       { opacity: 0.6; }
          }
          .buddy-text {
            animation: buddyStamp 0.5s cubic-bezier(0.22,1,0.36,1) both,
                       bigFlicker 4s 0.5s infinite,
                       phosphorGlow 2.5s 0.5s infinite;
          }
          .commander-text {
            animation: commanderStamp 0.55s cubic-bezier(0.22,1,0.36,1) both,
                       bigFlicker 4s 0.6s infinite,
                       commanderGlow 2s 0.6s infinite;
          }
          .sub-text { animation: subFade 0.7s ease-out both; }
          .bloom-buddy { animation: bloomErupt 1.4s ease-out both; }
          .bloom-commander { animation: bloomCommander 1.6s ease-out both; }
        `}</style>

        {/* CRT scanlines */}
        <div style={{
          position: "fixed", inset: 0,
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
          pointerEvents: "none", zIndex: 2,
          animation: "scanlines 0.1s linear infinite",
        }} />

        {/* Vignette */}
        <div style={{
          position: "fixed", inset: 0,
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.92) 100%)",
          pointerEvents: "none", zIndex: 3,
          animation: "vignettePulse 4s ease-in-out infinite",
        }} />

        {showBuddy && (
          <div className="bloom-buddy" style={{
            position: "fixed", inset: 0,
            background: "radial-gradient(ellipse at 50% 48%, rgba(200,20,0,0.18) 0%, transparent 60%)",
            pointerEvents: "none", zIndex: 1,
          }} />
        )}
        {showCommander && (
          <div className="bloom-commander" style={{
            position: "fixed", inset: 0,
            background: "radial-gradient(ellipse at 50% 55%, rgba(240,10,0,0.26) 0%, transparent 55%)",
            pointerEvents: "none", zIndex: 1,
          }} />
        )}

        {/* CENTER STAGE */}
        <div style={{
          position: "relative",
          zIndex: 4,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          {showBuddy && (
            <div className="buddy-text" style={{
              color: "#cc1100",
              fontSize: "clamp(24px, 4.5vw, 48px)",
              fontWeight: "bold",
              letterSpacing: "0.1em",
              lineHeight: 1.1,
              marginBottom: "8px",
            }}>
              WELCOME TO BUDDY,
            </div>
          )}

          {showCommander && (
            <div className="commander-text" style={{
              color: "#ff2200",
              fontSize: "clamp(58px, 11vw, 120px)",
              fontWeight: "bold",
              letterSpacing: "0.08em",
              lineHeight: 1,
            }}>
              COMMANDER
            </div>
          )}

          {showSub && (
            <div className="sub-text" style={{
              marginTop: "32px",
              color: "#771100",
              fontSize: "11px",
              letterSpacing: "0.25em",
            }}>
              {"// LAST WAR: SURVIVAL BUDDY — SESSION ACTIVE"}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── BOOT PHASE ──
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
    }}>
      <style>{`
        @keyframes flicker {
          0%   { opacity: 1; }  3%  { opacity: 0.82; } 5%  { opacity: 1; }
          30%  { opacity: 1; }  31% { opacity: 0.88; } 32% { opacity: 1; }
          70%  { opacity: 1; }  71% { opacity: 0.75; } 72% { opacity: 1; }
          90%  { opacity: 1; }  91% { opacity: 0.92; } 92% { opacity: 1; }
        }
        @keyframes scanlines2 {
          0%   { background-position: 0 0; }
          100% { background-position: 0 4px; }
        }
        @keyframes screenJitter {
          0%, 100% { transform: translate(0,0); }
          20% { transform: translate(-1px,0); }
          40% { transform: translate(1px,0); }
          60% { transform: translate(0,-1px); }
          80% { transform: translate(0,1px); }
        }
        @keyframes fadeInLine { 0%{opacity:0} 100%{opacity:1} }
        @keyframes phosphorGlow2 {
          0%,100% { text-shadow: 0 0 6px #ff2200,0 0 12px #ff2200,0 0 2px #ff6644; }
          50%      { text-shadow: 0 0 10px #ff2200,0 0 22px #ff2200,0 0 4px #ff6644; }
        }
        @keyframes vignette2 { 0%,100%{opacity:0.7} 50%{opacity:0.5} }
        .boot-screen {
          animation: flicker 5s infinite, screenJitter 9s infinite;
          width: 100%;
        }
        .boot-line { animation: fadeInLine 0.08s ease-out both; }
        .highlight-line { animation: phosphorGlow2 1.5s infinite; }
      `}</style>

      <div style={{
        position: "fixed", inset: 0,
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)",
        pointerEvents: "none", zIndex: 2,
        animation: "scanlines2 0.1s linear infinite",
      }} />
      <div style={{
        position: "fixed", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.88) 100%)",
        pointerEvents: "none", zIndex: 3,
        animation: "vignette2 4s ease-in-out infinite",
      }} />
      <div style={{
        position: "fixed", inset: 0,
        background: "radial-gradient(ellipse at center, rgba(160,0,0,0.05) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 1,
      }} />

      <div className="boot-screen" style={{ position: "relative", zIndex: 4 }}>
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
      </div>
    </div>
  );
}
