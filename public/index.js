import Player from "./Player.js";
import Enemy_Bee from "./Enemy_Bee.js";
import Bullet from "./Bullet.js"
import enemy_manager from "./enemy_manager.js"



const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
const startButton = document.querySelector("#start-button");
const resetButton = document.querySelector("#reset-button");
const COOLDOWN_TIME = 5;
let cooldown = COOLDOWN_TIME;
let playerScore = 0;
let playerLives = 3;
let isGameOver = false;
let heartCooldown = false;
const HEART_COOLDOWN = 500;
let gameInterval = null;

canvas.width = 450;
canvas.height = 550;

const background = new Image();
const heart = new Image();
background.src = "Sprites/galaxy_background.png";
heart.src = "Sprites/heart_placeholder.png";

background.onload = function() {
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.font = "bold 40px Arial";
    context.fillStyle = "lightslateblue";
    context.strokeStyle = "darkslateblue";
    context.lineWidth = 3;
    context.textAlign = "center";
    context.textBaseline = "middle";

    context.fillText("PRESS START", canvas.width / 2, canvas.height / 2);
    context.strokeText("PRESS START", canvas.width / 2, canvas.height / 2);
}
heart.onload = function() {
    console.log("Heart image loaded.");
}
//canvas.style.background = "darkslategrey";

const player = new Player(canvas, 4.5);
let bullets = [];
let enemies = [];


const enemy_manager1 = new enemy_manager(canvas, player);

let temp = true;

function game() {
    if (isGameOver) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    player.draw(context);

    for (let i = 0; i < playerLives; i++) {
        context.drawImage(heart, 10 + i * 65, 10, 50, 50);
    }

    if(temp === true){
        enemy_manager1.spawn_enemy_block();
        temp = false;
        console.log(temp);
    }

    if(enemy_manager1.this_list.length > 0){
        enemy_manager1.this_list.forEach(enemy => {
            enemies.push(enemy);
        });
    }
    
    enemy_manager1.this_list = [];

    if (enemies.length > 0){
        enemies.forEach(enemy => {
            enemy.draw(context);
            console.log("enemy drawn");
        });
    }

    window.addEventListener("keydown", (event) => {
        if (event.repeat) return;

        if (player.space) {
            if (cooldown <= 0){
                const bullet = new Bullet(canvas, 6);

                bullet.x = player.x + player.width / 2 - bullet.width / 2;
                bullet.y = player.y + bullet.height;
                
                bullets.push(bullet);
                player.space = false;
                cooldown = COOLDOWN_TIME;
            }
        }
    });

    if (cooldown > 0){
        cooldown -= 1;
    }

    let bullet_count = 0;
    bullets.forEach(bullet => {
        if(bullet.y < -(bullet.height*2)){
            bullets.splice(bullet_count, 1);
            bullet_count--;
            bullet = null;
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

    //Check player and enemy collision
    enemies.forEach(enemy => {
        if(is_collision(player, enemy)) {
            decreaseLives();
        }
    });

    
    if (playerLives === 0) {
        gameOver();
    }
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
    e.preventDefault();
  }
});

startButton.addEventListener('click', (event) => {
    isGameOver = false;

    if (gameInterval === null) {
        setInterval(game, 1000 / 60);
    }
});
resetButton.addEventListener('click', (event) => {
    resetGame();
});

function decreaseLives() {
    if (heartCooldown) {
        console.log("Heart cooldown.");
        return;
    }

    playerLives--;
    heartCooldown = true;

    setTimeout(() => {
        heartCooldown = false;
        console.log("Heart cooldown over.");
    }, HEART_COOLDOWN);
}

function resetGame() {
    isGameOver = false;

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
    playerLives = 3;
    const scoreLabel = document.querySelector("#score");
    scoreLabel.textContent = playerScore;

    player.x = canvas.width / 2;
    player.y = canvas.height - player.height * 2;
}

function gameOver() {
    isGameOver = true;

    if (gameInterval != null) {
        clearInterval(gameInterval);
        gameInterval = null;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.font = "bold 40px Arial";
    context.fillStyle = "red";
    context.strokeStyle = "darkred";
    context.lineWidth = 3;
    context.textAlign = "center";
    context.textBaseline = "middle";

    context.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    context.strokeText("GAME OVER", canvas.width / 2, canvas.height / 2);
}

function updateScore(enemy) {
    if (!enemy.at_home) {
        playerScore += 20;
    }
    else {
        playerScore += 10;
    }

    const scoreLabel = document.querySelector("#score");
    scoreLabel.textContent = playerScore;
}
