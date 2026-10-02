import Player from "./Player.js";
import Enemy_Bee from "./Enemy_Bee.js";
import Bullet from "./Bullet.js"

const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
const startButton = document.querySelector("#start-button");
const COOLDOWN_TIME = 5;
let cooldown = COOLDOWN_TIME;

canvas.width = 650;
canvas.height = 650;
canvas.style.background = "black";

const player = new Player(canvas, 3);
const enemy = new Enemy_Bee(canvas, canvas.width/2, canvas.height/2-20, player);
//const enemy2 = new Enemy_Bee(canvas, canvas.width/2+60, canvas.height/2-20);
//const enemy3 = new Enemy_Bee(canvas, canvas.width/2+120, canvas.height/2-20);
let bullets = [];


function game() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    player.draw(context);
    enemy.draw(context);
    //enemy2.draw(context);
    //enemy3.draw(context);

    window.addEventListener("keydown", (event) => {
        if (event.repeat) return;

        if (player.space) {
            if (cooldown <= 0){
                const bullet = new Bullet(canvas, 6);

                bullet.x = player.x + player.width / 2 - bullet.width / 2;
                bullet.y = player.y - bullet.height;
                
                bullets.push(bullet);
                player.space = false;
                cooldown = COOLDOWN_TIME;
            }
        }
    });
    

    if (cooldown > 0){
        cooldown -= 1;
    }
    let count = 0;
    bullets.forEach(bullet => {
        if(bullet.y < -(bullet.height*2)){
            bullets.splice(count, 1);
            count--;
        } else {
            bullet.draw(context);
        }
        count++
    });
    console.log(count);
}

//Prevents window from moving down when spacebar is pressed.
window.addEventListener('keydown', function(e) {
  if (e.key === ' ' || e.keyCode === 32) {
    const target = e.target;

    e.preventDefault();
  }
});

startButton.addEventListener('click', (event) => {
    setInterval(game, 1000 / 60);
});
