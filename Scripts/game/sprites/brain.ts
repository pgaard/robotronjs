﻿///<reference path="../Game.ts"/>
///<reference path="Bullet.ts"/>
///<reference path="Explosion.ts"/>
///<reference path="AnimatedSprite.ts"/>

class Brain extends RobotronSprite {
    manPosition: ManPositionFunction;
    rgbColors: RgbFunction;

    constructor(game: Game, left: number, top: number, manPosition: ManPositionFunction, rgbColors: RgbFunction) {
        super('brain', game, left, top, "left", Brain.cells );
        this.speed = 50;
        this.width = Brain.cells['left'][0].w * 2;
        this.height = Brain.cells['left'][0].h * 2;
        this.enemy = true;
        this.canKill = true;
        this.mustKill = true;
        this.score = 500;
        this.manPosition = manPosition;
        this.rgbColors = rgbColors;
        this.setRandomDirection();
        this.queueRandomEvent(3, 1, true, () => this.setRandomDirection());
        this.queueRandomEvent(3, 6, true, () => this.fireMissle());
    }

    // TODO: random changing movement towards player, towards family or random
    mover(context: CanvasRenderingContext2D, time: number) {
        this.advanceFrame(time, 200);
        this.fireRandomEvents();
        this.move(time);
    }

    kill(bullet : Bullet){
        var horizontal = Math.abs(bullet.velocityY) > Math.abs(bullet.velocityX);
        var explosion = new Explosion(this.game, this.left, this.top, this.width, this.height, horizontal);
        this.game.playSound("sound_kill");
        this.game.removeSprite(this);
    }

    fireMissle() {
        var missle = new CruiseMissile(this.game, this.centerX(), this.centerY(), this.manPosition, this.rgbColors);
    }

    static cells : ISpriteCells = {
        left: [
            { x: 321, y: 123, w: 22, h: 30 },
            { x: 321 + 38, y: 123, w: 22, h: 30 },
            { x: 321, y: 123, w: 22, h: 30 },
            { x: 321 + 38*2, y: 123, w: 22, h: 30 }],
        right: [
            { x: 321 + 38*3, y: 123, w: 22, h: 30 },
            { x: 321 + 38*4, y: 123, w: 22, h: 30 },
            { x: 321 + 38*3, y: 123, w: 22, h: 30 },
            { x: 321 + 38*5, y: 123, w: 22, h: 30 }],
        up: [
            { x: 1+38*2, y: 165, w: 26, h: 30 },
            { x: 1+38*3, y: 165, w: 26, h: 32 },
            { x: 1+38*4, y: 165, w: 26, h: 30 },
            { x: 1+38*3, y: 165, w: 26, h: 32 }],
        down: [
            { x: 547, y: 123, w: 26, h: 30 },
            { x: 1, y: 165, w: 26, h: 32 },
            { x: 1+38, y: 165, w: 26, h: 32 },
            { x: 1, y: 165, w: 26, h: 32 }]
    }
}