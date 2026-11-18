import { ADS } from "./config.js";
import { bn } from "./ui.js";

// বাটনের কাজের আগে বিজ্ঞাপন দেখায়; শেষে action() চালায়
const gate = document.getElementById("ad-gate");
const slot = document.getElementById("ad-slot");
const btn = document.getElementById("ad-continue");
let clicks = 0, timer = null;

// স্ক্রিপ্টটা আলাদা iframe-এ চালাই, যাতে প্রতিবার নতুন করে লোড হয়
function adDoc() {
  return `<!doctype html><html><body style="margin:0">
<script async="async" data-cfasync="false" src="${ADS.src}"><\/script>
<div id="${ADS.containerId}"></div></body></html>`;
}

export function withAd(action) {
  clicks++;
  if (!ADS.enabled || clicks % ADS.every !== 0) return action();

  slot.innerHTML = "";
  const frame = document.createElement("iframe");
  frame.title = "বিজ্ঞাপন";
  frame.srcdoc = adDoc();
  frame.style.cssText = `width:100%;height:${ADS.height}px;border:0;display:block`;
  slot.appendChild(frame);
  gate.hidden = false;

  let left = ADS.countdown;
  btn.disabled = true;
  btn.textContent = `${bn(left)} সেকেন্ড পরে চালিয়ে যান`;
  clearInterval(timer);
  timer = setInterval(() => {
    left--;
    if (left > 0) { btn.textContent = `${bn(left)} সেকেন্ড পরে চালিয়ে যান`; return; }
    clearInterval(timer);
    btn.disabled = false;
    btn.textContent = "চালিয়ে যান";
  }, 1000);

  btn.onclick = () => {
    gate.hidden = true;
    slot.innerHTML = "";
    btn.blur();
    action();
  };
}
