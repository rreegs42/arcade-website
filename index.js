import Player from "./Player.js";
import Enemy_Bee from "./Enemy_Bee.js";

const canvas = document.getElementById("game");
const context = canvas.getContext("2d");

canvas.width = 650;
canvas.height = 650;
canvas.style.background = "black";

const player = new Player(canvas, 3);
const enemy = new Enemy_Bee(canvas, 2);

function game() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    player.draw(context);
    enemy.draw(context);
}

setInterval(game, 1000 / 60);
