///<reference path="../Game.ts"/>
///<reference path="AnimatedSprite.ts"/>

class Skull extends RobotronSprite {
    startTime: number;
    constructor(game: Game, left: number, top: number) {
        super('skull', game, left, top, 'all', Skull.cells);
        this.startTime = getTimeNow();
    }

    mover(context: CanvasRenderingContext2D, time: number) {
        if ((getTimeNow() - this.startTime) > 1500)
            this.game.removeSprite(this);
    }

    static cells: ISpriteCells = {
        all: [
            { x: 1, y: 1, w: 22, h: 22 }
        ]
    }
}