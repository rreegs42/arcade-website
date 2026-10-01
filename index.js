import Player from "./Player.js";
import Enemy_Bee from "./Enemy_Bee.js";

const canvas = document.getElementById("game");
const context = canvas.getContext("2d");

canvas.width = 650;
canvas.height = 650;
canvas.style.background = "black";

const player = new Player(canvas, 3);
const enemy = new Enemy_Bee(canvas, canvas.width/2, canvas.height/2-20);
const enemy2 = new Enemy_Bee(canvas, canvas.width/2+60, canvas.height/2-20);
const enemy3 = new Enemy_Bee(canvas, canvas.width/2+120, canvas.height/2-20);


function game() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    player.draw(context);
    enemy.draw(context);
    enemy2.draw(context);
    enemy3.draw(context);

}

setInterval(game, 1000 / 60);
