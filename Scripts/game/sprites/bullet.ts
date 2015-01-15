///<reference path="../Game.ts"/>
///<reference path="Sprite.ts"/>

class Bullet extends Sprite {
    velocityX: number;
    velocityY: number;
    bulletSpeed: number;
    bulletLength: number;
    rgbColors: () => string;

    constructor(game: Game, left: number, top: number, shootX: number, shootY: number, rgbColors: () => string ) {
        super('bullet', game, left, top);
        this.rgbColors = rgbColors;
        this.bulletSpeed = 1000;
        this.velocityX = shootX * this.bulletSpeed;
        this.velocityY = shootY * this.bulletSpeed;
        this.bulletLength = 10;
        this.canKill = true;
        game.addSprite(this);
    }

    painter(context: CanvasRenderingContext2D) {
        context.save();
        context.beginPath();
        context.strokeStyle = this.rgbColors();
        var bulletX = 0, bulletY = 0;
        if (this.velocityX > 0) bulletX = this.bulletLength;
        else if (this.velocityX < 0) bulletX = -this.bulletLength;
        if (this.velocityY > 0) bulletY = this.bulletLength;
        else if (this.velocityY < 0) bulletY = -this.bulletLength;

        context.beginPath();
        context.lineWidth = 2;
        context.moveTo(this.left - bulletX, this.top - bulletY);
        context.lineTo(this.left + bulletX, this.top + bulletY);
        context.stroke();
        context.restore();
    }

    mover(context: CanvasRenderingContext2D, time: number) {

        var deltaX = this.game.pixelsPerFrame(time, this.velocityX);
        var deltaY = this.game.pixelsPerFrame(time, this.velocityY);
        if (this.left + deltaX > this.game.right ||
            this.left + deltaX < this.game.left ||
            this.top + deltaY > this.game.bottom ||
            this.top + deltaY < this.game.top) {
            this.game.removeSprite(this);
            return;
        }
        this.left += deltaX;
        this.top += deltaY;
    }
}
    