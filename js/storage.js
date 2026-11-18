// সেরা লেভেল ব্রাউজারে সেভ করা
const KEY = "heliBestLevel";
export function loadBest() {
  try { return +localStorage.getItem(KEY) || 1; } catch (e) { return 1; }
}
export function saveBest(n) {
  try { localStorage.setItem(KEY, n); } catch (e) {}
}
