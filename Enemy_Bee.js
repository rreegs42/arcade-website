export default class Enemy_Bee {
    left = true;
    start_pos;
    start_y;
    at_home = false;

    constructor(canvas, velocity) {
        
        this.canvas = canvas;
        this.velocity = velocity;
        this.start_y = this.canvas.height / 2;
        this.start_pos = this.canvas.width/2;

        this.width = 30;
        this.height = 30;

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
            this.x = this.lerp(this.x, this.start_pos, 0.07);
            this.y = this.lerp(this.y, this.start_y, 0.07);
            //console.log(this.x, ", ", this.y);
            console.log(this.x, ", ", this.y);
        }
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

    lerp(start, end, amt) {
        return((1 - amt) * start + amt * end);
    }

}
