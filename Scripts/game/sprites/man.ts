///<reference path="../Game.ts"/>
///<reference path="AnimatedSprite.ts"/>

class Man extends RobotronSprite {
    constructor(game : Game, left: number, top: number) {
        super('man', game, left, top, "down", Man.cells);
        this.speed = 200;
        this.width = 19 * 2;
        this.height = 22 * 2;
    }

    setDirection(left: boolean, right: boolean, up: boolean, down: boolean){
        this.velocityX = right ? this.speed : left ? -this.speed : 0;
        this.velocityY = down ? this.speed : up ? -this.speed : 0;
    }

    mover(context: CanvasRenderingContext2D, time: number) {

        if (this.velocityX != 0 || this.velocityY != 0)
            if (this.advanceFrame(time, 75)) {
                //this.game.playSound("sound_walking");
            }

        this.move(time);
    }

    adjustMoveDelta(deltaX: number, deltaY: number) {
        if (this.velocityX > 0) this.direction = "right";
        else if (this.velocityX < 0) this.direction = "left";
        else if (this.velocityY > 0) this.direction = "down";
        else if (this.velocityY < 0) this.direction = "up";

        if (this.left + this.width + deltaX > this.game.right) {
            this.velocityX = 0;
            deltaX = 0;
        } else if (this.left + deltaX < this.game.left) {
            this.velocityX = 0;
            deltaX = 0;
        }
        if (this.top + this.height + deltaY > this.game.bottom) {
            this.velocityY = 0;
            deltaY = 0;
        } else if (this.top + deltaY < this.game.top) {
            this.velocityY = 0;
            deltaY = 0;
        }
        return {deltaX: deltaX, deltaY: deltaY };
    }

    static cells : ISpriteCells = {
        left: [
            { x: 192, y: 164, w: 11, h: 22 },
            { x: 218, y: 164, w: 11, h: 22}],
        right: [
            { x: 268, y: 164, w: 11, h: 22 },
            { x: 294, y: 164, w: 11, h: 22}],
        down: [
            { x: 346, y: 164, w: 15, h: 22 },
            { x: 372, y: 164, w: 15, h: 22 },
            { x: 346, y: 164, w: 15, h: 22 },
            { x: 398, y: 164, w: 15, h: 22}],
        up: [
            { x: 424, y: 164, w: 15, h: 22 },
            { x: 450, y: 164, w: 15, h: 22 },
            { x: 424, y: 164, w: 15, h: 22 },
            { x: 476, y: 164, w: 15, h: 22}]
    }
}