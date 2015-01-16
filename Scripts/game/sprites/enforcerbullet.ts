///<reference path="../Game.ts"/>
///<reference path="AnimatedSprite.ts"/>
///<reference path="Bullet.ts"/>

class EnforcerBullet extends RobotronSprite {
    onEdge: boolean = false;

    constructor(game: Game, left: number, top: number, velocityX: number, velocityY: number) {
        super('enforcerbullet', game, left, top,'all', EnforcerBullet.cells );
        this.width = 14 * 2;
        this.height = 14 * 2;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.enemy = true;
        this.score = 25;
    }

    mover(context: CanvasRenderingContext2D, time: number) {
        this.advanceFrame(time, 100);
        this.move(time);
        if (this.onEdge && Math.random() < .01) {
            this.game.removeSprite(this);
        }
    }

    // override - hug wall
    adjustMoveDelta(deltaX: number, deltaY: number) {
        if ((this.left + this.width + deltaX > this.game.right) ||
            (this.left + deltaX < this.game.left)) {
            this.velocityX = 0;
            this.velocityY = (Math.random() < .5) ? this.speed : -this.speed;
            deltaX = 0;
            this.onEdge = true;
        }
        else if (this.top + this.height + deltaY > this.game.bottom ||
            (this.top + deltaY < this.game.top)) {
            this.velocityY = 0;
            this.velocityX = (Math.random() < .5) ? this.speed : -this.speed;
            deltaY = 0;
            this.onEdge = true;
        }
        return { deltaX: deltaX, deltaY: deltaY };
    }

    kill(bullet: Bullet){
        this.game.removeSprite(this);
    }

    static cells: ISpriteCells = {
        all: [
            { x: 181, y: 123, w: 14, h: 14 },
            { x: 207, y: 123, w: 14, h: 14 },
            { x: 233, y: 123, w: 14, h: 14 },
            { x: 259, y: 123, w: 14, h: 14 }
        ]
    }
}