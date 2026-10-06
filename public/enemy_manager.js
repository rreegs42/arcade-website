import Enemy_Bee from "./Enemy_Bee.js";

export default class Enemy_Manager {

    constructor(canvas, player){
        this.canvas = canvas;
        this.player = player;
        this.this_list = [];
    }


    choose_image(){
        let img = "Sprites/galaxy_bee_0.png";
        let num = Math.floor(Math.random() * 4);

        switch(num){
            case 0:
                img = "Sprites/galaxy_bee_0.png";
                break;
            case 1:
                img = "Sprites/galaxy_bee_1.png";
                break;
            case 2:
                img = "Sprites/galaxy_bee_2.png";
                break;
            case 3:
                img = "Sprites/galaxy_bee_3.png";
                break;
        }

        return img;
    }

    spawn_enemy_block(){
        let img = this.choose_image();

        const enemy1 = new Enemy_Bee(this.canvas, this.canvas.width/2 + (1 * 30), this.canvas.height/2-20-(0*30), this.player, img);
        const enemy2 = new Enemy_Bee(this.canvas, this.canvas.width/2 + (2 * 30), this.canvas.height/2-20-(0*30), this.player, img);
        const enemy3 = new Enemy_Bee(this.canvas, this.canvas.width/2 + (3 * 30), this.canvas.height/2-20-(0*30), this.player, img);
        const enemy4 = new Enemy_Bee(this.canvas, this.canvas.width/2 + (1 * 30), this.canvas.height/2-20-(2*30), this.player, img);
        const enemy5 = new Enemy_Bee(this.canvas, this.canvas.width/2 + (2 * 30), this.canvas.height/2-20-(2*30), this.player, img);
        const enemy6 = new Enemy_Bee(this.canvas, this.canvas.width/2 + (3 * 30), this.canvas.height/2-20-(2*30), this.player, img);
        const enemy7 = new Enemy_Bee(this.canvas, this.canvas.width/2 + (1 * 30), this.canvas.height/2-20-(4*30), this.player, img);
        const enemy8 = new Enemy_Bee(this.canvas, this.canvas.width/2 + (2 * 30), this.canvas.height/2-20-(4*30), this.player, img);
        const enemy9 = new Enemy_Bee(this.canvas, this.canvas.width/2 + (3 * 30), this.canvas.height/2-20-(4*30), this.player, img);

        this.this_list.push(enemy1)
        this.this_list.push(enemy2)
        this.this_list.push(enemy3)
        this.this_list.push(enemy4)
        this.this_list.push(enemy5)
        this.this_list.push(enemy6)
        this.this_list.push(enemy7)
        this.this_list.push(enemy8)
        this.this_list.push(enemy9)
    }

    clear_list(){
        this.this_list = []
    }
}
