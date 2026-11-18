// HTML ওভারলে (বাটন) ও HUD; গেইমের লজিক এখানে নেই
const $ = (id) => document.getElementById(id);
const el = {
  overlay: $("overlay"), title: $("ov-title"), text: $("ov-text"),
  primary: $("ov-primary"), secondary: $("ov-secondary"),
  level: $("hud-level"), score: $("hud-score"), best: $("hud-best"),
};
let onPrimary = null, onSecondary = null;
el.primary.addEventListener("click", () => onPrimary && onPrimary());
el.secondary.addEventListener("click", () => onSecondary && onSecondary());

const bn = (n) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

export function showOverlay({ title, text, primary, secondary }) {
  el.title.textContent = title;
  el.text.textContent = text;
  el.primary.textContent = primary.label;
  onPrimary = primary.action;
  el.secondary.hidden = !secondary;
  if (secondary) { el.secondary.textContent = secondary.label; onSecondary = secondary.action; }
  el.overlay.hidden = false;
  el.primary.focus();
}

export function hideOverlay() {
  el.overlay.hidden = true;
  if (document.activeElement) document.activeElement.blur();
}

export function updateHud(level, score, target, best) {
  el.level.textContent = "লেভেল " + bn(level);
  el.score.textContent = `স্কোর: ${bn(score)} / ${bn(target)}`;
  el.best.textContent = "সেরা লেভেল: " + bn(best);
}

export { bn };
