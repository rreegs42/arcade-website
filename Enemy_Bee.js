export default class Enemy_Bee {
    left = true;
    start_pos;

    constructor(canvas, velocity) {
        
        this.canvas = canvas;
        this.velocity = velocity;

        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;
        this.width = 30;
        this.height = 30;

        this.start_pos = this.canvas.width/2;
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = "red";
        context.fillRect(this.x, this.y, this.width, this.height);
        this.checkPos();
        this.move();
    }

    checkPos() {
        if (this.x < this.start_pos - 75) {
            this.left = false;
        } else if (this.x > this.start_pos + 75) {
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

}
