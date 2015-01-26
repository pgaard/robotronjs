///<reference path="../Game.ts"/>
///<reference path="Bullet.ts"/>
///<reference path="AnimatedSprite.ts"/>

class Hulk extends RobotronSprite {
    constructor(game: Game, left: number, top: number) {
        super('hulk', game, left, top, "left", Hulk.cells);
        this.speed = 50;
        this.width = Hulk.cells['left'][0].w * 2;
        this.height = Hulk.cells['left'][0].h * 2;
        this.enemy = true;
        this.setRandomDirection();
        this.queueRandomEvent(2, 0, true, () => this.setRandomDirection);
    }

    // TODO: random changing movement towards player, towards family or random
    mover(context: CanvasRenderingContext2D, time: number) {
        this.advanceFrame(time, 200);
        this.fireRandomEvents();
        this.move(time);
    }

    kill(bullet : Bullet){
        if (bullet.velocityX) this.left += 7 * (bullet.velocityX / Math.abs(bullet.velocityX));
        if (bullet.velocityY) this.top += 7 * (bullet.velocityY / Math.abs(bullet.velocityY));
    }

    static cells : ISpriteCells = {
        left: [
            { x: 535, y: 38, w: 24, h: 29 },
            { x: 573, y: 38, w: 24, h: 29 },
            { x: 535, y: 38, w: 24, h: 29 },
            { x: 1, y: 80, w: 24, h: 29}],
        right: [
            { x: 153, y: 81, w: 24, h: 28 },
            { x: 191, y: 81, w: 24, h: 28 },
            { x: 153, y: 81, w: 24, h: 28 },
            { x: 229, y: 81, w: 24, h: 28 }],
        up: [
            { x: 39, y: 81, w: 35, h: 29 },
            { x: 77, y: 81, w: 35, h: 33 },
            { x: 39, y: 81, w: 35, h: 29 },
            { x: 115, y: 81, w: 35, h: 33 }],
        down: [
            { x: 39, y: 81, w: 35, h: 29 },
            { x: 77, y: 81, w: 35, h: 33 },
            { x: 39, y: 81, w: 35, h: 29 },
            { x: 115, y: 81, w: 35, h: 33 }]
    }    
}