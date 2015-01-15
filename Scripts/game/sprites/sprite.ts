///<reference path="../Game.ts" />

// generic sprite
class Sprite {
    game:Game;
    name:string;
    left:number;
    top:number;
    width:number;
    height:number;
    visible:boolean;
    animating:boolean;
    type:string;
    enemy: boolean = false;

    // painter is an object with a method paint(sprint,context) that draws the sprite
    constructor(name:string, game:Game, left:number, top:number) {
        if (name !== undefined) this.name = name;
        this.game = game;
        this.left = left;
        this.top = top;
        this.visible = true;
        this.animating = false;
    }

    paint(context:CanvasRenderingContext2D) {
        if (this.painter !== undefined && this.visible) {
            this.painter(context);
        }
    }

    update(context:CanvasRenderingContext2D, time:number) {
        if (!this.game.paused && !this.game.dead) {
            this.mover(context, time);
        }
    }

    mover(context:CanvasRenderingContext2D, time:number) {
    }

    painter(context:CanvasRenderingContext2D){
    }
}