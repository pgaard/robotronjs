///<reference path="../Game.ts"/>
///<reference path="AnimatedSprite.ts"/>

class Bonus extends RobotronSprite
{
    startTime: number;

    constructor(game: Game, left: number, top: number, type: string) {
        super('bonus', game, left, top, type.toString(), Bonus.cells);
        this.type = type;
        this.width = 10 * 2;
        this.height = 18 * 2;
        this.startTime = getTimeNow();
        game.addSprite(this);
    }

    mover(context: CanvasRenderingContext2D, time: number) {
        if (getTimeNow() - this.startTime > 2500)
            this.game.removeSprite(this);
    }

    static cells: ISpriteCells = {
        "1000":[{x:37, y:1, w:20, h:10}],
        "2000":[{x:37+1*34, y:1, w:20, h:10}],
        "3000":[{x:37+2*34, y:1, w:20, h:10}],
        "4000":[{x:37+3*34, y:1, w:20, h:10}],
        "5000":[{x:37+4*34, y:1, w:20, h:10}]
    }
}
