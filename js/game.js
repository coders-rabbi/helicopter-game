import { W, H, TARGET, COLORS, levelConfig } from "./config.js";
import { keys } from "./input.js";
import { Helicopter } from "./helicopter.js";
import { Tunnel } from "./tunnel.js";
import { Blocks } from "./obstacles.js";
import { loadBest, saveBest } from "./storage.js";
import { showOverlay, hideOverlay, updateHud, bn } from "./ui.js";
import { withAd } from "./ads.js";
import { resumeAudio, startEngine, stopEngine, setEngine, playCrash } from "./audio.js";

// অবস্থা: "ready" → "play" → "over" (ক্র্যাশ) বা "levelup" (৯৯৯ স্কোর)
export class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.heli = new Helicopter();
    this.tunnel = new Tunnel();
    this.blocks = new Blocks();
    this.best = loadBest();
    this.level = 1; this.score = 0; this.frame = 0; this.travel = 0;
    this.state = "ready";
  }

  showStart() {
    showOverlay({
      title: "হেলিকপ্টার",
      text: `টানেল আর ব্লক এড়িয়ে ${bn(TARGET)} স্কোরে পৌঁছালে পরের লেভেল!`,
      primary: { label: "শুরু করুন", action: () => this.startLevel(1) },
    });
  }

  startLevel(n) {
    this.level = n; this.score = 0; this.frame = 0; this.travel = 0;
    this.heli.reset(); this.tunnel.reset(); this.blocks.reset();
    if (n > this.best) { this.best = n; saveBest(n); }
    this.state = "play";
    hideOverlay();
    resumeAudio();
    startEngine();
  }

  crash() {
    this.state = "over";
    stopEngine();
    playCrash();
    showOverlay({
      title: "গেইম ওভার",
      text: `লেভেল ${bn(this.level)}, স্কোর ${bn(this.score)}`,
      primary: { label: "আবার খেলুন", action: () => withAd(() => this.startLevel(this.level)) },
      secondary: this.level > 1 ? { label: "লেভেল ১ থেকে শুরু", action: () => withAd(() => this.startLevel(1)) } : null,
    });
  }

  levelDone() {
    this.state = "levelup";
    stopEngine();
    showOverlay({
      title: `লেভেল ${bn(this.level)} সম্পন্ন!`,
      text: "পরের লেভেলে গতি বাড়বে, টানেল সরু হবে।",
      primary: { label: "পরের লেভেল", action: () => withAd(() => this.startLevel(this.level + 1)) },
    });
  }

  update() {
    if (this.state !== "play") return;
    const cfg = levelConfig(this.level);
    this.frame++;
    this.heli.update(keys, this.frame);
    setEngine(keys.boost, this.heli.vy);
    const speed = (cfg.speed + this.score / 400) * (keys.boost ? 1.8 : 1);
    this.travel += speed;
    this.tunnel.advance(speed, Math.max(cfg.minGap, 300 - this.score / 5));
    this.blocks.update(speed, this.tunnel, cfg.blockSpacing);
    this.score = Math.min(TARGET, Math.floor(this.travel / 25));

    const r = this.heli.rect;
    if (this.tunnel.hits(r.x, r.w, r.y, r.h) || this.blocks.hits(r)) this.crash();
    else if (this.score >= TARGET) this.levelDone();
  }

  draw() {
    const ctx = this.ctx;
    ctx.fillStyle = COLORS.sky; ctx.fillRect(0, 0, W, H);
    this.tunnel.draw(ctx, COLORS.wall);
    this.blocks.draw(ctx, COLORS.block);
    this.heli.draw(ctx, this.frame);
    updateHud(this.level, this.score, TARGET, this.best);
  }

  run() {
    const loop = () => { this.update(); this.draw(); requestAnimationFrame(loop); };
    loop();
  }
}
