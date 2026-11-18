import { W, H, SEG } from "./config.js";

// গুহার ওপর-নিচের দেয়াল; প্রতিটি অংশ = { c: মাঝের রেখা, g: ফাঁকের মাপ }
export class Tunnel {
  constructor() { this.reset(); }

  reset() {
    this.segs = [];
    this.scroll = 0;
    for (let i = 0; i < W / SEG + 3; i++) this.segs.push({ c: H / 2, g: 300 });
  }

  last() { return this.segs[this.segs.length - 1]; }

  advance(dx, targetGap) {
    this.scroll += dx;
    while (this.scroll >= SEG) {
      this.scroll -= SEG;
      this.segs.shift();
      this.add(targetGap);
    }
  }

  add(targetGap) {
    const l = this.last();
    const g = l.g + Math.max(-1, Math.min(1, targetGap - l.g));
    const c = Math.max(g / 2 + 8, Math.min(H - g / 2 - 8, l.c + (Math.random() - 0.5) * 14));
    this.segs.push({ c, g });
  }

  hits(x, w, y, h) {
    const a = Math.floor((x + this.scroll) / SEG);
    const b = Math.floor((x + w + this.scroll) / SEG);
    for (let i = a; i <= b && i < this.segs.length; i++) {
      const s = this.segs[i];
      if (y < s.c - s.g / 2 || y + h > s.c + s.g / 2) return true;
    }
    return false;
  }

  draw(ctx, color) {
    ctx.fillStyle = color;
    this.segs.forEach((s, i) => {
      const x = i * SEG - this.scroll, top = s.c - s.g / 2, bot = s.c + s.g / 2;
      ctx.fillRect(x, 0, SEG + 1, top);
      ctx.fillRect(x, bot, SEG + 1, H - bot);
    });
  }
}
