///<reference path="../Game.ts"/>
///<reference path="Sprite.ts"/>
///<reference path="SprintSheetPainter.ts"/>

// a sprite with a spritesheet, directions, frames and a velocity
class AnimatedSprite extends Sprite{
    direction: string;
    spriteSheetPainter: SpriteSheetPainter;
    velocityX: number = 0;
    velocityY: number = 0;
    lastStepTime: number = 0;
    speed: number;

    constructor(name: string, game: Game, left: number, top: number, startDirection: string, cells: ISpriteCells) {
        super(name, game, left, top);
        this.spriteSheetPainter = new SpriteSheetPainter(cells, game.spritesheet, startDirection, 2)
        this.direction = startDirection;
        game.addSprite(this);
    }

    painter(context:CanvasRenderingContext2D){
        this.spriteSheetPainter.paint(this, context);
    }

    advanceFrame(time: number, stepMs: number, oneShot?: boolean){
        var timeDiff = time - this.lastStepTime;

        if (timeDiff > stepMs) {
            this.spriteSheetPainter.advance(this.direction, oneShot);
            this.lastStepTime = time;
            return true;
        }

        return false;
    }

    adjustMoveDelta(deltaX: number, deltaY: number) {
        return { deltaX: deltaX, deltaY: deltaY };
    }   

    move(time: number){
        var deltaX = this.game.pixelsPerFrame(time, this.velocityX);
        var deltaY = this.game.pixelsPerFrame(time, this.velocityY);

        var deltas = this.adjustMoveDelta(deltaX, deltaY);

        this.left += deltas.deltaX;
        this.top += deltas.deltaY;
    }
}
