///<reference path="../Game.ts"/>
///<reference path="AnimatedSprite.ts"/>

class Family extends AnimatedSprite{
    constructor(name: string, game: Game, left: number, top: number, cells: ISpriteCells){
        super(name, game, left, top, "left", cells);
        this.speed = 20;
        this.setRandomDirection();
    }

    mover(context: CanvasRenderingContext2D, time: number) {
        this.advanceFrame(time, 200);
        if (Math.random() < .005) this.setRandomDirection();
        this.move(time, true);
    }
}