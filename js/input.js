// কিবোর্ড ও টাচ ইনপুট; বাকি কোড শুধু `keys` পড়ে
export const keys = { up: false, down: false, boost: false };

const MAP = { ArrowUp: "up", KeyW: "up", ArrowDown: "down", KeyS: "down", Space: "boost" };

export function initInput(canvas) {
  addEventListener("keydown", (e) => {
    const k = MAP[e.code];
    if (!k) return;
    if (document.activeElement && document.activeElement.tagName === "BUTTON") return;
    e.preventDefault();
    keys[k] = true;
  });
  addEventListener("keyup", (e) => {
    const k = MAP[e.code];
    if (k) keys[k] = false;
  });
  canvas.addEventListener("pointerdown", (e) => {
    const r = canvas.getBoundingClientRect();
    const top = e.clientY - r.top < r.height / 2;
    keys.up = top;
    keys.down = !top;
  });
  addEventListener("pointerup", () => { keys.up = false; keys.down = false; });
}
