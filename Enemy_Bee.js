export default class Enemy_Bee {
    left = true;
    at_home = false;
    start_x;
    start_y;

    constructor(canvas, home_x, home_y) {
        
        this.canvas = canvas;
        this.velocity = 2;

        this.width = 30;
        this.height = 30;

        this.start_x = home_x;
        this.start_y = home_y;

        this.x = -this.width;
        this.y = this.canvas.height + this.width;

    }

    draw(context) {
        context.beginPath();
        context.fillStyle = "red";
        context.fillRect(this.x, this.y, this.width, this.height);

        if (this.at_home){
            this.checkPos();
            this.move();
        } else {
            this.x = this.lerp(this.x, this.start_x, 0.07);
            this.y = this.lerp(this.y, this.start_y, 0.07);
            if(this.start_x - this.x <= 1 && Math.abs(this.start_y - this.y) <= 1){
                this.x = this.start_x;
                this.y = this.start_y;
                this.at_home = true
            }
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

}
