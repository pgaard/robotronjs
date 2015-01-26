///<reference path="../Game.ts"/>
///<reference path="AnimatedSprite.ts"/>

class Family extends RobotronSprite{
    constructor(name: string, game: Game, left: number, top: number, cells: ISpriteCells){
        super(name, game, left, top, "left", cells);
        this.speed = 20;
        this.setRandomDirection();
        this.queueRandomEvent(2, 0, true, () => this.setRandomDirection());
    }

    mover(context: CanvasRenderingContext2D, time: number) {
        this.advanceFrame(time, 200);
        this.fireRandomEvents();
        this.move(time);
    }
}