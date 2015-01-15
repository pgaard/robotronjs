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
    canKill: boolean = false;
    mustKill: boolean = false;
    score: number = 0;

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

    setRandomDirection() {
        var rand = Math.random() * 4;

        this.velocityX = this.velocityY = 0;

        if (rand < 1) {
            if (this.direction != 'all') this.direction = 'left';
            this.velocityX = -this.speed;
        } else if (rand < 2) {
            if (this.direction != 'all') this.direction = 'right';
            this.velocityX = this.speed;
        } else if (rand < 3) {
            if (this.direction != 'all') this.direction = 'up';
            this.velocityY = -this.speed;
        } else {
            if (this.direction != 'all') this.direction = 'down';
            this.velocityY = this.speed;
        }
    }

    move(time: number, wallBounce: boolean){
        var deltaX = this.game.pixelsPerFrame(time, this.velocityX);
        var deltaY = this.game.pixelsPerFrame(time, this.velocityY);

        if(wallBounce) {
            if (this.left + this.width + deltaX > this.game.right) {
                if (this.direction != 'all') this.direction = 'left';
                this.velocityX = -this.speed;
                deltaX = 0;
            } else if (this.left + deltaX < this.game.left) {
                if (this.direction != 'all') this.direction = 'right';
                this.velocityX = this.speed;
                deltaX = 0;
            }
            if (this.top + this.height + deltaY > this.game.bottom) {
                if (this.direction != 'all') this.direction = 'up';
                this.velocityY = -this.speed;
                deltaY = 0;
            } else if (this.top + deltaY < this.game.top) {
                if (this.direction != 'all') this.direction = 'down';
                this.velocityY = this.speed;
                deltaY = 0;
            }
        }

        this.left += deltaX;
        this.top += deltaY;
    }

    kill(bullet: Bullet) {
    }
}
