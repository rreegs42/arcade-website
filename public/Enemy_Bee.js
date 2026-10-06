import Player from "./Player.js";
export default class Enemy_Bee {
    left = true;

    at_home = false;
    spawning = true;
    diving_across = false;
    diving_at_player = false;

    first_dive = true;
    target_x;
    target_y;

    start_x;
    start_y;

    default_swoop_time;

    constructor(canvas, home_x, home_y, player, swoop_time, image) {
        
        this.canvas = canvas;
        this.velocity = 2;

        this.width = 30;
        this.height = 30;

        this.start_x = home_x;
        this.start_y = home_y;

        this.player = player;

        this.x = -this.width;
        this.y = this.canvas.height + this.width;

        this.image = new Image();
        this.image.src = image;

        this.swoop_time = swoop_time;
        this.default_swoop_time = swoop_time;

    }

    draw(context) {
        //console.log("enemy exists");
        context.beginPath();

        context.drawImage(this.image, (this.x), (this.y), this.width, this.height);

        if (this.at_home){
            this.checkPos();
            this.move();
            this.swoop_time -= 2;
            console.log(this.swoop_time);

            if (this.swoop_time <= 0){
                this.dive_across();
                this.at_home = false;
            }
        } else if (this.spawning) {
            this.x = this.lerp(this.x, this.start_x, 0.05);
            this.y = this.lerp(this.y, this.start_y, 0.05);
            if(this.start_x - this.x <= 1 && Math.abs(this.start_y - this.y) <= 1){
                this.x = this.start_x;
                this.y = this.start_y;
                this.at_home = true;
                this.spawning = false;
                this.swoop_time = this.default_swoop_time;
            }
        } else if (this.diving_across) {
            this.dive_across();
        } else if (this.diving_at_player){
            this.dive_at_player();
        }
    }

    checkPos() {
        if (this.x < this.start_x - 50) {
            this.left = false;
        } else if (this.x > this.start_x + 50) {
            this.left = true;
        }
    }

    move() {
        if (!this.left) {
            this.x += this.velocity;
        } else {
            this.x -= this.velocity;
        }
    }

    lerp(start, end, amt) {
        return((1 - amt) * start + amt * end);
    }

    dive_across() {
        this.diving_across = true;
        if(this.x <= 0 || this.x >= this.canvas.width - this.width){
            this.diving_across = false;
            this.dive_at_player();
            this.first_dive = true;
            return;
        }

        if(this.start_x > this.canvas.width/2){
            this.x -= this.velocity * 2;
        } else {
            this.x += this.velocity * 2;
        }
        this.y += this.velocity / 1.5;
    }

    dive_at_player() {
        this.diving_at_player = true;
        if(this.y > this.canvas.height + this.width*2){
            this.y = -this.height;
            this.diving_at_player = false;
            this.spawning = true;
        }

        if(this.first_dive){
            this.target_x = this.player.x;
            this.target_y = this.player.y;
            this.first_dive = false;
        }

        if(this.y < this.player.y){
            let dx = this.target_x - this.x;
            let dy = this.target_y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            this.x += (dx/distance) * this.velocity * 2;
            this.y += (dy/distance) * this.velocity * 3;
        } else {
            this.y += this.velocity * 2;
        }

    }

}
