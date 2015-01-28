///<reference path="../Game.ts"/>
///<reference path="sprite.ts"/>

class Explosion extends Sprite {
    horizontal: boolean;
    spacing: number;

    constructor(game : Game, left: number, top: number, width: number, height: number, horizontal: boolean) {
        super('explosion', game, left, top);
        this.height = height;
        this.width = width;
        this.horizontal = horizontal;
        this.spacing = 1;
    }

    painter(context: CanvasRenderingContext2D) {
        context.save();
        context.strokeStyle = 'white';

        var middleX = this.left + this.width / 2;
        var middleY = this.top + this.height / 2;
        var halfHeight = this.height / 2;
        var halfWidth = this.width / 2;
        var explosionWidth = Math.max(1, this.spacing / 4);
        context.lineWidth = 2;

        if (this.horizontal) {

            for (var x = middleX - halfWidth * this.spacing; x < middleX + halfWidth * this.spacing; x += this.spacing) {
                context.beginPath();
                context.moveTo(x, middleY - halfHeight / explosionWidth);
                context.lineTo(x, middleY + halfHeight / explosionWidth);
                context.stroke();
            }
        } else {

            for (var y = middleY - halfHeight * this.spacing; y < middleY + halfHeight * this.spacing; y += this.spacing) {
                context.beginPath();
                context.moveTo(middleX - halfWidth / explosionWidth, y);
                context.lineTo(middleX + halfWidth / explosionWidth, y);
                context.stroke();
            }
        }

        context.restore();
    }
    
    mover(context: CanvasRenderingContext2D, time: number) {
        this.spacing += .5;
        if (this.spacing > 10) {
            this.game.removeSprite(this);
            return;
        }
    }
}