export default class Bullet {
    constructor (canvas, bVelocity) {
        this.canvas = canvas;
        this.bVelocity = bVelocity;

        this.x = 0;
        this.y = 0;
        this.width = 25;
        this.height = 25;
    }

    draw(context) {
        this.y -= this.bVelocity;
        context.fillStyle = "green";
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}
