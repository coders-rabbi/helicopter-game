import { H, HX, COLORS } from "./config.js";

export class Helicopter {
  constructor() { this.reset(); }

  reset() { this.y = H / 2 - 10; this.vy = 0; this.w = 44; this.h = 20; }

  update(keys, frame) {
    const target = (keys.up ? -4.5 : 0) + (keys.down ? 4.5 : 0);
    this.vy += (target - this.vy) * 0.25;
    this.y += this.vy + Math.sin(frame * 0.08) * 0.35; // হালকা দুলুনি
  }

  get rect() { return { x: HX, y: this.y, w: this.w, h: this.h }; }

  draw(ctx, frame) {
    ctx.save();
    ctx.translate(HX + this.w / 2, this.y + this.h / 2);
    ctx.rotate(this.vy * 0.04);
    ctx.fillStyle = COLORS.heli;
    ctx.beginPath(); ctx.ellipse(0, 0, this.w / 2 - 4, this.h / 2, 0, 0, 7); ctx.fill();
    ctx.fillRect(-this.w / 2 - 6, -3, 18, 5);
    ctx.fillStyle = COLORS.glass;
    ctx.beginPath(); ctx.ellipse(6, -2, 7, 5, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = COLORS.rotor; ctx.lineWidth = 3;
    const r = Math.abs(Math.sin(frame * 0.9)) * 24 + 4;
    const y = -this.h / 2 - 3;
    ctx.beginPath(); ctx.moveTo(-r, y); ctx.lineTo(r, y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -this.h / 2); ctx.lineTo(0, y); ctx.stroke();
    ctx.restore();
  }
}
