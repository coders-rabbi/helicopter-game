import { Game } from "./game.js";
import { initInput } from "./input.js";
import { initAudio } from "./audio.js";

const canvas = document.getElementById("c");
initInput(canvas);
initAudio();

const game = new Game(canvas.getContext("2d"));
game.showStart();
game.run();
