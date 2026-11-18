// সাউন্ড: কোনো অডিও ফাইল ছাড়াই Web Audio API দিয়ে বানানো
// (হেলিকপ্টারের ইঞ্জিন লুপ + ক্র্যাশের আওয়াজ)
let AC = null, nodes = null, muted = false;
try { muted = localStorage.getItem("heliMuted") === "1"; } catch (e) {}
const muteBtn = document.getElementById("mute");

function noiseBuffer(sec) {
  const b = AC.createBuffer(1, AC.sampleRate * sec, AC.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return b;
}

function build() {
  const master = AC.createGain();
  master.gain.value = muted ? 0 : 1;
  master.connect(AC.destination);

  // ইঞ্জিন: নিচু স্বর + পাখার ঘূর্ণনের "থপ থপ" (LFO) + বাতাসের শব্দ
  const engine = AC.createGain(); engine.gain.value = 0; engine.connect(master);
  const body = AC.createOscillator(); body.type = "sawtooth"; body.frequency.value = 58;
  const lp = AC.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 400;
  const chop = AC.createGain(); chop.gain.value = 0.5;
  const lfo = AC.createOscillator(); lfo.type = "sine"; lfo.frequency.value = 13;
  const depth = AC.createGain(); depth.gain.value = 0.5;
  lfo.connect(depth); depth.connect(chop.gain);
  body.connect(chop); chop.connect(lp); lp.connect(engine);

  const air = AC.createBufferSource(); air.buffer = noiseBuffer(2); air.loop = true;
  const bp = AC.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 700; bp.Q.value = 0.6;
  const airGain = AC.createGain(); airGain.gain.value = 0.25;
  air.connect(bp); bp.connect(airGain); airGain.connect(engine);

  body.start(); lfo.start(); air.start();
  return { master, engine, body, lfo };
}

// ব্রাউজার ইউজারের ক্লিকের আগে সাউন্ড চালাতে দেয় না, তাই ক্লিকের ভেতর থেকে ডাকতে হয়
export function resumeAudio() {
  if (!AC) {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return;
    AC = new C();
    nodes = build();
  }
  if (AC.state === "suspended") AC.resume();
}

export function startEngine() {
  if (nodes) nodes.engine.gain.setTargetAtTime(0.2, AC.currentTime, 0.1);
}

export function stopEngine() {
  if (nodes) nodes.engine.gain.setTargetAtTime(0, AC.currentTime, 0.08);
}

// বুস্টে পাখা দ্রুত ঘোরে, ওঠা-নামায় স্বর সামান্য বদলায়
export function setEngine(boost, vy) {
  if (!nodes) return;
  const t = AC.currentTime;
  nodes.lfo.frequency.setTargetAtTime(boost ? 22 : 13, t, 0.15);
  nodes.body.frequency.setTargetAtTime(58 + (boost ? 22 : 0) - vy * 3, t, 0.15);
}

export function playCrash() {
  if (!nodes) return;
  const t = AC.currentTime;
  const n = AC.createBufferSource(); n.buffer = noiseBuffer(1);
  const f = AC.createBiquadFilter(); f.type = "lowpass";
  f.frequency.setValueAtTime(3000, t); f.frequency.exponentialRampToValueAtTime(120, t + 0.8);
  const g = AC.createGain();
  g.gain.setValueAtTime(0.9, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
  n.connect(f); f.connect(g); g.connect(nodes.master);
  n.start(t); n.stop(t + 1);

  const o = AC.createOscillator(); o.type = "sine";
  o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(35, t + 0.5);
  const og = AC.createGain();
  og.gain.setValueAtTime(0.9, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
  o.connect(og); og.connect(nodes.master);
  o.start(t); o.stop(t + 0.7);
}

function paintMute() {
  muteBtn.textContent = muted ? "🔇 সাউন্ড বন্ধ" : "🔊 সাউন্ড চালু";
  muteBtn.setAttribute("aria-pressed", String(muted));
}

export function initAudio() {
  paintMute();
  muteBtn.addEventListener("click", () => {
    muted = !muted;
    try { localStorage.setItem("heliMuted", muted ? "1" : "0"); } catch (e) {}
    if (nodes) nodes.master.gain.setTargetAtTime(muted ? 0 : 1, AC.currentTime, 0.03);
    paintMute();
    muteBtn.blur();
  });
  document.addEventListener("visibilitychange", () => {
    if (!AC) return;
    if (document.hidden) AC.suspend(); else AC.resume();
  });
}
