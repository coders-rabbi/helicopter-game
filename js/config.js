// গেইমের সব ধ্রুবক ও লেভেলের সেটিংস এখানে
export const W = 800, H = 400;   // ক্যানভাসের মাপ
export const SEG = 10;           // টানেলের প্রতিটি অংশের প্রস্থ
export const HX = 120;           // হেলিকপ্টারের স্থির X অবস্থান
export const TARGET = 999;       // এই স্কোরে লেভেল শেষ

export const COLORS = {
  sky: "#1b2a41", wall: "#3b5878", block: "#d9503f",
  heli: "#ffb43a", glass: "#1b2a41", rotor: "#e8edf4",
};

// লেভেল যত বাড়ে, গতি বাড়ে, টানেল সরু হয়, বাধা ঘন হয়
export function levelConfig(n) {
  return {
    speed: 4 + (n - 1) * 0.6,
    minGap: Math.max(120, 170 - (n - 1) * 12),
    blockSpacing: Math.max(260, 440 - (n - 1) * 30),
  };
}

// বিজ্ঞাপনের সেটিংস (Adsterra নেটিভ ব্যানার)
export const ADS = {
  enabled: true,     // false করলে বিজ্ঞাপন বন্ধ
  every: 1,          // প্রতি কয়বার বাটন ক্লিকে একবার বিজ্ঞাপন (১ = প্রতিবার, ৩ = প্রতি তিনবারে একবার)
  countdown: 5,      // কত সেকেন্ড পরে "চালিয়ে যান" বাটন সক্রিয় হবে
  height: 320,       // বিজ্ঞাপনের ফ্রেমের উচ্চতা (px)
  src: "https://bicea.org/21/a9f8edcccd05e377d261fee79a2b7ea8",
  containerId: "container-a9f8edcccd05e377d261fee79a2b7ea8",
};
