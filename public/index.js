import Player from "./Player.js";
import Enemy_Bee from "./Enemy_Bee.js";
import Bullet from "./Bullet.js"

const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
const startButton = document.querySelector("#start-button");
const resetButton = document.querySelector("#reset-button");
const COOLDOWN_TIME = 5;
let cooldown = COOLDOWN_TIME;
let playerScore = 0;
let gameStarted = false;

canvas.width = 450;
canvas.height = 550;

const background = new Image();
background.src = "Sprites/galaxy_background.png";
background.onload = function() {
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.font = "bold 40px Ariel";
    context.fillStyle = "lightslateblue";
    context.strokeStyle = "darkslateblue";
    context.lineWidth = 3;
    context.textAlign = "center";
    context.textBaseline = "middle";

    context.fillText("PRESS START", canvas.width / 2, canvas.height / 2);
    context.strokeText("PRESS START", canvas.width / 2, canvas.height / 2);
}

const player = new Player(canvas, 4.5);
const enemy1 = new Enemy_Bee(canvas, canvas.width/2, canvas.height/2-20, player);
const enemy2 = new Enemy_Bee(canvas, canvas.width/2-120, canvas.height/2-40, player);
//const enemy3 = new Enemy_Bee(canvas, canvas.width/2+120, canvas.height/2-20);
let bullets = [];
let enemies = [];

enemies.push(enemy1);
enemies.push(enemy2);

function game() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    player.draw(context);

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

    enemies.forEach(enemy => {
        enemy.draw(context);
    });

    let bullet_count = 0;
    bullets.forEach(bullet => {
        if(bullet.y < -(bullet.height*2)){
            bullets.splice(bullet_count, 1);
            bullet_count--;
        } else {
            let enemy_count = 0;
            enemies.forEach(enemy => {
                if(is_collision(bullet, enemy)){
                    bullets.splice(bullet_count, 1);
                    bullet_count--;
                    enemies.splice(enemy_count, 1);
                    enemy_count--;
                    updateScore(enemy);
                } else {
                    enemy_count++;
                }
            })
            bullet.draw(context);
        }
        bullet_count++
    });
}

//check collisions between rectangles
function is_collision(obj1, obj2){
    return(
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
    );
}

//Prevents window from moving down when spacebar is pressed.
window.addEventListener('keydown', function(e) {
  if (e.key === ' ' || e.keyCode === 32) {
    const target = e.target;

    e.preventDefault();
  }
});

startButton.addEventListener('click', (event) => {
    gameStarted = true;
    setInterval(game, 1000 / 60);
});
resetButton.addEventListener('click', (event) => {
    resetGame();
});

function resetGame() {
    bullets = [];
    enemies = [];

    enemies.push(
        new Enemy_Bee(canvas, canvas.width/2, canvas.height/2-20, player)
    );
    enemies.push (
        new Enemy_Bee(canvas, canvas.width/2-120, canvas.height/2-40, player)
    );

    cooldown = COOLDOWN_TIME;

    playerScore = 0;
    const scoreLabel = document.querySelector("#score");
    scoreLabel.textContent = playerScore;

    player.x = canvas.width / 2;
    player.y = this.canvas.height - this.width * 2;
}

function updateScore(enemy) {
    if (enemy.diving_at_player) {
        playerScore += 20;
    }
    else {
        playerScore += 10;
    }

    const scoreLabel = document.querySelector("#score");
    scoreLabel.textContent = playerScore;
}
