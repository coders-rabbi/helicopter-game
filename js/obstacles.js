import { W } from "./config.js";

// টানেলের ভেতরের লাল ব্লক; দূরত্ব ধরে আসে, তাই বুস্টেও সমান ফাঁক থাকে
export class Blocks {
  constructor() { this.reset(); }

  reset() { this.list = []; this.travelled = 0; }

  update(speed, tunnel, spacing) {
    this.travelled += speed;
    if (this.travelled >= spacing) {
      this.travelled = 0;
      const s = tunnel.last(), h = 50;
      this.list.push({ x: W + 20, y: s.c - h / 2 + (Math.random() - 0.5) * (s.g - h - 70), w: 26, h });
    }
    this.list.forEach((b) => (b.x -= speed));
    this.list = this.list.filter((b) => b.x + b.w > 0);
  }

  hits(r) {
    return this.list.some((b) => r.x < b.x + b.w && r.x + r.w > b.x && r.y < b.y + b.h && r.y + r.h > b.y);
  }

  draw(ctx, color) {
    ctx.fillStyle = color;
    this.list.forEach((b) => ctx.fillRect(b.x, b.y, b.w, b.h));
  }
}
