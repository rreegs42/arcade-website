export default class Player {
    right = false;
    left = false;

    constructor(canvas, velocity) {
        this.canvas = canvas;
        this.velocity = velocity;

        this.x = this.canvas.width / 2;
        this.y = this.canvas.height - 50;
        this.width = 50;
        this.height = 50;

        document.addEventListener("keydown", this.keydown);
        document.addEventListener("keyup", this.keyup);
    }

    draw(context) {
        this.move();
        this.collideWalls();
        context.fillStyle = "purple";
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    collideWalls() {
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x > this.canvas.width - this.width) {
            this.x = this.canvas.width - this.width;
        }
    }

    move() {
        if (this.right) {
            this.x += this.velocity;
        }
        else if (this.left) {
            this.x -= this.velocity;
        }
    }

    keydown = event => {
        if (event.code == "ArrowRight") {
            this.right = true;
        }
        if (event.code == "ArrowLeft") {
            this.left = true;
        }
    }

    keyup = event => {
        if (event.code == "ArrowRight") {
            this.right = false;
        }
        if (event.code == "ArrowLeft") {
            this.left = false;
        }
    }
}
